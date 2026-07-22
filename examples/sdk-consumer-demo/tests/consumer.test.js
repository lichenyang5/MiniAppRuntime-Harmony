import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  ERROR_CODE_NATIVE_UNAVAILABLE,
  createTypedApi,
  createMyASCF,
  initMyASCF
} from '@lichenyang5/miniapp-runtime-harmony-web-sdk';

const packageRoot = path.resolve(
  'node_modules',
  '@lichenyang5',
  '@lichenyang5/miniapp-runtime-harmony-web-sdk'
);

test('installed tarball contains IIFE, ESM and type entry files', () => {
  const requiredFiles = [
    'CHANGELOG.md',
    'LICENSE',
    'README.md',
    'dist/index.d.ts',
    'dist/index.esm.js',
    'dist/generated/api-client.d.ts',
    'dist/generated/api-types.d.ts',
    'dist/myascf.d.ts',
    'dist/myascf.js',
    'package.json'
  ];

  requiredFiles.forEach((relativePath) => {
    assert.equal(fs.existsSync(path.join(packageRoot, relativePath)), true, relativePath);
  });

  assert.equal(fs.existsSync(path.join(packageRoot, 'src')), false);
  assert.equal(fs.existsSync(path.join(packageRoot, 'tests')), false);
  assert.equal(fs.existsSync(path.join(packageRoot, 'scripts')), false);
});

test('ESM package entry creates without mounting and initializes on demand', () => {
  const createTarget = { setTimeout, clearTimeout };
  const createdClient = createMyASCF({ targetWindow: createTarget });
  assert.equal(typeof createdClient.send, 'function');
  assert.equal(createTarget.myascf, undefined);

  const initTarget = { setTimeout, clearTimeout };
  const initializedClient = initMyASCF({ targetWindow: initTarget });
  assert.equal(initTarget.myascf, initializedClient);
  assert.equal(typeof initTarget.__myascf_on_native_response__, 'function');
});

test('ESM client rejects without the ArkWeb native proxy', async () => {
  const targetWindow = { setTimeout, clearTimeout };
  const client = createMyASCF({ targetWindow });

  await assert.rejects(
    client.send('ui.showToast', { message: 'consumer test' }),
    (error) => error.code === ERROR_CODE_NATIVE_UNAVAILABLE && /ArkWeb/.test(error.message)
  );
});

test('generated typed helper forwards nested API calls', async () => {
  const calls = [];
  const api = createTypedApi({
    sendTyped(action, params, options) {
      calls.push({ action, params, options });
      return Promise.resolve({ requestId: 'consumer', code: 0, message: 'success' });
    }
  });

  await api.ui.showToast({ message: 'typed consumer' });
  await api.system.storage.clear({ timeout: 2000 });

  assert.equal(calls[0].action, 'ui.showToast');
  assert.deepEqual(calls[0].params, { message: 'typed consumer' });
  assert.equal(calls[1].action, 'system.storage.clear');
  assert.equal(calls[1].params, undefined);
  assert.deepEqual(calls[1].options, { timeout: 2000 });
});
