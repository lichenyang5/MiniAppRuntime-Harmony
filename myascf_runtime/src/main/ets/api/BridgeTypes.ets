export interface BridgeRequestParams {
  message?: string;
  text?: string;
  key?: string;
  value?: string;
  url?: string;
  method?: string;
  headers?: Object;
  body?: string;
  timeout?: number;
  responseType?: string;
}

export interface BridgeRequest {
  requestId: string;
  action: string;
  params?: BridgeRequestParams;
}

export interface ApiSummary {
  action: string;
  category: string;
  title: string;
  description: string;
  implemented: boolean;
  paramsText: string;
}

export interface BridgeResponseData {
  echoAction?: string;
  text?: string;
  key?: string;
  value?: string;
  apis?: ApiSummary[];
  statusCode?: number;
  headers?: Object;
  body?: string | Object;
  duration?: number;
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
