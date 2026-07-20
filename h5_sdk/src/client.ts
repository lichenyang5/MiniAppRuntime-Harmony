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
import { CancelledRequestStore } from './cancelled-request-store.js';
import { MyASCFAbortError } from './abort-error.js';
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

const ACTION_NETWORK_REQUEST: string = 'network.request';
const ACTION_NETWORK_ABORT: string = 'network.abort';
const ABORT_ACTION_TIMEOUT: number = 3000;

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
  private readonly cancelledRequests: CancelledRequestStore = new CancelledRequestStore();
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
      let posted: boolean = false;

      this.debugAdapter.record('recordStart', {
        requestId: request.requestId,
        action,
        status: 'pending',
        params,
        startTime: createdAt
      });

      const timer: number = this.targetWindow.setTimeout(() => {
        const callback: CallbackRecord | undefined = this.callbacks.take(request.requestId);
        if (!callback) {
          return;
        }
        this.cleanupCallback(callback);
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

      const callbackRecord: CallbackRecord = {
        resolve,
        reject,
        timer,
        action,
        params,
        createdAt
      };
      this.callbacks.set(request.requestId, callbackRecord);

      const signal: AbortSignal | undefined = options?.signal;
      const handleAbort = (): void => {
        const callback: CallbackRecord | undefined = this.callbacks.take(request.requestId);
        if (!callback) {
          return;
        }
        this.cleanupCallback(callback);
        const abortError: MyASCFAbortError = new MyASCFAbortError(request.requestId);
        const abortTime: number = Date.now();
        this.debugAdapter.record('recordAbort', {
          requestId: request.requestId,
          action,
          status: 'cancelled',
          code: abortError.code,
          message: abortError.message,
          params,
          response: {
            requestId: request.requestId,
            action,
            code: abortError.code,
            message: abortError.message
          },
          endTime: abortTime,
          abortTime,
          duration: abortTime - createdAt
        });
        callback.reject(abortError);
        if (posted) {
          this.cancelledRequests.add(request.requestId, abortTime);
          if (action === ACTION_NETWORK_REQUEST) {
            this.requestNativeAbort(request.requestId);
          }
        }
      };

      if (signal) {
        signal.addEventListener('abort', handleAbort, { once: true });
        callbackRecord.removeAbortListener = () => {
          signal.removeEventListener('abort', handleAbort);
        };
        if (signal.aborted) {
          handleAbort();
          return;
        }
      }

      try {
        console.log('[myascf] send request:', request.requestId, request.action);
        posted = true;
        this.nativeAdapter.postMessage(request);
      } catch (error) {
        posted = false;
        const callback: CallbackRecord | undefined = this.callbacks.take(request.requestId);
        if (callback) {
          this.cleanupCallback(callback);
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
    console.log('[myascf] native response received');

    let response: BridgeResponse;
    try {
      response = parseResponse(responseInput);
    } catch (error) {
      this.handleInvalidResponse(responseInput, error);
      return;
    }

    const callback: CallbackRecord | undefined = this.callbacks.take(response.requestId);
    if (!callback) {
      if (this.cancelledRequests.consume(response.requestId)) {
        this.recordLateAfterAbort(response);
        return;
      }
      this.emitCallbackLost(response);
      return;
    }

    this.cleanupCallback(callback);
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
    if (requestId && this.cancelledRequests.consume(requestId)) {
      this.recordLateAfterAbort(responseInput);
      return;
    }
    const callback: CallbackRecord | undefined = requestId
      ? this.callbacks.take(requestId)
      : undefined;
    if (callback) {
      this.cleanupCallback(callback);
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

    console.warn('[myascf] CALLBACK_LOST:', detail.requestId, detail.action, detail.code);
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

  private cleanupCallback(callback: CallbackRecord): void {
    this.targetWindow.clearTimeout(callback.timer);
    if (callback.removeAbortListener) {
      callback.removeAbortListener();
      callback.removeAbortListener = undefined;
    }
  }

  private requestNativeAbort(targetRequestId: string): void {
    this.send(ACTION_NETWORK_ABORT, { targetRequestId }, { timeout: ABORT_ACTION_TIMEOUT })
      .catch((error: unknown) => {
        console.warn('[myascf] network.abort failed:', error);
      });
  }

  private recordLateAfterAbort(responseInput: string | BridgeResponse): void {
    const requestId: string = extractRequestId(responseInput);
    let action: string = ACTION_NETWORK_REQUEST;
    if (typeof responseInput !== 'string' && responseInput.data &&
      typeof responseInput.data.echoAction === 'string') {
      action = responseInput.data.echoAction;
    }
    this.debugAdapter.record('recordLateAfterAbort', {
      requestId,
      action,
      status: 'late_after_abort',
      code: 'ABORTED',
      message: 'LATE_RESPONSE_AFTER_ABORT',
      response: { requestId, ignored: true },
      endTime: Date.now()
    });
  }
}
