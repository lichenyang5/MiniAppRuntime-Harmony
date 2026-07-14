declare namespace MyASCFWebSDK {
    interface MyASCFSendOptions {
        timeout?: number;
    }
    interface BridgeRequestParams {
        message?: string;
        text?: string;
        key?: string;
        value?: string;
        [key: string]: unknown;
    }
    interface BridgeRequest {
        requestId: string;
        action: string;
        params: BridgeRequestParams;
    }
    interface ApiSummary {
        action: string;
        category: string;
        title: string;
        description: string;
        implemented: boolean;
        paramsText?: string;
    }
    interface BridgeResponseData {
        echoAction?: string;
        text?: string;
        key?: string;
        value?: string;
        apis?: ApiSummary[];
        [key: string]: unknown;
    }
    interface BridgeResponse {
        requestId: string;
        code: number;
        message: string;
        data?: BridgeResponseData;
        action?: string;
        duration?: number;
    }
    interface MyASCF {
        send(action: string, params?: BridgeRequestParams, options?: MyASCFSendOptions): Promise<BridgeResponse>;
    }
    interface NativeBridge {
        postMessage(message: string): void;
    }
    interface CallbackRecord {
        resolve(response: BridgeResponse): void;
        reject(response: BridgeResponse): void;
        timer: number;
        action: string;
        params: BridgeRequestParams;
        createdAt: number;
    }
    interface DebugRecord {
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
    interface DebugPanel {
        recordStart?(record: DebugRecord): void;
        recordEnd?(record: DebugRecord): void;
        recordError?(record: DebugRecord): void;
        recordLost?(record: DebugRecord): void;
    }
}
interface Window {
    myascf?: MyASCFWebSDK.MyASCF;
    MyASCFNative?: MyASCFWebSDK.NativeBridge;
    MyASCFDebugPanel?: MyASCFWebSDK.DebugPanel;
    __myascf_on_native_response__?: (response: string | MyASCFWebSDK.BridgeResponse) => void;
    __myascf_on_callback_lost__?: (response: MyASCFWebSDK.BridgeResponse) => void;
}
declare namespace MyASCFWebSDK {
    const ERROR_CODE_SUCCESS: number;
    const ERROR_CODE_CALLBACK_LOST: number;
    const ERROR_CODE_TIMEOUT: number;
    const ERROR_CODE_NATIVE_UNAVAILABLE: number;
    const ERROR_CODE_INVALID_RESPONSE: number;
    const DEFAULT_TIMEOUT: number;
}
declare namespace MyASCFWebSDK {
    function createRequestId(): string;
}
declare namespace MyASCFWebSDK {
    class CallbackStore {
        private readonly callbacks;
        set(requestId: string, callback: CallbackRecord): void;
        get(requestId: string): CallbackRecord | undefined;
        take(requestId: string): CallbackRecord | undefined;
        delete(requestId: string): boolean;
    }
}
declare namespace MyASCFWebSDK {
    class NativeBridgeError extends Error {
        readonly code: number;
        constructor(code: number, message: string);
    }
    class NativeAdapter {
        postMessage(request: BridgeRequest): void;
    }
}
declare namespace MyASCFWebSDK {
    class MyASCFClient implements MyASCF {
        private readonly callbacks;
        private readonly nativeAdapter;
        send(action: string, params?: BridgeRequestParams, options?: MyASCFSendOptions): Promise<BridgeResponse>;
        handleNativeResponse(responseInput: string | BridgeResponse): void;
        private handleInvalidResponse;
        private emitCallbackLost;
    }
    function initMyASCF(): MyASCF;
}
