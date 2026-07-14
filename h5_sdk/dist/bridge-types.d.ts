import type { ApiAction, TypedBridgeResponse, TypedSendArgs } from './generated/api-types.js';
export interface MyASCFSendOptions {
    timeout?: number;
}
export interface CreateMyASCFOptions {
    targetWindow?: Window;
}
export interface BridgeRequestParams {
    message?: string;
    text?: string;
    key?: string;
    value?: string;
    [key: string]: unknown;
}
export interface BridgeRequest {
    requestId: string;
    action: string;
    params: BridgeRequestParams;
}
export interface ApiSummary {
    action: string;
    category: string;
    title: string;
    description: string;
    implemented: boolean;
    paramsText?: string;
}
export interface BridgeResponseData {
    echoAction?: string;
    text?: string;
    key?: string;
    value?: string;
    apis?: ApiSummary[];
    [key: string]: unknown;
}
export interface BridgeResponse {
    requestId: string;
    code: number;
    message: string;
    data?: BridgeResponseData;
    action?: string;
    duration?: number;
}
export interface MyASCF {
    send(action: string, params?: BridgeRequestParams, options?: MyASCFSendOptions): Promise<BridgeResponse>;
    sendTyped<T extends ApiAction>(action: T, ...args: TypedSendArgs<T>): Promise<TypedBridgeResponse<T>>;
    handleNativeResponse(response: string | BridgeResponse): void;
}
export interface NativeBridge {
    postMessage(message: string): void;
}
export interface CallbackRecord {
    resolve(response: BridgeResponse): void;
    reject(response: BridgeResponse): void;
    timer: number;
    action: string;
    params: BridgeRequestParams;
    createdAt: number;
}
export interface DebugRecord {
    requestId: string;
    action: string;
    status: string;
    code?: number;
    message?: string;
    params?: BridgeRequestParams;
    response?: unknown;
    startTime?: number;
    endTime?: number;
    duration?: number;
}
export interface DebugPanel {
    recordStart?(record: DebugRecord): void;
    recordEnd?(record: DebugRecord): void;
    recordError?(record: DebugRecord): void;
    recordLost?(record: DebugRecord): void;
}
declare global {
    interface Window {
        myascf?: MyASCF;
        MyASCFNative?: NativeBridge;
        MyASCFDebugPanel?: DebugPanel;
        __myascf_on_native_response__?: (response: string | BridgeResponse) => void;
        __myascf_on_callback_lost__?: (response: BridgeResponse) => void;
    }
}
