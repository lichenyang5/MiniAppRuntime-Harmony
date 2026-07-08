(function () {
  window.myascf = {
    send: function (action, params) {
      console.log('[myascf mock] send is not connected to ArkTS yet.', {
        action: action,
        params: params || {}
      });
    }
  };
})();
