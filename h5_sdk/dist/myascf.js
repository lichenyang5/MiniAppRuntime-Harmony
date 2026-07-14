"use strict";
var MyASCFWebSDK;
(function (MyASCFWebSDK) {
    MyASCFWebSDK.ERROR_CODE_SUCCESS = 0;
    MyASCFWebSDK.ERROR_CODE_CALLBACK_LOST = 1004;
    MyASCFWebSDK.ERROR_CODE_TIMEOUT = 1005;
    MyASCFWebSDK.ERROR_CODE_NATIVE_UNAVAILABLE = 1006;
    MyASCFWebSDK.ERROR_CODE_INVALID_RESPONSE = 1007;
    MyASCFWebSDK.DEFAULT_TIMEOUT = 5000;
})(MyASCFWebSDK || (MyASCFWebSDK = {}));
var MyASCFWebSDK;
(function (MyASCFWebSDK) {
    let requestSequence = 0;
    function createRequestId() {
        requestSequence += 1;
        return `myascf_${Date.now()}_${requestSequence}`;
    }
    MyASCFWebSDK.createRequestId = createRequestId;
})(MyASCFWebSDK || (MyASCFWebSDK = {}));
var MyASCFWebSDK;
(function (MyASCFWebSDK) {
    class CallbackStore {
        constructor() {
            this.callbacks = new Map();
        }
        set(requestId, callback) {
            this.callbacks.set(requestId, callback);
        }
        get(requestId) {
            return this.callbacks.get(requestId);
        }
        take(requestId) {
            const callback = this.callbacks.get(requestId);
            if (callback) {
                this.callbacks.delete(requestId);
            }
            return callback;
        }
        delete(requestId) {
            return this.callbacks.delete(requestId);
        }
    }
    MyASCFWebSDK.CallbackStore = CallbackStore;
})(MyASCFWebSDK || (MyASCFWebSDK = {}));
var MyASCFWebSDK;
(function (MyASCFWebSDK) {
    class NativeBridgeError extends Error {
        constructor(code, message) {
            super(message);
            this.name = 'NativeBridgeError';
            this.code = code;
        }
    }
    MyASCFWebSDK.NativeBridgeError = NativeBridgeError;
    class NativeAdapter {
        postMessage(request) {
            if (!window.MyASCFNative || typeof window.MyASCFNative.postMessage !== 'function') {
                throw new NativeBridgeError(MyASCFWebSDK.ERROR_CODE_NATIVE_UNAVAILABLE, 'Native bridge is unavailable. Please run inside HarmonyOS ArkWeb container.');
            }
            window.MyASCFNative.postMessage(JSON.stringify(request));
        }
    }
    MyASCFWebSDK.NativeAdapter = NativeAdapter;
})(MyASCFWebSDK || (MyASCFWebSDK = {}));
var MyASCFWebSDK;
(function (MyASCFWebSDK) {
    function isRecord(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
    function getTimeout(options) {
        if (!options || typeof options.timeout !== 'number' ||
            !Number.isFinite(options.timeout) || options.timeout <= 0) {
            return MyASCFWebSDK.DEFAULT_TIMEOUT;
        }
        return options.timeout;
    }
    function safeDebugCall(method, record) {
        try {
            const panel = window.MyASCFDebugPanel;
            const handler = panel && panel[method];
            if (typeof handler === 'function') {
                handler.call(panel, record);
            }
        }
        catch (error) {
            console.warn('[myascf] DebugPanel failed:', error);
        }
    }
    function createErrorResponse(requestId, action, code, message, duration) {
        return {
            requestId,
            action,
            code,
            message,
            data: { echoAction: action },
            duration
        };
    }
    function parseResponse(responseInput) {
        const parsed = typeof responseInput === 'string'
            ? JSON.parse(responseInput)
            : responseInput;
        if (!isRecord(parsed) || typeof parsed.requestId !== 'string' ||
            typeof parsed.code !== 'number' || typeof parsed.message !== 'string') {
            throw new Error('Native response does not match BridgeResponse.');
        }
        if (parsed.data !== undefined && !isRecord(parsed.data)) {
            throw new Error('Native response data must be an object.');
        }
        const response = {
            requestId: parsed.requestId,
            code: parsed.code,
            message: parsed.message
        };
        if (parsed.data !== undefined) {
            response.data = parsed.data;
        }
        return response;
    }
    function extractRequestId(responseInput) {
        let candidate = responseInput;
        if (typeof responseInput === 'string') {
            try {
                candidate = JSON.parse(responseInput);
            }
            catch (error) {
                return '';
            }
        }
        if (isRecord(candidate) && typeof candidate.requestId === 'string') {
            return candidate.requestId;
        }
        return '';
    }
    class MyASCFClient {
        constructor() {
            this.callbacks = new MyASCFWebSDK.CallbackStore();
            this.nativeAdapter = new MyASCFWebSDK.NativeAdapter();
        }
        send(action, params = {}, options) {
            return new Promise((resolve, reject) => {
                const request = {
                    requestId: MyASCFWebSDK.createRequestId(),
                    action,
                    params
                };
                const timeout = getTimeout(options);
                const createdAt = Date.now();
                safeDebugCall('recordStart', {
                    requestId: request.requestId,
                    action,
                    status: 'pending',
                    params,
                    startTime: createdAt
                });
                const timer = window.setTimeout(() => {
                    this.callbacks.delete(request.requestId);
                    const timeoutResponse = createErrorResponse(request.requestId, action, MyASCFWebSDK.ERROR_CODE_TIMEOUT, 'TIMEOUT: native response timeout', Date.now() - createdAt);
                    console.warn('[myascf] TIMEOUT:', timeoutResponse);
                    safeDebugCall('recordError', {
                        requestId: request.requestId,
                        action,
                        status: 'timeout',
                        code: timeoutResponse.code,
                        message: timeoutResponse.message,
                        params,
                        response: timeoutResponse,
                        endTime: Date.now(),
                        duration: timeoutResponse.duration
                    });
                    reject(timeoutResponse);
                }, timeout);
                this.callbacks.set(request.requestId, {
                    resolve,
                    reject,
                    timer,
                    action,
                    params,
                    createdAt
                });
                try {
                    console.log('[myascf] send request:', JSON.stringify(request));
                    this.nativeAdapter.postMessage(request);
                }
                catch (error) {
                    const callback = this.callbacks.take(request.requestId);
                    if (callback) {
                        window.clearTimeout(callback.timer);
                    }
                    const code = error instanceof MyASCFWebSDK.NativeBridgeError
                        ? error.code
                        : MyASCFWebSDK.ERROR_CODE_INVALID_RESPONSE;
                    const message = error instanceof Error ? error.message : 'Bridge request failed.';
                    const errorResponse = createErrorResponse(request.requestId, action, code, message, Date.now() - createdAt);
                    safeDebugCall('recordError', {
                        requestId: request.requestId,
                        action,
                        status: 'reject',
                        code,
                        message,
                        params,
                        response: errorResponse,
                        endTime: Date.now(),
                        duration: errorResponse.duration
                    });
                    reject(errorResponse);
                }
            });
        }
        handleNativeResponse(responseInput) {
            console.log('[myascf] native response:', responseInput);
            let response;
            try {
                response = parseResponse(responseInput);
            }
            catch (error) {
                this.handleInvalidResponse(responseInput, error);
                return;
            }
            const callback = this.callbacks.take(response.requestId);
            if (!callback) {
                this.emitCallbackLost(response);
                return;
            }
            window.clearTimeout(callback.timer);
            response.duration = Date.now() - callback.createdAt;
            response.action = callback.action;
            safeDebugCall('recordEnd', {
                requestId: response.requestId,
                action: callback.action,
                status: response.code === MyASCFWebSDK.ERROR_CODE_SUCCESS ? 'resolve' : 'reject',
                code: response.code,
                message: response.message,
                params: callback.params,
                response,
                endTime: Date.now(),
                duration: response.duration
            });
            if (response.code === MyASCFWebSDK.ERROR_CODE_SUCCESS) {
                callback.resolve(response);
            }
            else {
                callback.reject(response);
            }
        }
        handleInvalidResponse(responseInput, error) {
            const requestId = extractRequestId(responseInput);
            const callback = requestId
                ? this.callbacks.take(requestId)
                : undefined;
            if (callback) {
                window.clearTimeout(callback.timer);
            }
            const action = callback ? callback.action : '';
            const message = error instanceof Error
                ? `INVALID_RESPONSE: ${error.message}`
                : 'INVALID_RESPONSE: native response is invalid.';
            const invalidResponse = createErrorResponse(requestId, action, MyASCFWebSDK.ERROR_CODE_INVALID_RESPONSE, message, callback ? Date.now() - callback.createdAt : undefined);
            console.error('[myascf] invalid native response:', error);
            safeDebugCall('recordError', {
                requestId,
                action,
                status: 'invalid_response',
                code: MyASCFWebSDK.ERROR_CODE_INVALID_RESPONSE,
                message,
                params: callback ? callback.params : undefined,
                response: responseInput,
                endTime: Date.now(),
                duration: invalidResponse.duration
            });
            if (callback) {
                callback.reject(invalidResponse);
            }
        }
        emitCallbackLost(response) {
            const action = response.data && typeof response.data.echoAction === 'string'
                ? response.data.echoAction
                : '';
            const detail = createErrorResponse(response.requestId, action, MyASCFWebSDK.ERROR_CODE_CALLBACK_LOST, 'CALLBACK_LOST: callback not found');
            detail.data = { echoAction: action, nativeResponse: response };
            console.warn('[myascf] CALLBACK_LOST:', detail);
            safeDebugCall('recordLost', {
                requestId: detail.requestId,
                action,
                status: 'callback_lost',
                code: detail.code,
                message: detail.message,
                response: detail,
                endTime: Date.now()
            });
            if (typeof window.__myascf_on_callback_lost__ === 'function') {
                window.__myascf_on_callback_lost__(detail);
            }
        }
    }
    MyASCFWebSDK.MyASCFClient = MyASCFClient;
    function initMyASCF() {
        const client = new MyASCFClient();
        window.myascf = client;
        window.__myascf_on_native_response__ = (response) => client.handleNativeResponse(response);
        return client;
    }
    MyASCFWebSDK.initMyASCF = initMyASCF;
})(MyASCFWebSDK || (MyASCFWebSDK = {}));
MyASCFWebSDK.initMyASCF();
