(function () {
  var button = document.getElementById('demoButton');
  var status = document.getElementById('status');

  if (!button || !status) {
    console.log('[ArkMiniRuntime demo] Missing demo elements.');
    return;
  }

  button.addEventListener('click', function () {
    console.log('[ArkMiniRuntime demo] H5 button clicked.');
    window.myascf.send('ui.showToast', { message: 'hello' });
    status.textContent = '按钮已点击，请查看 H5 console 日志。';
  });
})();
