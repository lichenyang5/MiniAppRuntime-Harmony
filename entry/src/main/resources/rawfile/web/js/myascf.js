(function () {
  var callbacks = new Map();
  var requestSeq = 0;

  function createRequestId() {
    requestSeq += 1;
    return 'myascf_' + Date.now() + '_' + requestSeq;
  }

  function parseResponse(responseText) {
    if (typeof responseText === 'string') {
      return JSON.parse(responseText);
    }
    return responseText;
  }

  window.__myascf_on_native_response__ = function (responseText) {
    console.log('[myascf] native response:', responseText);

    var response = parseResponse(responseText);
    var callback = callbacks.get(response.requestId);

    if (!callback) {
      console.log('[myascf] callback lost:', response.requestId);
      return;
    }

    callbacks.delete(response.requestId);

    if (response.code === 0) {
      callback.resolve(response);
      return;
    }

    callback.reject(response);
  };

  window.myascf = {
    send: function (action, params) {
      return new Promise(function (resolve, reject) {
        var request = {
          requestId: createRequestId(),
          action: action,
          params: params || {}
        };

        if (!window.MyASCFNative || typeof window.MyASCFNative.postMessage !== 'function') {
          reject(new Error('MyASCFNative.postMessage is not available.'));
          return;
        }

        callbacks.set(request.requestId, {
          resolve: resolve,
          reject: reject
        });

        try {
          var requestText = JSON.stringify(request);
          console.log('[myascf] send request:', requestText);
          window.MyASCFNative.postMessage(requestText);
        } catch (err) {
          callbacks.delete(request.requestId);
          reject(err);
        }
      });
    }
  };
})();
