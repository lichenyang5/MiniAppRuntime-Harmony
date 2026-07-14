'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const sdkPath = path.resolve(__dirname, '..', 'dist', 'myascf.js');

function loadSdk(windowOverrides) {
  delete require.cache[sdkPath];
  global.window = Object.assign({
    setTimeout,
    clearTimeout
  }, windowOverrides || {});
  require(sdkPath);
  return global.window;
}

test.afterEach(() => {
  delete global.window;
});

test('send posts the existing BridgeRequest protocol and resolves response', async () => {
  let requestText = '';
  const starts = [];
  const ends = [];
  const windowObject = loadSdk({
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
  const windowObject = loadSdk();
  await assert.rejects(
    windowObject.myascf.send('runtime.getApiList', {}),
    (error) => error.code === 1006 && /ArkWeb/.test(error.message)
  );
});

test('send rejects TIMEOUT and records the DebugPanel error', async () => {
  const errors = [];
  const windowObject = loadSdk({
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

test('late response records CALLBACK_LOST without throwing', () => {
  const lostRecords = [];
  let callbackLost = null;
  const windowObject = loadSdk({
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

test('invalid native response is isolated and recorded', () => {
  const errors = [];
  const windowObject = loadSdk({
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
  const windowObject = loadSdk({
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
