export enum NetworkMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum NetworkResponseType {
  TEXT = 'text',
  JSON = 'json'
}

export interface NetworkPolicy {
  allowedProtocols?: string[];
  allowedHosts?: string[];
  maxRequestBodyLogLength?: number;
  maxResponseBodyLogLength?: number;
}

export class NormalizedNetworkRequest {
  url: string;
  method: NetworkMethod;
  headers?: Object;
  body?: string;
  timeout: number;
  responseType: NetworkResponseType;

  constructor(url: string, method: NetworkMethod, timeout: number, responseType: NetworkResponseType,
    headers?: Object, body?: string) {
    this.url = url;
    this.method = method;
    this.timeout = timeout;
    this.responseType = responseType;
    this.headers = headers;
    this.body = body;
  }
}

export class NetworkResult {
  statusCode: number;
  headers: Object;
  bodyText: string;
  duration: number;

  constructor(statusCode: number, headers: Object, bodyText: string, duration: number) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.bodyText = bodyText;
    this.duration = duration;
  }
}

export enum NetworkImpErrorKind {
  TIMEOUT = 'timeout',
  REQUEST_FAILED = 'request_failed',
  INVALID_RESPONSE = 'invalid_response'
}

export class NetworkImpError extends Error {
  kind: NetworkImpErrorKind;

  constructor(kind: NetworkImpErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}
