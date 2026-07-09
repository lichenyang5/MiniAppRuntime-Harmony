(function () {
  var button = document.getElementById('demoButton');
  var paramErrorButton = document.getElementById('paramErrorButton');
  var unknownActionButton = document.getElementById('unknownActionButton');
  var timeoutButton = document.getElementById('timeoutButton');
  var clipboardText = document.getElementById('clipboardText');
  var clipboardWriteButton = document.getElementById('clipboardWriteButton');
  var clipboardReadButton = document.getElementById('clipboardReadButton');
  var clipboardParamErrorButton = document.getElementById('clipboardParamErrorButton');
  var status = document.getElementById('status');
  var result = document.getElementById('result');
  var eventLog = document.getElementById('eventLog');

  if (!button || !paramErrorButton || !unknownActionButton || !timeoutButton ||
    !clipboardText || !clipboardWriteButton || !clipboardReadButton || !clipboardParamErrorButton ||
    !status || !result || !eventLog) {
    console.log('[ArkMiniRuntime demo] Missing demo elements.');
    return;
  }

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
})();
