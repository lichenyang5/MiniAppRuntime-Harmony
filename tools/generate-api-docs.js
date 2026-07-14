'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(__dirname, 'api-manifest.json');
const tablePath = path.join(rootDir, 'docs', 'api', 'generated-api-table.md');
const detailsPath = path.join(rootDir, 'docs', 'api', 'generated-api-manifest.md');
const readmePath = path.join(rootDir, 'README.md');
const apiIndexPath = path.join(rootDir, 'docs', 'api', 'index.md');
const markerStart = '<!-- API_TABLE_START -->';
const markerEnd = '<!-- API_TABLE_END -->';
const checkMode = process.argv.includes('--check');

function fail(message) {
  console.error(`[api-docs] ${message}`);
  process.exit(1);
}

function readManifest() {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    fail(`cannot read manifest: ${error.message}`);
  }
  if (!Array.isArray(parsed)) {
    fail('manifest root must be an array');
  }
  return parsed;
}

function requireString(item, field) {
  if (typeof item[field] !== 'string' || item[field].trim() === '') {
    fail(`invalid manifest item: ${item.action || '<unknown>'} missing ${field}`);
  }
}

function validateMetaArray(item, field, requireRequired) {
  if (!Array.isArray(item[field])) {
    fail(`invalid manifest item: ${item.action || '<unknown>'} ${field} must be an array`);
  }
  item[field].forEach((meta, index) => {
    if (!meta || typeof meta !== 'object') {
      fail(`invalid manifest item: ${item.action} ${field}[${index}] must be an object`);
    }
    ['name', 'type', 'description'].forEach((key) => {
      if (typeof meta[key] !== 'string' || meta[key].trim() === '') {
        fail(`invalid manifest item: ${item.action} ${field}[${index}] missing ${key}`);
      }
    });
    if (requireRequired && typeof meta.required !== 'boolean') {
      fail(`invalid manifest item: ${item.action} params[${index}] missing required`);
    }
  });
}

function validateManifest(items) {
  const actions = new Set();
  items.forEach((item) => {
    if (!item || typeof item !== 'object') {
      fail('invalid manifest item: expected object');
    }
    ['action', 'category', 'title', 'description', 'biz', 'imp'].forEach((field) => requireString(item, field));
    validateMetaArray(item, 'params', true);
    validateMetaArray(item, 'response', false);
    if (!Array.isArray(item.errors) || item.errors.some((error) => typeof error !== 'string')) {
      fail(`invalid manifest item: ${item.action} errors must be a string array`);
    }
    if (typeof item.implemented !== 'boolean') {
      fail(`invalid manifest item: ${item.action} implemented must be boolean`);
    }
    if (item.implemented && (typeof item.example !== 'string' || item.example.trim() === '')) {
      fail(`invalid manifest item: ${item.action} missing example`);
    }
    if (actions.has(item.action)) {
      fail(`duplicate action: ${item.action}`);
    }
    actions.add(item.action);
  });
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function formatFields(fields, includeOptional) {
  if (fields.length === 0) {
    return '-';
  }
  return fields.map((field) => {
    const optional = includeOptional && field.required === false ? '?' : '';
    return `${field.name}${optional}: ${field.type}`;
  }).join(', ');
}

function formatCodeCell(value) {
  return value === '-' ? '-' : `\`${escapeCell(value)}\``;
}

function createTable(items) {
  const lines = [
    '| Category | Action | Params | Response | Status |',
    '| --- | --- | --- | --- | --- |'
  ];
  items.forEach((item) => {
    lines.push(`| ${escapeCell(item.category)} | \`${escapeCell(item.action)}\` | ${formatCodeCell(formatFields(item.params, true))} | ${formatCodeCell(formatFields(item.response, false))} | ${item.implemented ? '✅' : 'Planned'} |`);
  });
  return lines.join('\n');
}

function createDetails(items) {
  const lines = [
    '<!-- AUTO-GENERATED: DO NOT EDIT DIRECTLY -->',
    '',
    '# Generated API Manifest',
    '',
    'Generated from `tools/api-manifest.json` by `npm run docs:api`.'
  ];
  items.forEach((item) => {
    const example = typeof item.example === 'string' && item.example.trim() !== ''
      ? item.example
      : '// This API is not implemented yet.';
    lines.push('', `## ${item.action}`, '', `- Title: ${item.title}`, `- Category: \`${item.category}\``, `- Status: ${item.implemented ? 'Implemented' : 'Planned'}`, `- Biz: \`${item.biz}\``, `- Imp: \`${item.imp}\``, '', item.description, '', '### Params', '');
    if (item.params.length === 0) {
      lines.push('-');
    } else {
      lines.push('| Name | Type | Required | Description |', '| --- | --- | --- | --- |');
      item.params.forEach((param) => lines.push(`| \`${escapeCell(param.name)}\` | \`${escapeCell(param.type)}\` | ${param.required ? 'Yes' : 'No'} | ${escapeCell(param.description)} |`));
    }
    lines.push('', '### Response', '');
    if (item.response.length === 0) {
      lines.push('-');
    } else {
      lines.push('| Name | Type | Description |', '| --- | --- | --- |');
      item.response.forEach((field) => lines.push(`| \`${escapeCell(field.name)}\` | \`${escapeCell(field.type)}\` | ${escapeCell(field.description)} |`));
    }
    lines.push('', '### Errors', '', item.errors.length === 0 ? '-' : item.errors.map((error) => `\`${error}\``).join(', '), '', '### Example', '', '```js', example, '```');
  });
  return `${lines.join('\n')}\n`;
}

function replaceGeneratedBlock(filePath, table) {
  const content = fs.readFileSync(filePath, 'utf8');
  const startIndex = content.indexOf(markerStart);
  const endIndex = content.indexOf(markerEnd);
  if (startIndex < 0 || endIndex < 0 || endIndex < startIndex) {
    fail(`missing API table markers in ${path.relative(rootDir, filePath)}`);
  }
  const before = content.slice(0, startIndex + markerStart.length);
  const after = content.slice(endIndex);
  const expected = `${before}\n${table}\n${after}`;
  if (checkMode) {
    if (content !== expected) {
      fail(`generated API table is stale in ${path.relative(rootDir, filePath)}`);
    }
    return;
  }
  fs.writeFileSync(filePath, expected, 'utf8');
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
    console.log(`[api-docs] checked ${relativePath}`);
    return;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[api-docs] wrote ${relativePath}`);
}

const manifest = readManifest();
validateManifest(manifest);
const table = createTable(manifest);
writeOrCheck(tablePath, `<!-- AUTO-GENERATED: DO NOT EDIT DIRECTLY -->\n\n${table}\n`);
writeOrCheck(detailsPath, createDetails(manifest));
replaceGeneratedBlock(readmePath, table);
replaceGeneratedBlock(apiIndexPath, table);
console.log(`[api-docs] ${checkMode ? 'verified' : 'generated'} ${manifest.length} APIs`);
console.log(`[api-docs] ${checkMode ? 'checked' : 'updated'} README.md and docs/api/index.md`);
