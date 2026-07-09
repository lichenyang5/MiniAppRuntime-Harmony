(function () {
  var button = document.getElementById('demoButton');
  var paramErrorButton = document.getElementById('paramErrorButton');
  var status = document.getElementById('status');
  var result = document.getElementById('result');

  if (!button || !paramErrorButton || !status || !result) {
    console.log('[ArkMiniRuntime demo] Missing demo elements.');
    return;
  }

  function renderPending(label) {
    status.textContent = label + ' 请求已发送，等待 ArkTS response...';
    result.textContent = 'pending...';
  }

  function renderResolved(response) {
    console.log('[ArkMiniRuntime demo] Promise resolved:', response);
    status.textContent = 'Promise resolved，调用成功。';
    result.textContent = JSON.stringify(response, null, 2);
  }

  function renderRejected(err) {
    console.log('[ArkMiniRuntime demo] Promise rejected:', err);
    status.textContent = 'Promise rejected，请查看响应详情。';
    result.textContent = err && err.message ? err.message : JSON.stringify(err, null, 2);
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
      .catch(function (err) {
        renderRejected(err);
      });
  });
})();
