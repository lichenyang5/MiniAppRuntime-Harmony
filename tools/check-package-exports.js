'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const rootDir = path.resolve(__dirname, '..');
const sdkDir = path.join(rootDir, 'h5_sdk');
const packagePath = path.join(sdkDir, 'package.json');

function fail(message) {
  console.error(`[check-package] ERROR: ${message}`);
  process.exit(1);
}

function requirePackageFile(label, value) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${label} must be a non-empty path`);
  }
  const relativePath = value.startsWith('./') ? value.slice(2) : value;
  const targetPath = path.resolve(sdkDir, relativePath);
  if (!targetPath.startsWith(`${sdkDir}${path.sep}`) || !fs.existsSync(targetPath)) {
    fail(`${label} points to missing or invalid file ${value}`);
  }
  console.log(`[check-package] OK: ${label} ${relativePath}`);
}

function checkExportPaths(value, label) {
  if (typeof value === 'string') {
    requirePackageFile(label, value);
    return;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${label} must be a path or condition object`);
  }
  Object.entries(value).forEach(([key, child]) => checkExportPaths(child, `${label}.${key}`));
}

let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (error) {
  fail(`cannot read h5_sdk/package.json: ${error.message}`);
}

requirePackageFile('main', packageJson.main);
requirePackageFile('module', packageJson.module);
requirePackageFile('types', packageJson.types);
checkExportPaths(packageJson.exports, 'exports');

if (!Array.isArray(packageJson.files) || !packageJson.files.includes('dist')) {
  fail('files must include dist');
}
['dist/myascf.js', 'dist/index.esm.js', 'dist/index.d.ts'].forEach((relativePath) =>
  requirePackageFile('required', relativePath));

async function checkEsmEntry() {
  const importTarget = packageJson.exports && packageJson.exports['.'] &&
    packageJson.exports['.'].import;
  if (typeof importTarget !== 'string') {
    fail('exports["."].import must be a path');
  }
  const normalizedModule = packageJson.module.startsWith('./') ?
    packageJson.module : `./${packageJson.module}`;
  if (importTarget !== normalizedModule) {
    fail(`module and exports["."].import differ: ${packageJson.module} / ${importTarget}`);
  }
  const modulePath = path.resolve(sdkDir, importTarget);
  let exportsObject;
  try {
    exportsObject = await import(pathToFileURL(modulePath).href);
  } catch (error) {
    fail(`cannot import ESM entry ${packageJson.module}: ${error.message}`);
  }
  [
    'createMyASCF',
    'initMyASCF',
    'createTypedApi',
    'ERROR_CODE_TIMEOUT',
    'ERROR_CODE_NATIVE_UNAVAILABLE',
    'ERROR_CODE_INVALID_RESPONSE'
  ].forEach((name) => {
    if (!(name in exportsObject)) {
      fail(`ESM entry missing export ${name}`);
    }
  });
  console.log('[check-package] OK: ESM entry imports and exposes required runtime exports');
}

function checkIifeEntry() {
  const iifeTarget = packageJson.exports && packageJson.exports['./iife'] &&
    packageJson.exports['./iife'].default;
  if (typeof iifeTarget !== 'string') {
    fail('exports["./iife"].default must be a path');
  }
  const sandbox = {
    window: { setTimeout, clearTimeout },
    console,
    setTimeout,
    clearTimeout
  };
  try {
    vm.runInNewContext(fs.readFileSync(path.resolve(sdkDir, iifeTarget), 'utf8'), sandbox);
  } catch (error) {
    fail(`cannot execute IIFE export ${iifeTarget}: ${error.message}`);
  }
  if (!sandbox.window.myascf || typeof sandbox.window.myascf.send !== 'function') {
    fail(`IIFE export ${iifeTarget} did not mount window.myascf.send`);
  }
  console.log('[check-package] OK: IIFE export executes and mounts window.myascf.send');
}

checkEsmEntry().then(() => {
  checkIifeEntry();
  console.log('[check-package] OK: files includes dist');
  console.log('[check-package] OK: all package entry paths exist');
}).catch((error) => fail(error.message));
