'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(__dirname, 'api-manifest.json');
const actionNamesPath = path.join(rootDir, 'myascf_runtime', 'src', 'main', 'ets', 'api', 'ActionNames.ets');
const arktsManifestPath = path.join(rootDir, 'myascf_runtime', 'src', 'main', 'ets', 'api', 'ApiManifest.ets');
const bootstrapPath = path.join(rootDir, 'myascf_runtime', 'src', 'main', 'ets', 'registry', 'RuntimeBootstrap.ets');
const runtimeInfoPath = path.join(rootDir, 'myascf_runtime', 'src', 'main', 'ets', 'biz', 'RuntimeInfoBiz.ets');
const generatedPaths = [
  path.join(rootDir, 'docs', 'api', 'generated-api-table.md'),
  path.join(rootDir, 'docs', 'api', 'generated-api-manifest.md'),
  path.join(rootDir, 'h5_sdk', 'src', 'generated', 'api-types.ts')
];

function fail(message) {
  console.error(`[check-api] ERROR: ${message}`);
  process.exit(1);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing ${path.relative(rootDir, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function requireString(item, field) {
  if (typeof item[field] !== 'string' || item[field].trim() === '') {
    fail(`${item.action || '<unknown>'} missing ${field}`);
  }
}

function validateFields(item, field, requireRequired) {
  if (!Array.isArray(item[field])) {
    fail(`${item.action} ${field} must be an array`);
  }
  const names = new Set();
  item[field].forEach((meta, index) => {
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
      fail(`${item.action} ${field}[${index}] must be an object`);
    }
    ['name', 'type', 'description'].forEach((key) => requireString(meta, key));
    if (names.has(meta.name)) {
      fail(`${item.action} ${field} contains duplicate field ${meta.name}`);
    }
    names.add(meta.name);
    if (requireRequired && typeof meta.required !== 'boolean') {
      fail(`${item.action} params[${index}] missing required`);
    }
  });
}

function readManifest() {
  let items;
  try {
    items = JSON.parse(requireFile(manifestPath));
  } catch (error) {
    fail(`cannot parse tools/api-manifest.json: ${error.message}`);
  }
  if (!Array.isArray(items) || items.length === 0) {
    fail('tools/api-manifest.json must contain an API array');
  }
  const actions = new Set();
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      fail(`manifest item ${index} must be an object`);
    }
    ['action', 'category', 'title', 'description', 'biz', 'imp'].forEach((field) =>
      requireString(item, field));
    if (actions.has(item.action)) {
      fail(`duplicate action ${item.action}`);
    }
    actions.add(item.action);
    validateFields(item, 'params', true);
    validateFields(item, 'response', false);
    if (!Array.isArray(item.errors) || item.errors.some((error) => typeof error !== 'string')) {
      fail(`${item.action} errors must be a string array`);
    }
    if (typeof item.implemented !== 'boolean') {
      fail(`${item.action} implemented must be boolean`);
    }
    if (item.internal !== undefined && typeof item.internal !== 'boolean') {
      fail(`${item.action} internal must be boolean`);
    }
    if (item.implemented) {
      requireString(item, 'example');
    }
  });
  return items;
}

function collectActionConstants(source) {
  source = stripComments(source);
  const constants = new Map();
  const pattern = /export const\s+([A-Z0-9_]+)\s*:\s*string\s*=\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    if (constants.has(match[1]) || Array.from(constants.values()).includes(match[2])) {
      fail(`duplicate ActionNames entry ${match[1]} / ${match[2]}`);
    }
    constants.set(match[1], match[2]);
  }
  if (constants.size === 0) {
    fail('ActionNames.ets does not contain action constants');
  }
  return constants;
}

function collectReferences(source, pattern, label) {
  source = stripComments(source);
  const names = new Set();
  let match;
  while ((match = pattern.exec(source)) !== null) {
    if (names.has(match[1])) {
      fail(`${label} contains duplicate reference ${match[1]}`);
    }
    names.add(match[1]);
  }
  return names;
}

function assertSameSet(label, expected, actual) {
  const missing = Array.from(expected).filter((item) => !actual.has(item));
  const extra = Array.from(actual).filter((item) => !expected.has(item));
  if (missing.length > 0 || extra.length > 0) {
    fail(`${label} mismatch; missing=[${missing.join(', ')}] extra=[${extra.join(', ')}]`);
  }
}

const manifest = readManifest();
const manifestActions = new Set(manifest.map((item) => item.action));
const implementedItems = manifest.filter((item) => item.implemented);
const publicImplementedItems = implementedItems.filter((item) => item.internal !== true);
if (!manifestActions.has('runtime.getApiList')) {
  fail('runtime.getApiList is required');
}

const constants = collectActionConstants(requireFile(actionNamesPath));
assertSameSet('ActionNames actions', manifestActions, new Set(constants.values()));

const arktsManifestRefs = collectReferences(
  requireFile(arktsManifestPath),
  /action\s*:\s*([A-Z][A-Z0-9_]*)/g,
  'ApiManifest'
);
assertSameSet('ApiManifest constants', new Set(constants.keys()), arktsManifestRefs);

const registeredRefs = collectReferences(
  requireFile(bootstrapPath),
  /registry\.register\(\s*([A-Z][A-Z0-9_]*)\s*,/g,
  'RuntimeBootstrap'
);
const implementedConstants = new Set(implementedItems.map((item) => {
  const entry = Array.from(constants.entries()).find(([, action]) => action === item.action);
  return entry ? entry[0] : '';
}));
assertSameSet('RuntimeBootstrap registrations', implementedConstants, registeredRefs);

const runtimeInfoSource = stripComments(requireFile(runtimeInfoPath));
if (!/item\.internal\s*===\s*true/.test(runtimeInfoSource)) {
  fail('RuntimeInfoBiz must filter internal API items');
}

const generatedSources = generatedPaths.map((filePath) => ({
  filePath,
  source: requireFile(filePath)
}));
generatedSources.forEach(({ filePath, source }) => {
  const expectedItems = publicImplementedItems;
  expectedItems.forEach((item) => {
    if (!source.includes(item.action)) {
      fail(`${path.relative(rootDir, filePath)} missing ${item.action}`);
    }
  });
  implementedItems.filter((item) => item.internal === true).forEach((item) => {
    if (source.includes(item.action)) {
      fail(`${path.relative(rootDir, filePath)} exposes internal action ${item.action}`);
    }
  });
});

console.log(`[check-api] OK: ${manifest.length} actions found (${publicImplementedItems.length} public implemented)`);
console.log('[check-api] OK: ActionNames, ApiManifest and RuntimeBootstrap are aligned');
console.log('[check-api] OK: generated public API docs contain all public actions');
console.log('[check-api] OK: generated H5 SDK types contain all public implemented actions');
