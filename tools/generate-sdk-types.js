'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(__dirname, 'api-manifest.json');
const generatedDir = path.join(rootDir, 'h5_sdk', 'src', 'generated');
const typesPath = path.join(generatedDir, 'api-types.ts');
const clientPath = path.join(generatedDir, 'api-client.ts');
const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const forbiddenSegments = new Set(['__proto__', 'prototype', 'constructor']);
const supportedBaseTypes = new Set([
  'string',
  'number',
  'boolean',
  'unknown',
  'ApiSummary',
  'NetworkMethod',
  'NetworkHeaders',
  'NetworkResponseType',
  'NetworkBody'
]);
const checkMode = process.argv.includes('--check');

function fail(message) {
  console.error(`[sdk-types] ${message}`);
  process.exit(1);
}

function readManifest() {
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!Array.isArray(parsed)) {
      fail('manifest root must be an array');
    }
    return parsed;
  } catch (error) {
    fail(`cannot read manifest: ${error.message}`);
  }
}

function isSupportedType(type) {
  let baseType = type.trim();
  while (baseType.endsWith('[]')) {
    baseType = baseType.slice(0, -2).trim();
  }
  return supportedBaseTypes.has(baseType);
}

function validateFields(item, fieldName, requireRequired) {
  const fields = item[fieldName];
  if (!Array.isArray(fields)) {
    fail(`${item.action} ${fieldName} must be an array`);
  }

  const names = new Set();
  fields.forEach((field, index) => {
    if (!field || typeof field !== 'object' || Array.isArray(field)) {
      fail(`${item.action} ${fieldName}[${index}] must be an object`);
    }
    if (typeof field.name !== 'string' || !identifierPattern.test(field.name)) {
      fail(`${item.action} ${fieldName}[${index}] has invalid name`);
    }
    if (names.has(field.name)) {
      fail(`${item.action} ${fieldName} contains duplicate field ${field.name}`);
    }
    names.add(field.name);
    if (typeof field.type !== 'string' || !isSupportedType(field.type)) {
      fail(`${item.action} ${fieldName}[${index}] has unsupported type ${field.type}`);
    }
    if (typeof field.description !== 'string' || field.description.trim() === '') {
      fail(`${item.action} ${fieldName}[${index}] missing description`);
    }
    if (requireRequired && typeof field.required !== 'boolean') {
      fail(`${item.action} params[${index}] missing required`);
    }
    if (!requireRequired && field.required !== undefined && typeof field.required !== 'boolean') {
      fail(`${item.action} response[${index}] has invalid required`);
    }
  });
}

function validateManifest(items) {
  if (items.length === 0) {
    fail('manifest must contain at least one API');
  }

  const actions = new Set();
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      fail(`manifest item ${index} must be an object`);
    }
    if (typeof item.action !== 'string' || item.action.trim() === '') {
      fail(`manifest item ${index} missing action`);
    }
    ['category', 'title', 'description', 'biz', 'imp'].forEach((field) => {
      if (typeof item[field] !== 'string' || item[field].trim() === '') {
        fail(`${item.action} missing ${field}`);
      }
    });
    const segments = item.action.split('.');
    if (segments.length < 2 || segments.some((segment) =>
      !identifierPattern.test(segment) || forbiddenSegments.has(segment))) {
      fail(`invalid action path: ${item.action}`);
    }
    if (actions.has(item.action)) {
      fail(`duplicate action: ${item.action}`);
    }
    actions.add(item.action);
    validateFields(item, 'params', true);
    validateFields(item, 'response', false);
    if (!Array.isArray(item.errors) ||
      item.errors.some((error) => typeof error !== 'string' || error.trim() === '')) {
      fail(`${item.action} errors must be a string array`);
    }
    if (typeof item.implemented !== 'boolean') {
      fail(`${item.action} implemented must be boolean`);
    }
    if (item.implemented &&
      (typeof item.example !== 'string' || item.example.trim() === '')) {
      fail(`${item.action} missing example`);
    }
  });
}

function formatObjectType(fields, optionalResponse) {
  if (fields.length === 0) {
    return 'Record<string, never>';
  }
  const lines = fields.map((field) => {
    const optional = optionalResponse
      ? (field.required === true ? '' : '?')
      : (field.required === false ? '?' : '');
    return `    ${field.name}${optional}: ${field.type};`;
  });
  return `{\n${lines.join('\n')}\n  }`;
}

function createTypesSource(items) {
  const actions = items.map((item) => `  | ${JSON.stringify(item.action)}`).join('\n');
  const params = items.map((item) => {
    if (item.params.length === 0) {
      return `  ${JSON.stringify(item.action)}: undefined;`;
    }
    return `  ${JSON.stringify(item.action)}: ${formatObjectType(item.params, false)};`;
  }).join('\n');
  const responses = items.map((item) =>
    `  ${JSON.stringify(item.action)}: ${formatObjectType(item.response, true)};`
  ).join('\n');

  return `// AUTO-GENERATED: DO NOT EDIT DIRECTLY.\n` +
    `// Generated from tools/api-manifest.json.\n\n` +
    `import type { ApiSummary, BridgeResponse, MyASCFSendOptions } from '../bridge-types.js';\n\n` +
    `export type NetworkMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';\n` +
    `export type NetworkHeaders = Record<string, string>;\n` +
    `export type NetworkResponseType = 'text' | 'json';\n` +
    `export type NetworkBody = string | Record<string, unknown> | unknown[] | null;\n\n` +
    `export type ApiAction =\n${actions};\n\n` +
    `export interface ApiParamsMap {\n${params}\n}\n\n` +
    `export interface ApiResponseDataMap {\n${responses}\n}\n\n` +
    `export type TypedBridgeResponse<T extends ApiAction> =\n` +
    `  Omit<BridgeResponse, 'data'> & { data?: ApiResponseDataMap[T] };\n\n` +
    `export type TypedSendArgs<T extends ApiAction> =\n` +
    `  ApiParamsMap[T] extends undefined\n` +
    `    ? [params?: undefined, options?: MyASCFSendOptions]\n` +
    `    : [params: ApiParamsMap[T], options?: MyASCFSendOptions];\n`;
}

function createTree(items) {
  const root = { children: new Map(), item: undefined };
  items.forEach((item) => {
    let node = root;
    item.action.split('.').forEach((segment, index, segments) => {
      if (node.item) {
        fail(`action path collision: ${node.item.action} and ${item.action}`);
      }
      if (!node.children.has(segment)) {
        node.children.set(segment, { children: new Map(), item: undefined });
      }
      node = node.children.get(segment);
      if (index === segments.length - 1) {
        if (node.children.size > 0 || node.item) {
          fail(`action path collision: ${item.action}`);
        }
        node.item = item;
      }
    });
  });
  return root;
}

function renderClientNode(node, depth) {
  const indent = '  '.repeat(depth);
  const lines = ['{'];
  node.children.forEach((child, segment) => {
    if (child.item) {
      const item = child.item;
      const action = JSON.stringify(item.action);
      if (item.params.length === 0) {
        lines.push(
          `${indent}  ${segment}: (options?: MyASCFSendOptions): Promise<TypedBridgeResponse<${action}>> =>`,
          `${indent}    client.sendTyped(${action}, undefined, options),`
        );
      } else {
        lines.push(
          `${indent}  ${segment}: (params: ApiParamsMap[${action}], options?: MyASCFSendOptions): Promise<TypedBridgeResponse<${action}>> =>`,
          `${indent}    client.sendTyped(${action}, params, options),`
        );
      }
      return;
    }
    lines.push(`${indent}  ${segment}: ${renderClientNode(child, depth + 1)},`);
  });
  lines.push(`${indent}}`);
  return lines.join('\n');
}

function createClientSource(items) {
  const tree = createTree(items);
  return `// AUTO-GENERATED: DO NOT EDIT DIRECTLY.\n` +
    `// Generated from tools/api-manifest.json.\n\n` +
    `import type { MyASCF, MyASCFSendOptions } from '../bridge-types.js';\n` +
    `import type { ApiParamsMap, TypedBridgeResponse } from './api-types.js';\n\n` +
    `export function createTypedApi(client: MyASCF) {\n` +
    `  return ${renderClientNode(tree, 1)};\n` +
    `}\n\n` +
    `export type TypedApi = ReturnType<typeof createTypedApi>;\n`;
}

function writeOrCheck(filePath, content) {
  const relativePath = path.relative(rootDir, filePath);
  if (checkMode) {
    if (!fs.existsSync(filePath)) {
      fail(`generated file is missing: ${relativePath}`);
    }
    if (fs.readFileSync(filePath, 'utf8') !== content) {
      fail(`generated file is stale: ${relativePath}`);
    }
    console.log(`[sdk-types] checked ${relativePath}`);
    return;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[sdk-types] wrote ${relativePath}`);
}

const manifest = readManifest();
validateManifest(manifest);
const implementedManifest = manifest.filter((item) => item.implemented);
if (implementedManifest.length === 0) {
  fail('manifest does not contain an implemented API');
}
if (!checkMode) {
  fs.mkdirSync(generatedDir, { recursive: true });
}
writeOrCheck(typesPath, createTypesSource(implementedManifest));
writeOrCheck(clientPath, createClientSource(implementedManifest));
console.log(`[sdk-types] ${checkMode ? 'verified' : 'generated'} ${implementedManifest.length} implemented APIs`);
