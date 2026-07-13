(function () {
  var button = document.getElementById('demoButton');
  var paramErrorButton = document.getElementById('paramErrorButton');
  var unknownActionButton = document.getElementById('unknownActionButton');
  var timeoutButton = document.getElementById('timeoutButton');
  var clipboardText = document.getElementById('clipboardText');
  var clipboardWriteButton = document.getElementById('clipboardWriteButton');
  var clipboardReadButton = document.getElementById('clipboardReadButton');
  var clipboardParamErrorButton = document.getElementById('clipboardParamErrorButton');
  var storageKey = document.getElementById('storageKey');
  var storageValue = document.getElementById('storageValue');
  var storageSetButton = document.getElementById('storageSetButton');
  var storageGetButton = document.getElementById('storageGetButton');
  var storageRemoveButton = document.getElementById('storageRemoveButton');
  var storageClearButton = document.getElementById('storageClearButton');
  var storageParamErrorButton = document.getElementById('storageParamErrorButton');
  var status = document.getElementById('status');
  var result = document.getElementById('result');
  var eventLog = document.getElementById('eventLog');
  var currentUrl = document.getElementById('currentUrl');
  var blockedUrlButton = document.getElementById('blockedUrlButton');

  if (!button || !paramErrorButton || !unknownActionButton || !timeoutButton ||
    !clipboardText || !clipboardWriteButton || !clipboardReadButton || !clipboardParamErrorButton ||
    !storageKey || !storageValue || !storageSetButton || !storageGetButton || !storageRemoveButton ||
    !storageClearButton || !storageParamErrorButton ||
    !status || !result || !eventLog || !currentUrl || !blockedUrlButton) {
    console.log('[ArkMiniRuntime demo] Missing demo elements.');
    return;
  }

  currentUrl.textContent = '当前 URL：' + window.location.href;
  blockedUrlButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Testing blocked URL.');
    window.location.href = 'https://blocked.example.com/container-test';
  });

  function appendEvent(label, payload) {
    var line = '[' + new Date().toLocaleTimeString() + '] ' + label + ' ' + JSON.stringify(payload);
    if (eventLog.textContent === '暂无事件') {
      eventLog.textContent = line;
      return;
    }
    eventLog.textContent = line + '\n' + eventLog.textContent;
  }

  window.__myascf_on_callback_lost__ = function (detail) {
    appendEvent('CALLBACK_LOST', detail);
  };

  function renderPending(label) {
    status.textContent = label + ' 请求已发送，等待 ArkTS response...';
    result.textContent = 'pending...';
  }

  function renderResolved(response) {
    console.log('[ArkMiniRuntime demo] Promise resolved:', response);
    status.textContent = 'Promise resolved，调用成功。';
    result.textContent = JSON.stringify(response, null, 2);
    appendEvent('resolve', response);
  }

  function renderRejected(err) {
    console.log('[ArkMiniRuntime demo] Promise rejected:', err);
    status.textContent = 'Promise rejected，请查看响应详情。';
    result.textContent = err && err.message ? err.message : JSON.stringify(err, null, 2);
    appendEvent('reject', err);
  }

  button.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending valid ui.showToast request.');
    renderPending('ui.showToast');

    window.myascf.send('ui.showToast', { message: 'hello from h5' })
      .then(renderResolved)
      .catch(renderRejected);
  });

  paramErrorButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending invalid ui.showToast request.');
    renderPending('PARAM_ERROR');

    window.myascf.send('ui.showToast', {})
      .then(renderResolved)
      .catch(renderRejected);
  });

  unknownActionButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending unknown action request.');
    renderPending('UNKNOWN_ACTION');

    window.myascf.send('debug.unknownAction', { message: 'unknown action' })
      .then(renderResolved)
      .catch(renderRejected);
  });

  timeoutButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending timeout test request.');
    renderPending('TIMEOUT');

    window.myascf.send('ui.showToast', { message: 'timeout test' }, { timeout: 1 })
      .then(renderResolved)
      .catch(renderRejected);
  });

  clipboardWriteButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending clipboard write request.');
    renderPending('system.clipboard.writeText');

    window.myascf.send('system.clipboard.writeText', {
      text: clipboardText.value || 'hello from MiniAppRuntime'
    })
      .then(renderResolved)
      .catch(renderRejected);
  });

  clipboardReadButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending clipboard read request.');
    renderPending('system.clipboard.readText');

    window.myascf.send('system.clipboard.readText', {})
      .then(renderResolved)
      .catch(renderRejected);
  });

  clipboardParamErrorButton.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] Sending invalid clipboard write request.');
    renderPending('CLIPBOARD_PARAM_ERROR');

    window.myascf.send('system.clipboard.writeText', {})
      .then(renderResolved)
      .catch(renderRejected);
  });

  function sendStorage(action, params) {
    renderPending(action);
    window.myascf.send(action, params).then(renderResolved).catch(renderRejected);
  }

  storageSetButton.addEventListener('click', function () {
    sendStorage('system.storage.setItem', { key: storageKey.value, value: storageValue.value });
  });

  storageGetButton.addEventListener('click', function () {
    sendStorage('system.storage.getItem', { key: storageKey.value });
  });

  storageRemoveButton.addEventListener('click', function () {
    sendStorage('system.storage.removeItem', { key: storageKey.value });
  });

  storageClearButton.addEventListener('click', function () {
    sendStorage('system.storage.clear', {});
  });

  storageParamErrorButton.addEventListener('click', function () {
    sendStorage('system.storage.setItem', { key: '' });
  });
})();
