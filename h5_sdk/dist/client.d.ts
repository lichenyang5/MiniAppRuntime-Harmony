import type { BridgeRequestParams, BridgeResponse, MyASCF, MyASCFSendOptions } from './bridge-types.js';
import type { ApiAction, TypedBridgeResponse, TypedSendArgs } from './generated/api-types.js';
export declare class MyASCFClient implements MyASCF {
    private readonly targetWindow;
    private readonly callbacks;
    private readonly cancelledRequests;
    private readonly nativeAdapter;
    private readonly debugAdapter;
    constructor(targetWindow: Window);
    send(action: string, params?: BridgeRequestParams, options?: MyASCFSendOptions): Promise<BridgeResponse>;
    sendTyped<T extends ApiAction>(action: T, ...args: TypedSendArgs<T>): Promise<TypedBridgeResponse<T>>;
    handleNativeResponse(responseInput: string | BridgeResponse): void;
    private handleInvalidResponse;
    private emitCallbackLost;
    private cleanupCallback;
    private requestNativeAbort;
    private recordLateAfterAbort;
}
