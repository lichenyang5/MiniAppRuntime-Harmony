(function () {
  var ERROR_CODE_SUCCESS = 0;
  var ERROR_CODE_CALLBACK_LOST = 1004;
  var ERROR_CODE_TIMEOUT = 1005;
  var DEFAULT_TIMEOUT = 5000;
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

  function getTimeout(options) {
    if (!options || typeof options.timeout !== 'number') {
      return DEFAULT_TIMEOUT;
    }
    if (options.timeout <= 0) {
      return DEFAULT_TIMEOUT;
    }
    return options.timeout;
  }

  function safeDebugCall(method, record) {
    try {
      if (window.MyASCFDebugPanel && typeof window.MyASCFDebugPanel[method] === 'function') {
        window.MyASCFDebugPanel[method](record);
      }
    } catch (err) {
      console.warn('[myascf] DebugPanel failed:', err);
    }
  }

  function emitCallbackLost(response) {
    var detail = {
      requestId: response && response.requestId ? response.requestId : '',
      action: response && response.data ? response.data.echoAction : '',
      code: ERROR_CODE_CALLBACK_LOST,
      message: 'CALLBACK_LOST: callback not found',
      data: response || {}
    };

    console.warn('[myascf] CALLBACK_LOST:', detail);
    safeDebugCall('recordLost', {
      requestId: detail.requestId,
      action: detail.action,
      status: 'callback_lost',
      code: ERROR_CODE_CALLBACK_LOST,
      message: detail.message,
      response: detail,
      endTime: Date.now()
    });

    if (typeof window.__myascf_on_callback_lost__ === 'function') {
      window.__myascf_on_callback_lost__(detail);
    }
  }

  window.__myascf_on_native_response__ = function (responseText) {
    console.log('[myascf] native response:', responseText);

    var response;
    try {
      response = parseResponse(responseText);
    } catch (err) {
      console.error('[myascf] failed to parse native response:', err);
      return;
    }

    var callback = callbacks.get(response.requestId);

    if (!callback) {
      emitCallbackLost(response);
      return;
    }

    clearTimeout(callback.timer);
    callbacks.delete(response.requestId);
    response.duration = Date.now() - callback.createdAt;
    response.action = callback.action;
    safeDebugCall('recordEnd', {
      requestId: response.requestId,
      action: callback.action,
      status: response.code === ERROR_CODE_SUCCESS ? 'resolve' : 'reject',
      code: response.code,
      message: response.message,
      params: callback.params,
      response: response,
      endTime: Date.now(),
      duration: response.duration
    });

    if (response.code === ERROR_CODE_SUCCESS) {
      callback.resolve(response);
      return;
    }

    callback.reject(response);
  };

  window.myascf = {
    send: function (action, params, options) {
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

        var timeout = getTimeout(options);
        var createdAt = Date.now();
        safeDebugCall('recordStart', {
          requestId: request.requestId,
          action: action,
          status: 'pending',
          params: request.params,
          startTime: createdAt
        });
        var timer = setTimeout(function () {
          callbacks.delete(request.requestId);

          var timeoutResponse = {
            requestId: request.requestId,
            action: action,
            code: ERROR_CODE_TIMEOUT,
            message: 'TIMEOUT: native response timeout',
            data: {
              echoAction: action
            },
            duration: Date.now() - createdAt
          };

          console.warn('[myascf] TIMEOUT:', timeoutResponse);
          safeDebugCall('recordError', {
            requestId: request.requestId,
            action: action,
            status: 'timeout',
            code: ERROR_CODE_TIMEOUT,
            message: timeoutResponse.message,
            params: request.params,
            response: timeoutResponse,
            endTime: Date.now(),
            duration: timeoutResponse.duration
          });
          reject(timeoutResponse);
        }, timeout);

        callbacks.set(request.requestId, {
          resolve: resolve,
          reject: reject,
          timer: timer,
          action: action,
          params: request.params,
          createdAt: createdAt
        });

        try {
          var requestText = JSON.stringify(request);
          console.log('[myascf] send request:', requestText);
          window.MyASCFNative.postMessage(requestText);
        } catch (err) {
          clearTimeout(timer);
          callbacks.delete(request.requestId);
          safeDebugCall('recordError', {
            requestId: request.requestId,
            action: action,
            status: 'reject',
            message: err && err.message ? err.message : 'send failed',
            params: request.params,
            response: err,
            endTime: Date.now(),
            duration: Date.now() - createdAt
          });
          reject(err);
        }
      });
    }
  };
})();
