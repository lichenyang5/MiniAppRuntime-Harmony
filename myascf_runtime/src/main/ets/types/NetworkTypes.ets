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

export class NetworkHttpStatus {
  static isOk(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }

  static getStatusText(statusCode: number): string | undefined {
    if (statusCode === 200) { return 'OK'; }
    if (statusCode === 201) { return 'Created'; }
    if (statusCode === 202) { return 'Accepted'; }
    if (statusCode === 204) { return 'No Content'; }
    if (statusCode === 301) { return 'Moved Permanently'; }
    if (statusCode === 302) { return 'Found'; }
    if (statusCode === 304) { return 'Not Modified'; }
    if (statusCode === 400) { return 'Bad Request'; }
    if (statusCode === 401) { return 'Unauthorized'; }
    if (statusCode === 403) { return 'Forbidden'; }
    if (statusCode === 404) { return 'Not Found'; }
    if (statusCode === 405) { return 'Method Not Allowed'; }
    if (statusCode === 408) { return 'Request Timeout'; }
    if (statusCode === 409) { return 'Conflict'; }
    if (statusCode === 429) { return 'Too Many Requests'; }
    if (statusCode === 500) { return 'Internal Server Error'; }
    if (statusCode === 502) { return 'Bad Gateway'; }
    if (statusCode === 503) { return 'Service Unavailable'; }
    if (statusCode === 504) { return 'Gateway Timeout'; }
    return undefined;
  }
}

export enum NetworkImpErrorKind {
  TIMEOUT = 'timeout',
  REQUEST_FAILED = 'request_failed',
  INVALID_RESPONSE = 'invalid_response',
  ABORTED = 'aborted'
}

export class NetworkImpError extends Error {
  kind: NetworkImpErrorKind;

  constructor(kind: NetworkImpErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}
