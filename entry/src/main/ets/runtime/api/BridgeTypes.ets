export interface BridgeRequestParams {
  message?: string;
}

export interface BridgeRequest {
  requestId: string;
  action: string;
  params?: BridgeRequestParams;
}

export interface BridgeResponseData {
  echoAction?: string;
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
