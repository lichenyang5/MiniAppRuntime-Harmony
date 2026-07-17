import type { CreateMyASCFOptions, MyASCF } from './bridge-types.js';
export type { ApiSummary, BridgeRequest, BridgeRequestParams, BridgeResponse, BridgeResponseData, CreateMyASCFOptions, DebugPanel, DebugRecord, MyASCF, MyASCFSendOptions, NativeBridge } from './bridge-types.js';
export { ERROR_CODE_CALLBACK_LOST, ERROR_CODE_INVALID_RESPONSE, ERROR_CODE_NATIVE_UNAVAILABLE, ERROR_CODE_SUCCESS, ERROR_CODE_TIMEOUT } from './error-code.js';
export type { ApiAction, ApiParamsMap, ApiResponseDataMap, NetworkBody, NetworkHeaders, NetworkMethod, NetworkResponseType, TypedBridgeResponse, TypedSendArgs } from './generated/api-types.js';
export { createTypedApi, type TypedApi } from './generated/api-client.js';
export declare function createMyASCF(options?: CreateMyASCFOptions): MyASCF;
export declare function initMyASCF(options?: CreateMyASCFOptions): MyASCF;
