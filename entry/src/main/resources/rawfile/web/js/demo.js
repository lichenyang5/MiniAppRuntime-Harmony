(function () {
  var button = document.getElementById('demoButton');
  var status = document.getElementById('status');
  var result = document.getElementById('result');

  if (!button || !status || !result) {
    console.log('[ArkMiniRuntime demo] Missing demo elements.');
    return;
  }

  button.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] H5 button clicked, sending request to ArkTS.');
    status.textContent = '请求已发送，等待 ArkTS mock response...';
    result.textContent = 'pending...';

    window.myascf.send('ui.showToast', { message: 'hello from h5' })
      .then(function (response) {
        console.log('[ArkMiniRuntime demo] Promise resolved:', response);
        status.textContent = 'Promise resolved，已收到 ArkTS mock response。';
        result.textContent = JSON.stringify(response, null, 2);
      })
      .catch(function (err) {
        console.log('[ArkMiniRuntime demo] Promise rejected:', err);
        status.textContent = 'Promise rejected，请查看 H5 console 日志。';
        result.textContent = err && err.message ? err.message : JSON.stringify(err, null, 2);
      });
  });
})();
