import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {
  ERROR_CODE_NATIVE_UNAVAILABLE,
  createMyASCF,
  createTypedApi
} from '@lichenyang5/miniapp-runtime-harmony-web-sdk';

const packageRoot = path.resolve('node_modules', '@lichenyang5', 'miniapp-runtime-harmony-web-sdk');

test('tarball exposes only the expected public package files', () => {
  const expected = [
    'CHANGELOG.md',
    'LICENSE',
    'README.md',
    'dist/index.d.ts',
    'dist/index.esm.js',
    'dist/myascf.d.ts',
    'dist/myascf.js',
    'package.json'
  ];
  expected.forEach((file) => assert.equal(fs.existsSync(path.join(packageRoot, file)), true, file));
  ['src', 'tests', 'scripts', 'node_modules'].forEach((name) => {
    assert.equal(fs.existsSync(path.join(packageRoot, name)), false, name);
  });
});

test('ESM API works and reports NATIVE_UNAVAILABLE outside ArkWeb', async () => {
  const targetWindow = { setTimeout, clearTimeout };
  const client = createMyASCF({ targetWindow });
  const api = createTypedApi(client);

  await assert.rejects(
    api.ui.showToast({ message: 'normal browser' }),
    (error) => error.code === ERROR_CODE_NATIVE_UNAVAILABLE && /ArkWeb/.test(error.message)
  );
});

test('IIFE file mounts window.myascf when loaded as a script', () => {
  const sdkPackage = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  const iifePath = path.resolve(packageRoot, sdkPackage.exports['./iife'].default);
  const sandbox = { window: { setTimeout, clearTimeout }, console, setTimeout, clearTimeout };
  vm.runInNewContext(fs.readFileSync(iifePath, 'utf8'), sandbox);
  assert.equal(typeof sandbox.window.myascf.send, 'function');
});
