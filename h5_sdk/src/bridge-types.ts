namespace MyASCFWebSDK {
  export interface MyASCFSendOptions {
    timeout?: number;
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
    send(
      action: string,
      params?: BridgeRequestParams,
      options?: MyASCFSendOptions
    ): Promise<BridgeResponse>;
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
}

interface Window {
  myascf?: MyASCFWebSDK.MyASCF;
  MyASCFNative?: MyASCFWebSDK.NativeBridge;
  MyASCFDebugPanel?: MyASCFWebSDK.DebugPanel;
  __myascf_on_native_response__?: (
    response: string | MyASCFWebSDK.BridgeResponse
  ) => void;
  __myascf_on_callback_lost__?: (
    response: MyASCFWebSDK.BridgeResponse
  ) => void;
}
