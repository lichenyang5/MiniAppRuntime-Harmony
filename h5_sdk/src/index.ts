import type { CreateMyASCFOptions, MyASCF } from './bridge-types.js';
import { MyASCFClient } from './client.js';

export type {
  ApiSummary,
  BridgeRequest,
  BridgeRequestParams,
  BridgeResponse,
  BridgeResponseData,
  CreateMyASCFOptions,
  DebugPanel,
  DebugRecord,
  MyASCF,
  MyASCFSendOptions,
  NativeBridge
} from './bridge-types.js';
export {
  ERROR_CODE_CALLBACK_LOST,
  ERROR_CODE_INVALID_RESPONSE,
  ERROR_CODE_NATIVE_UNAVAILABLE,
  ERROR_CODE_SUCCESS,
  ERROR_CODE_TIMEOUT
} from './error-code.js';
export type {
  ApiAction,
  ApiParamsMap,
  ApiResponseDataMap,
  NetworkBody,
  NetworkHeaders,
  NetworkMethod,
  NetworkResponseType,
  TypedBridgeResponse,
  TypedSendArgs
} from './generated/api-types.js';
export {
  createTypedApi,
  type TypedApi
} from './generated/api-client.js';

function resolveTargetWindow(options?: CreateMyASCFOptions): Window {
  const targetWindow: Window | undefined = options?.targetWindow ??
    (typeof window === 'undefined' ? undefined : window);
  if (!targetWindow) {
    throw new Error('Window is unavailable. Pass options.targetWindow in this environment.');
  }
  return targetWindow;
}

export function createMyASCF(options?: CreateMyASCFOptions): MyASCF {
  return new MyASCFClient(resolveTargetWindow(options));
}

export function initMyASCF(options?: CreateMyASCFOptions): MyASCF {
  const targetWindow: Window = resolveTargetWindow(options);
  const client: MyASCFClient = new MyASCFClient(targetWindow);
  targetWindow.myascf = client;
  targetWindow.__myascf_on_native_response__ = (
    response
  ): void => client.handleNativeResponse(response);
  return client;
}
