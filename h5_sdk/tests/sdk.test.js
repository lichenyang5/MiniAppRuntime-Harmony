import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const iifeUrl = pathToFileURL(path.resolve(testDirectory, '..', 'dist', 'myascf.js')).href;
const esmUrl = pathToFileURL(path.resolve(testDirectory, '..', 'dist', 'index.esm.js')).href;
let importSequence = 0;

async function loadIife(windowOverrides = {}) {
  globalThis.window = Object.assign({
    setTimeout,
    clearTimeout
  }, windowOverrides);
  importSequence += 1;
  await import(`${iifeUrl}?test=${importSequence}`);
  return globalThis.window;
}

function createWindow(windowOverrides = {}) {
  return Object.assign({
    setTimeout,
    clearTimeout
  }, windowOverrides);
}

test.afterEach(() => {
  delete globalThis.window;
});

test('ESM entry exports factories and stable error codes without auto mounting', async () => {
  const sdk = await import(`${esmUrl}?test=exports`);
  const targetWindow = createWindow();
  const client = sdk.createMyASCF({ targetWindow });

  assert.equal(typeof client.send, 'function');
  assert.equal(targetWindow.myascf, undefined);
  assert.equal(targetWindow.__myascf_on_native_response__, undefined);
  assert.deepEqual([
    sdk.ERROR_CODE_SUCCESS,
    sdk.ERROR_CODE_CALLBACK_LOST,
    sdk.ERROR_CODE_TIMEOUT,
    sdk.ERROR_CODE_NATIVE_UNAVAILABLE,
    sdk.ERROR_CODE_INVALID_RESPONSE
  ], [0, 1004, 1005, 1006, 1007]);
});

test('initMyASCF mounts the ESM client and native response callback', async () => {
  const sdk = await import(`${esmUrl}?test=init`);
  const targetWindow = createWindow();
  const client = sdk.initMyASCF({ targetWindow });

  assert.equal(targetWindow.myascf, client);
  assert.equal(typeof targetWindow.__myascf_on_native_response__, 'function');
});

test('createMyASCF supports a custom response boundary and typed round trip', async () => {
  const sdk = await import(`${esmUrl}?test=create-typed`);
  let requestText = '';
  const targetWindow = createWindow({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    }
  });
  const client = sdk.createMyASCF({ targetWindow });
  const promise = client.sendTyped('system.storage.getItem', { key: 'username' });
  const request = JSON.parse(requestText);

  client.handleNativeResponse({
    requestId: request.requestId,
    code: 0,
    message: 'success',
    data: { key: 'username', value: 'lichenyang' }
  });

  const response = await promise;
  assert.equal(response.data.value, 'lichenyang');
  assert.equal(targetWindow.myascf, undefined);
});

test('generated typed helper maps nested methods to existing actions', async () => {
  const sdk = await import(`${esmUrl}?test=typed-helper`);
  const calls = [];
  const client = {
    sendTyped(action, params, options) {
      calls.push({ action, params, options });
      return Promise.resolve({ requestId: 'typed', code: 0, message: 'success' });
    }
  };
  const api = sdk.createTypedApi(client);

  await api.ui.showToast({ message: 'hello' });
  await api.system.clipboard.readText({ timeout: 1000 });
  await api.system.storage.setItem({ key: 'username', value: 'lichenyang' });
  await api.system.storage.getItem({ key: 'username' });
  await api.runtime.getApiList();
  await api.network.request({
    url: 'https://example.com/users?token=secret',
    method: 'GET',
    timeout: 10000,
    responseType: 'json'
  }, { timeout: 12000 });

  assert.deepEqual(calls.map((call) => call.action), [
    'ui.showToast',
    'system.clipboard.readText',
    'system.storage.setItem',
    'system.storage.getItem',
    'runtime.getApiList',
    'network.request'
  ]);
  assert.equal(calls[1].params, undefined);
  assert.deepEqual(calls[1].options, { timeout: 1000 });
  assert.equal(calls[5].params.timeout, 10000);
  assert.deepEqual(calls[5].options, { timeout: 12000 });
});

test('network.request resolves a successful runtime response', async () => {
  let requestText = '';
  const sdk = await import(`${esmUrl}?test=network-success`);
  const targetWindow = createWindow({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    }
  });
  const client = sdk.createMyASCF({ targetWindow });
  const promise = client.sendTyped('network.request', {
    url: 'https://example.com/api',
    method: 'GET',
    timeout: 10000,
    responseType: 'json'
  }, { timeout: 12000 });
  const request = JSON.parse(requestText);

  client.handleNativeResponse({
    requestId: request.requestId,
    code: 0,
    message: 'network request success',
    data: { statusCode: 200, headers: {}, body: { ok: true }, duration: 18 }
  });

  const response = await promise;
  assert.equal(response.data.statusCode, 200);
  assert.deepEqual(response.data.body, { ok: true });
});

test('network.request rejects a mapped runtime network error', async () => {
  let requestText = '';
  const sdk = await import(`${esmUrl}?test=network-error`);
  const targetWindow = createWindow({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    }
  });
  const client = sdk.createMyASCF({ targetWindow });
  const promise = client.send('network.request', {
    url: 'https://example.com/slow',
    timeout: 1000
  }, { timeout: 3000 });
  const request = JSON.parse(requestText);

  client.handleNativeResponse({
    requestId: request.requestId,
    code: 1103,
    message: 'NETWORK_TIMEOUT: request timed out'
  });

  await assert.rejects(promise, (error) => error.code === 1103);
});

test('network DebugPanel records redact query, headers and body content', async () => {
  const starts = [];
  const ends = [];
  let requestText = '';
  const sdk = await import(`${esmUrl}?test=network-debug-redaction`);
  const targetWindow = createWindow({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    },
    MyASCFDebugPanel: {
      recordStart(record) {
        starts.push(record);
      },
      recordEnd(record) {
        ends.push(record);
      }
    }
  });
  const client = sdk.createMyASCF({ targetWindow });
  const promise = client.send('network.request', {
    url: 'https://user:password@example.com/users?token=secret',
    method: 'POST',
    headers: { Authorization: 'Bearer secret', Cookie: 'sid=secret' },
    body: '{"password":"secret"}',
    timeout: 10000
  }, { timeout: 12000 });
  const request = JSON.parse(requestText);

  assert.equal(starts[0].params.url, 'https://example.com/users');
  assert.deepEqual(starts[0].params.headerNames, ['Authorization', 'Cookie']);
  assert.equal(starts[0].params.bodyLength, 21);
  assert.equal(JSON.stringify(starts[0]).includes('Bearer secret'), false);
  assert.equal(JSON.stringify(starts[0]).includes('password'), false);

  client.handleNativeResponse({
    requestId: request.requestId,
    code: 0,
    message: 'success',
    data: {
      statusCode: 200,
      headers: { 'Set-Cookie': 'sid=response-secret' },
      body: '{"token":"response-secret"}',
      duration: 1
    }
  });
  await promise;
  assert.deepEqual(ends[0].response.data.headerNames, ['Set-Cookie']);
  assert.equal(ends[0].response.data.bodyLength, 27);
  assert.equal(JSON.stringify(ends[0]).includes('response-secret'), false);
});

test('send creates unique requestIds with the stable prefix', async () => {
  const requests = [];
  const windowObject = await loadIife({
    MyASCFNative: {
      postMessage(message) {
        requests.push(JSON.parse(message));
      }
    }
  });

  const firstPromise = windowObject.myascf.send('system.clipboard.readText', {});
  const secondPromise = windowObject.myascf.send('system.storage.clear', {});

  assert.match(requests[0].requestId, /^myascf_/);
  assert.match(requests[1].requestId, /^myascf_/);
  assert.notEqual(requests[0].requestId, requests[1].requestId);
  requests.forEach((request) => windowObject.__myascf_on_native_response__({
    requestId: request.requestId,
    code: 0,
    message: 'success',
    data: { echoAction: request.action }
  }));
  await Promise.all([firstPromise, secondPromise]);
});

test('IIFE auto mounts and preserves the BridgeRequest protocol', async () => {
  let requestText = '';
  const starts = [];
  const ends = [];
  const windowObject = await loadIife({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    },
    MyASCFDebugPanel: {
      recordStart(record) {
        starts.push(record);
      },
      recordEnd(record) {
        ends.push(record);
      }
    }
  });

  const promise = windowObject.myascf.send('ui.showToast', { message: 'hello' });
  const request = JSON.parse(requestText);
  windowObject.__myascf_on_native_response__(JSON.stringify({
    requestId: request.requestId,
    code: 0,
    message: 'success',
    data: { echoAction: request.action }
  }));

  const response = await promise;
  assert.equal(request.action, 'ui.showToast');
  assert.deepEqual(request.params, { message: 'hello' });
  assert.equal(response.code, 0);
  assert.equal(starts[0].status, 'pending');
  assert.equal(ends[0].status, 'resolve');
});

test('send rejects NATIVE_UNAVAILABLE outside ArkWeb', async () => {
  const windowObject = await loadIife();
  await assert.rejects(
    windowObject.myascf.send('runtime.getApiList', {}),
    (error) => error.code === 1006 && /ArkWeb/.test(error.message)
  );
});

test('non-zero native response rejects the matching request', async () => {
  let requestText = '';
  const windowObject = await loadIife({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    }
  });
  const promise = windowObject.myascf.send('ui.showToast', { message: 'reject' });
  const request = JSON.parse(requestText);

  windowObject.__myascf_on_native_response__({
    requestId: request.requestId,
    code: 1002,
    message: 'PARAM_ERROR',
    data: { echoAction: request.action }
  });

  await assert.rejects(promise, (error) => error.code === 1002);
});

test('DebugPanel exceptions do not interrupt the bridge request', async () => {
  let requestText = '';
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const windowObject = await loadIife({
      MyASCFNative: {
        postMessage(message) {
          requestText = message;
        }
      },
      MyASCFDebugPanel: {
        recordStart() {
          throw new Error('debug panel failure');
        },
        recordEnd() {
          throw new Error('debug panel failure');
        }
      }
    });
    const promise = windowObject.myascf.send('ui.showToast', { message: 'safe' });
    const request = JSON.parse(requestText);
    windowObject.__myascf_on_native_response__({
      requestId: request.requestId,
      code: 0,
      message: 'success',
      data: { echoAction: request.action }
    });
    const response = await promise;
    assert.equal(response.code, 0);
  } finally {
    console.warn = originalWarn;
  }
});

test('send rejects TIMEOUT and records the DebugPanel error', async () => {
  const errors = [];
  const windowObject = await loadIife({
    MyASCFNative: { postMessage() {} },
    MyASCFDebugPanel: {
      recordError(record) {
        errors.push(record);
      }
    }
  });

  await assert.rejects(
    windowObject.myascf.send('ui.showToast', {}, { timeout: 5 }),
    (error) => error.code === 1005
  );
  assert.equal(errors[0].status, 'timeout');
});

test('late response records CALLBACK_LOST without throwing', async () => {
  const lostRecords = [];
  let callbackLost = null;
  const windowObject = await loadIife({
    MyASCFDebugPanel: {
      recordLost(record) {
        lostRecords.push(record);
      }
    },
    __myascf_on_callback_lost__(detail) {
      callbackLost = detail;
    }
  });

  windowObject.__myascf_on_native_response__({
    requestId: 'missing_request',
    code: 0,
    message: 'late response',
    data: { echoAction: 'ui.showToast' }
  });

  assert.equal(lostRecords[0].code, 1004);
  assert.equal(callbackLost.code, 1004);
});

test('invalid native response is isolated and recorded', async () => {
  const errors = [];
  const windowObject = await loadIife({
    MyASCFDebugPanel: {
      recordError(record) {
        errors.push(record);
      }
    }
  });

  windowObject.__myascf_on_native_response__('not-json');
  assert.equal(errors[0].code, 1007);
  assert.equal(errors[0].status, 'invalid_response');
});

test('invalid response with requestId rejects only its matching callback', async () => {
  let requestText = '';
  const windowObject = await loadIife({
    MyASCFNative: {
      postMessage(message) {
        requestText = message;
      }
    }
  });
  const promise = windowObject.myascf.send('system.storage.getItem', {
    key: 'username'
  }, {
    timeout: 100
  });
  const request = JSON.parse(requestText);

  windowObject.__myascf_on_native_response__(JSON.stringify({
    requestId: request.requestId,
    message: 'missing code'
  }));

  await assert.rejects(promise, (error) => error.code === 1007);
});
