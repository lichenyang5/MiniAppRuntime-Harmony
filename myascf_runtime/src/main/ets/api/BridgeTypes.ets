export interface BridgeRequestParams {
  message?: string;
  text?: string;
  key?: string;
  value?: string;
}

export interface BridgeRequest {
  requestId: string;
  action: string;
  params?: BridgeRequestParams;
}

export interface BridgeResponseData {
  echoAction?: string;
  text?: string;
  key?: string;
  value?: string;
}

export interface BridgeResponse {
  requestId: string;
  code: number;
  message: string;
  data?: BridgeResponseData;
}

export interface BridgeHandler {
  handle(request: BridgeRequest): Promise<BridgeResponse>;
}
