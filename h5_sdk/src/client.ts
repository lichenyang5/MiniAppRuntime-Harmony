import type {
  BridgeRequest,
  BridgeRequestParams,
  BridgeResponse,
  BridgeResponseData,
  CallbackRecord,
  MyASCF,
  MyASCFSendOptions
} from './bridge-types.js';
import { CallbackStore } from './callback-store.js';
import { DebugAdapter } from './debug-adapter.js';
import {
  DEFAULT_TIMEOUT,
  ERROR_CODE_CALLBACK_LOST,
  ERROR_CODE_INVALID_RESPONSE,
  ERROR_CODE_SUCCESS,
  ERROR_CODE_TIMEOUT
} from './error-code.js';
import { NativeAdapter, NativeBridgeError } from './native-adapter.js';
import { createRequestId } from './request-id.js';
import type {
  ApiAction,
  TypedBridgeResponse,
  TypedSendArgs
} from './generated/api-types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getTimeout(options?: MyASCFSendOptions): number {
  if (!options || typeof options.timeout !== 'number' ||
    !Number.isFinite(options.timeout) || options.timeout <= 0) {
    return DEFAULT_TIMEOUT;
  }
  return options.timeout;
}

function createErrorResponse(
  requestId: string,
  action: string,
  code: number,
  message: string,
  duration?: number
): BridgeResponse {
  return {
    requestId,
    action,
    code,
    message,
    data: { echoAction: action },
    duration
  };
}

function parseResponse(responseInput: string | BridgeResponse): BridgeResponse {
  const parsed: unknown = typeof responseInput === 'string'
    ? JSON.parse(responseInput)
    : responseInput;

  if (!isRecord(parsed) || typeof parsed.requestId !== 'string' ||
    typeof parsed.code !== 'number' || typeof parsed.message !== 'string') {
    throw new Error('Native response does not match BridgeResponse.');
  }
  if (parsed.data !== undefined && !isRecord(parsed.data)) {
    throw new Error('Native response data must be an object.');
  }

  const response: BridgeResponse = {
    requestId: parsed.requestId,
    code: parsed.code,
    message: parsed.message
  };
  if (parsed.data !== undefined) {
    response.data = parsed.data as BridgeResponseData;
  }
  return response;
}

function extractRequestId(responseInput: string | BridgeResponse): string {
  let candidate: unknown = responseInput;
  if (typeof responseInput === 'string') {
    try {
      candidate = JSON.parse(responseInput) as unknown;
    } catch (error) {
      return '';
    }
  }
  if (isRecord(candidate) && typeof candidate.requestId === 'string') {
    return candidate.requestId;
  }
  return '';
}

export class MyASCFClient implements MyASCF {
  private readonly callbacks: CallbackStore = new CallbackStore();
  private readonly nativeAdapter: NativeAdapter;
  private readonly debugAdapter: DebugAdapter;

  constructor(private readonly targetWindow: Window) {
    this.nativeAdapter = new NativeAdapter(targetWindow);
    this.debugAdapter = new DebugAdapter(targetWindow);
  }

  send(
    action: string,
    params: BridgeRequestParams = {},
    options?: MyASCFSendOptions
  ): Promise<BridgeResponse> {
    return new Promise<BridgeResponse>((resolve, reject) => {
      const request: BridgeRequest = {
        requestId: createRequestId(),
        action,
        params
      };
      const timeout: number = getTimeout(options);
      const createdAt: number = Date.now();

      this.debugAdapter.record('recordStart', {
        requestId: request.requestId,
        action,
        status: 'pending',
        params,
        startTime: createdAt
      });

      const timer: number = this.targetWindow.setTimeout(() => {
        this.callbacks.delete(request.requestId);
        const timeoutResponse: BridgeResponse = createErrorResponse(
          request.requestId,
          action,
          ERROR_CODE_TIMEOUT,
          'TIMEOUT: native response timeout',
          Date.now() - createdAt
        );
        console.warn('[myascf] TIMEOUT:', timeoutResponse);
        this.debugAdapter.record('recordError', {
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
      } catch (error) {
        const callback: CallbackRecord | undefined = this.callbacks.take(request.requestId);
        if (callback) {
          this.targetWindow.clearTimeout(callback.timer);
        }
        const code: number = error instanceof NativeBridgeError
          ? error.code
          : ERROR_CODE_INVALID_RESPONSE;
        const message: string = error instanceof Error ? error.message : 'Bridge request failed.';
        const errorResponse: BridgeResponse = createErrorResponse(
          request.requestId,
          action,
          code,
          message,
          Date.now() - createdAt
        );
        this.debugAdapter.record('recordError', {
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

  sendTyped<T extends ApiAction>(
    action: T,
    ...args: TypedSendArgs<T>
  ): Promise<TypedBridgeResponse<T>> {
    const params: BridgeRequestParams | undefined = args[0] as
      BridgeRequestParams | undefined;
    const options: MyASCFSendOptions | undefined = args[1];
    return this.send(action, params, options) as Promise<TypedBridgeResponse<T>>;
  }

  handleNativeResponse(responseInput: string | BridgeResponse): void {
    console.log('[myascf] native response:', responseInput);

    let response: BridgeResponse;
    try {
      response = parseResponse(responseInput);
    } catch (error) {
      this.handleInvalidResponse(responseInput, error);
      return;
    }

    const callback: CallbackRecord | undefined = this.callbacks.take(response.requestId);
    if (!callback) {
      this.emitCallbackLost(response);
      return;
    }

    this.targetWindow.clearTimeout(callback.timer);
    response.duration = Date.now() - callback.createdAt;
    response.action = callback.action;
    this.debugAdapter.record('recordEnd', {
      requestId: response.requestId,
      action: callback.action,
      status: response.code === ERROR_CODE_SUCCESS ? 'resolve' : 'reject',
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

  private handleInvalidResponse(
    responseInput: string | BridgeResponse,
    error: unknown
  ): void {
    const requestId: string = extractRequestId(responseInput);
    const callback: CallbackRecord | undefined = requestId
      ? this.callbacks.take(requestId)
      : undefined;
    if (callback) {
      this.targetWindow.clearTimeout(callback.timer);
    }
    const action: string = callback ? callback.action : '';
    const message: string = error instanceof Error
      ? `INVALID_RESPONSE: ${error.message}`
      : 'INVALID_RESPONSE: native response is invalid.';
    const invalidResponse: BridgeResponse = createErrorResponse(
      requestId,
      action,
      ERROR_CODE_INVALID_RESPONSE,
      message,
      callback ? Date.now() - callback.createdAt : undefined
    );

    console.error('[myascf] invalid native response:', error);
    this.debugAdapter.record('recordError', {
      requestId,
      action,
      status: 'invalid_response',
      code: ERROR_CODE_INVALID_RESPONSE,
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

  private emitCallbackLost(response: BridgeResponse): void {
    const action: string = response.data && typeof response.data.echoAction === 'string'
      ? response.data.echoAction
      : '';
    const detail: BridgeResponse = createErrorResponse(
      response.requestId,
      action,
      ERROR_CODE_CALLBACK_LOST,
      'CALLBACK_LOST: callback not found'
    );
    detail.data = { echoAction: action, nativeResponse: response };

    console.warn('[myascf] CALLBACK_LOST:', detail);
    this.debugAdapter.record('recordLost', {
      requestId: detail.requestId,
      action,
      status: 'callback_lost',
      code: detail.code,
      message: detail.message,
      response: detail,
      endTime: Date.now()
    });
    if (typeof this.targetWindow.__myascf_on_callback_lost__ === 'function') {
      this.targetWindow.__myascf_on_callback_lost__(detail);
    }
  }
}
