"use strict";
var MyASCFWebSDK = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/auto-init.ts
  var auto_init_exports = {};
  __export(auto_init_exports, {
    ERROR_CODE_CALLBACK_LOST: () => ERROR_CODE_CALLBACK_LOST,
    ERROR_CODE_INVALID_RESPONSE: () => ERROR_CODE_INVALID_RESPONSE,
    ERROR_CODE_NATIVE_UNAVAILABLE: () => ERROR_CODE_NATIVE_UNAVAILABLE,
    ERROR_CODE_SUCCESS: () => ERROR_CODE_SUCCESS,
    ERROR_CODE_TIMEOUT: () => ERROR_CODE_TIMEOUT,
    createMyASCF: () => createMyASCF,
    createTypedApi: () => createTypedApi,
    initMyASCF: () => initMyASCF
  });

  // src/callback-store.ts
  var CallbackStore = class {
    constructor() {
      this.callbacks = /* @__PURE__ */ new Map();
    }
    set(requestId, callback) {
      this.callbacks.set(requestId, callback);
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
  };

  // src/debug-adapter.ts
  var DebugAdapter = class {
    constructor(targetWindow) {
      this.targetWindow = targetWindow;
    }
    record(method, record) {
      try {
        const panel = this.targetWindow.MyASCFDebugPanel;
        const handler = panel && panel[method];
        if (typeof handler === "function") {
          handler.call(panel, sanitizeDebugRecord(record));
        }
      } catch (error) {
        console.warn("[myascf] DebugPanel failed:", error);
      }
    }
  };
  function stripUrlQuery(value) {
    if (typeof value !== "string") {
      return value;
    }
    try {
      const parsed = new URL(value);
      parsed.username = "";
      parsed.password = "";
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
    } catch (error) {
      const queryIndex = value.indexOf("?");
      const fragmentIndex = value.indexOf("#");
      const indexes = [queryIndex, fragmentIndex].filter((index) => index >= 0);
      const endIndex = indexes.length === 0 ? value.length : Math.min(...indexes);
      return value.slice(0, endIndex);
    }
  }
  function sanitizeNetworkParams(params) {
    if (!params || typeof params !== "object" || Array.isArray(params)) {
      return params;
    }
    const source = params;
    const headers = source.headers && typeof source.headers === "object" && !Array.isArray(source.headers) ? source.headers : void 0;
    return {
      url: stripUrlQuery(source.url),
      method: source.method,
      timeout: source.timeout,
      responseType: source.responseType,
      headerNames: headers ? Object.keys(headers) : [],
      bodyLength: typeof source.body === "string" ? source.body.length : 0
    };
  }
  function sanitizeNetworkResponse(response) {
    var _a;
    if (!response || typeof response !== "object" || Array.isArray(response)) {
      return response;
    }
    const source = response;
    const data = source.data && typeof source.data === "object" && !Array.isArray(source.data) ? source.data : void 0;
    if (!data) {
      return response;
    }
    const bodyText = typeof data.body === "string" ? data.body : JSON.stringify((_a = data.body) != null ? _a : "");
    const headers = data.headers && typeof data.headers === "object" && !Array.isArray(data.headers) ? data.headers : void 0;
    return __spreadProps(__spreadValues({}, source), {
      data: {
        echoAction: data.echoAction,
        ok: data.ok,
        statusCode: data.statusCode,
        statusText: data.statusText,
        duration: data.duration,
        headerNames: headers ? Object.keys(headers) : [],
        bodyLength: bodyText.length
      }
    });
  }
  function sanitizeDebugRecord(record) {
    if (record.action !== "network.request") {
      return record;
    }
    return __spreadProps(__spreadValues({}, record), {
      params: sanitizeNetworkParams(record.params),
      response: sanitizeNetworkResponse(record.response)
    });
  }

  // src/error-code.ts
  var ERROR_CODE_SUCCESS = 0;
  var ERROR_CODE_CALLBACK_LOST = 1004;
  var ERROR_CODE_TIMEOUT = 1005;
  var ERROR_CODE_NATIVE_UNAVAILABLE = 1006;
  var ERROR_CODE_INVALID_RESPONSE = 1007;
  var DEFAULT_TIMEOUT = 5e3;

  // src/native-adapter.ts
  var NativeBridgeError = class extends Error {
    constructor(code, message) {
      super(message);
      this.name = "NativeBridgeError";
      this.code = code;
    }
  };
  var NativeAdapter = class {
    constructor(targetWindow) {
      this.targetWindow = targetWindow;
    }
    postMessage(request) {
      const nativeBridge = this.targetWindow.MyASCFNative;
      if (!nativeBridge || typeof nativeBridge.postMessage !== "function") {
        throw new NativeBridgeError(
          ERROR_CODE_NATIVE_UNAVAILABLE,
          "Native bridge is unavailable. Please run inside HarmonyOS ArkWeb container."
        );
      }
      nativeBridge.postMessage(JSON.stringify(request));
    }
  };

  // src/request-id.ts
  var requestSequence = 0;
  function createRequestId() {
    requestSequence += 1;
    return `myascf_${Date.now()}_${requestSequence}`;
  }

  // src/client.ts
  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function getTimeout(options) {
    if (!options || typeof options.timeout !== "number" || !Number.isFinite(options.timeout) || options.timeout <= 0) {
      return DEFAULT_TIMEOUT;
    }
    return options.timeout;
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
    const parsed = typeof responseInput === "string" ? JSON.parse(responseInput) : responseInput;
    if (!isRecord(parsed) || typeof parsed.requestId !== "string" || typeof parsed.code !== "number" || typeof parsed.message !== "string") {
      throw new Error("Native response does not match BridgeResponse.");
    }
    if (parsed.data !== void 0 && !isRecord(parsed.data)) {
      throw new Error("Native response data must be an object.");
    }
    const response = {
      requestId: parsed.requestId,
      code: parsed.code,
      message: parsed.message
    };
    if (parsed.data !== void 0) {
      response.data = parsed.data;
    }
    return response;
  }
  function extractRequestId(responseInput) {
    let candidate = responseInput;
    if (typeof responseInput === "string") {
      try {
        candidate = JSON.parse(responseInput);
      } catch (error) {
        return "";
      }
    }
    if (isRecord(candidate) && typeof candidate.requestId === "string") {
      return candidate.requestId;
    }
    return "";
  }
  var MyASCFClient = class {
    constructor(targetWindow) {
      this.targetWindow = targetWindow;
      this.callbacks = new CallbackStore();
      this.nativeAdapter = new NativeAdapter(targetWindow);
      this.debugAdapter = new DebugAdapter(targetWindow);
    }
    send(action, params = {}, options) {
      return new Promise((resolve, reject) => {
        const request = {
          requestId: createRequestId(),
          action,
          params
        };
        const timeout = getTimeout(options);
        const createdAt = Date.now();
        this.debugAdapter.record("recordStart", {
          requestId: request.requestId,
          action,
          status: "pending",
          params,
          startTime: createdAt
        });
        const timer = this.targetWindow.setTimeout(() => {
          this.callbacks.delete(request.requestId);
          const timeoutResponse = createErrorResponse(
            request.requestId,
            action,
            ERROR_CODE_TIMEOUT,
            "TIMEOUT: native response timeout",
            Date.now() - createdAt
          );
          console.warn("[myascf] TIMEOUT:", timeoutResponse);
          this.debugAdapter.record("recordError", {
            requestId: request.requestId,
            action,
            status: "timeout",
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
          console.log("[myascf] send request:", request.requestId, request.action);
          this.nativeAdapter.postMessage(request);
        } catch (error) {
          const callback = this.callbacks.take(request.requestId);
          if (callback) {
            this.targetWindow.clearTimeout(callback.timer);
          }
          const code = error instanceof NativeBridgeError ? error.code : ERROR_CODE_INVALID_RESPONSE;
          const message = error instanceof Error ? error.message : "Bridge request failed.";
          const errorResponse = createErrorResponse(
            request.requestId,
            action,
            code,
            message,
            Date.now() - createdAt
          );
          this.debugAdapter.record("recordError", {
            requestId: request.requestId,
            action,
            status: "reject",
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
    sendTyped(action, ...args) {
      const params = args[0];
      const options = args[1];
      return this.send(action, params, options);
    }
    handleNativeResponse(responseInput) {
      console.log("[myascf] native response received");
      let response;
      try {
        response = parseResponse(responseInput);
      } catch (error) {
        this.handleInvalidResponse(responseInput, error);
        return;
      }
      const callback = this.callbacks.take(response.requestId);
      if (!callback) {
        this.emitCallbackLost(response);
        return;
      }
      this.targetWindow.clearTimeout(callback.timer);
      response.duration = Date.now() - callback.createdAt;
      response.action = callback.action;
      this.debugAdapter.record("recordEnd", {
        requestId: response.requestId,
        action: callback.action,
        status: response.code === ERROR_CODE_SUCCESS ? "resolve" : "reject",
        code: response.code,
        message: response.message,
        params: callback.params,
        response,
        endTime: Date.now(),
        duration: response.duration
      });
      if (response.code === ERROR_CODE_SUCCESS) {
        callback.resolve(response);
      } else {
        callback.reject(response);
      }
    }
    handleInvalidResponse(responseInput, error) {
      const requestId = extractRequestId(responseInput);
      const callback = requestId ? this.callbacks.take(requestId) : void 0;
      if (callback) {
        this.targetWindow.clearTimeout(callback.timer);
      }
      const action = callback ? callback.action : "";
      const message = error instanceof Error ? `INVALID_RESPONSE: ${error.message}` : "INVALID_RESPONSE: native response is invalid.";
      const invalidResponse = createErrorResponse(
        requestId,
        action,
        ERROR_CODE_INVALID_RESPONSE,
        message,
        callback ? Date.now() - callback.createdAt : void 0
      );
      console.error("[myascf] invalid native response:", error);
      this.debugAdapter.record("recordError", {
        requestId,
        action,
        status: "invalid_response",
        code: ERROR_CODE_INVALID_RESPONSE,
        message,
        params: callback ? callback.params : void 0,
        response: responseInput,
        endTime: Date.now(),
        duration: invalidResponse.duration
      });
      if (callback) {
        callback.reject(invalidResponse);
      }
    }
    emitCallbackLost(response) {
      const action = response.data && typeof response.data.echoAction === "string" ? response.data.echoAction : "";
      const detail = createErrorResponse(
        response.requestId,
        action,
        ERROR_CODE_CALLBACK_LOST,
        "CALLBACK_LOST: callback not found"
      );
      detail.data = { echoAction: action, nativeResponse: response };
      console.warn("[myascf] CALLBACK_LOST:", detail.requestId, detail.action, detail.code);
      this.debugAdapter.record("recordLost", {
        requestId: detail.requestId,
        action,
        status: "callback_lost",
        code: detail.code,
        message: detail.message,
        response: detail,
        endTime: Date.now()
      });
      if (typeof this.targetWindow.__myascf_on_callback_lost__ === "function") {
        this.targetWindow.__myascf_on_callback_lost__(detail);
      }
    }
  };

  // src/generated/api-client.ts
  function createTypedApi(client) {
    return {
      runtime: {
        getApiList: (options) => client.sendTyped("runtime.getApiList", void 0, options)
      },
      ui: {
        showToast: (params, options) => client.sendTyped("ui.showToast", params, options)
      },
      system: {
        clipboard: {
          writeText: (params, options) => client.sendTyped("system.clipboard.writeText", params, options),
          readText: (options) => client.sendTyped("system.clipboard.readText", void 0, options)
        },
        storage: {
          setItem: (params, options) => client.sendTyped("system.storage.setItem", params, options),
          getItem: (params, options) => client.sendTyped("system.storage.getItem", params, options),
          removeItem: (params, options) => client.sendTyped("system.storage.removeItem", params, options),
          clear: (options) => client.sendTyped("system.storage.clear", void 0, options)
        }
      },
      network: {
        request: (params, options) => client.sendTyped("network.request", params, options)
      }
    };
  }

  // src/index.ts
  function resolveTargetWindow(options) {
    var _a;
    const targetWindow = (_a = options == null ? void 0 : options.targetWindow) != null ? _a : typeof window === "undefined" ? void 0 : window;
    if (!targetWindow) {
      throw new Error("Window is unavailable. Pass options.targetWindow in this environment.");
    }
    return targetWindow;
  }
  function createMyASCF(options) {
    return new MyASCFClient(resolveTargetWindow(options));
  }
  function initMyASCF(options) {
    const targetWindow = resolveTargetWindow(options);
    const client = new MyASCFClient(targetWindow);
    targetWindow.myascf = client;
    targetWindow.__myascf_on_native_response__ = (response) => client.handleNativeResponse(response);
    return client;
  }

  // src/auto-init.ts
  initMyASCF();
  return __toCommonJS(auto_init_exports);
})();
