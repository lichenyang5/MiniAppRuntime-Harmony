import { url } from '@kit.ArkTS';
import { ACTION_NETWORK_REQUEST } from '../api/ActionNames';
import { BridgeRequest, BridgeRequestParams, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { NetworkImp } from '../imp/NetworkImp';
import {
  NetworkImpError,
  NetworkImpErrorKind,
  NetworkMethod,
  NetworkPolicy,
  NetworkResponseType,
  NetworkResult,
  NormalizedNetworkRequest
} from '../types/NetworkTypes';

const DEFAULT_TIMEOUT: number = 10000;
const MIN_TIMEOUT: number = 1000;
const MAX_TIMEOUT: number = 30000;

export class NetworkValidationResult {
  request?: NormalizedNetworkRequest;
  code: BridgeErrorCode;
  message: string;

  constructor(code: BridgeErrorCode, message: string, request?: NormalizedNetworkRequest) {
    this.code = code;
    this.message = message;
    this.request = request;
  }
}

export class NetworkRequestValidator {
  private policy: NetworkPolicy;

  constructor(policy?: NetworkPolicy) {
    this.policy = policy === undefined ? {} : policy;
  }

  validate(params?: BridgeRequestParams): NetworkValidationResult {
    if (params === undefined || typeof params.url !== 'string' || params.url.trim().length === 0) {
      return new NetworkValidationResult(BridgeErrorCode.PARAM_ERROR, 'PARAM_ERROR: url is required');
    }

    const requestUrl: string = params.url.trim();
    let parsedUrl: url.URL;
    try {
      parsedUrl = url.URL.parseURL(requestUrl);
    } catch (error) {
      return new NetworkValidationResult(
        BridgeErrorCode.NETWORK_INVALID_URL,
        'NETWORK_INVALID_URL: url cannot be parsed'
      );
    }

    const protocol: string = parsedUrl.protocol.replace(':', '').toLowerCase();
    if (!this.isProtocolAllowed(protocol)) {
      return new NetworkValidationResult(
        BridgeErrorCode.NETWORK_UNSUPPORTED_PROTOCOL,
        `NETWORK_UNSUPPORTED_PROTOCOL: ${protocol}`
      );
    }
    if (parsedUrl.username.length > 0 || parsedUrl.password.length > 0) {
      return new NetworkValidationResult(
        BridgeErrorCode.NETWORK_INVALID_URL,
        'NETWORK_INVALID_URL: URL credentials are not allowed'
      );
    }
    if (parsedUrl.hostname.length === 0 || !this.isHostAllowed(parsedUrl.hostname.toLowerCase())) {
      return new NetworkValidationResult(
        BridgeErrorCode.NETWORK_INVALID_URL,
        'NETWORK_INVALID_URL: host is not allowed by NetworkPolicy'
      );
    }

    const method: NetworkMethod | undefined = this.parseMethod(params.method);
    if (method === undefined) {
      return new NetworkValidationResult(BridgeErrorCode.PARAM_ERROR, 'PARAM_ERROR: unsupported method');
    }
    if (!this.hasStringHeaderValues(params.headers)) {
      return new NetworkValidationResult(BridgeErrorCode.PARAM_ERROR, 'PARAM_ERROR: headers must contain strings');
    }
    const timeout: number = params.timeout === undefined ? DEFAULT_TIMEOUT : params.timeout;
    if (!Number.isInteger(timeout) || timeout < MIN_TIMEOUT || timeout > MAX_TIMEOUT) {
      return new NetworkValidationResult(
        BridgeErrorCode.PARAM_ERROR,
        `PARAM_ERROR: timeout must be between ${MIN_TIMEOUT} and ${MAX_TIMEOUT}`
      );
    }
    const responseType: NetworkResponseType | undefined = this.parseResponseType(params.responseType);
    if (responseType === undefined) {
      return new NetworkValidationResult(BridgeErrorCode.PARAM_ERROR, 'PARAM_ERROR: responseType is invalid');
    }
    if (params.body !== undefined && typeof params.body !== 'string') {
      return new NetworkValidationResult(BridgeErrorCode.PARAM_ERROR, 'PARAM_ERROR: body must be a string');
    }

    const body: string | undefined = method === NetworkMethod.GET ? undefined : params.body;
    const normalized: NormalizedNetworkRequest = new NormalizedNetworkRequest(
      requestUrl,
      method,
      timeout,
      responseType,
      params.headers,
      body
    );
    return new NetworkValidationResult(BridgeErrorCode.SUCCESS, 'success', normalized);
  }

  private parseMethod(value?: string): NetworkMethod | undefined {
    if (value !== undefined && typeof value !== 'string') {
      return undefined;
    }
    if (value === undefined || value.toUpperCase() === NetworkMethod.GET) {
      return NetworkMethod.GET;
    }
    const normalized: string = value.toUpperCase();
    if (normalized === NetworkMethod.POST) {
      return NetworkMethod.POST;
    }
    if (normalized === NetworkMethod.PUT) {
      return NetworkMethod.PUT;
    }
    if (normalized === NetworkMethod.DELETE) {
      return NetworkMethod.DELETE;
    }
    return undefined;
  }

  private parseResponseType(value?: string): NetworkResponseType | undefined {
    if (value !== undefined && typeof value !== 'string') {
      return undefined;
    }
    if (value === undefined || value === NetworkResponseType.TEXT) {
      return NetworkResponseType.TEXT;
    }
    if (value === NetworkResponseType.JSON) {
      return NetworkResponseType.JSON;
    }
    return undefined;
  }

  private hasStringHeaderValues(headers?: Object): boolean {
    if (headers === undefined) {
      return true;
    }
    if (headers === null || typeof headers !== 'object' || Array.isArray(headers)) {
      return false;
    }
    const headerMap: Record<string, Object> = headers as Record<string, Object>;
    const names: string[] = Object.keys(headers);
    for (let index: number = 0; index < names.length; index++) {
      const name: string = names[index];
      const value: Object = headerMap[name];
      if (name.trim().length === 0 || name.includes('\r') || name.includes('\n')) {
        return false;
      }
      if (typeof value !== 'string') {
        return false;
      }
      const stringValue: string = value as string;
      if (stringValue.includes('\r') || stringValue.includes('\n')) {
        return false;
      }
    }
    return true;
  }

  private isProtocolAllowed(protocol: string): boolean {
    const configured: string[] = this.policy.allowedProtocols === undefined
      ? ['http', 'https']
      : this.policy.allowedProtocols;
    return configured.map((item: string) => item.replace(':', '').toLowerCase()).includes(protocol);
  }

  private isHostAllowed(hostname: string): boolean {
    const allowedHosts: string[] | undefined = this.policy.allowedHosts;
    if (allowedHosts === undefined || allowedHosts.length === 0) {
      return true;
    }
    return allowedHosts.map((item: string) => item.toLowerCase()).includes(hostname);
  }
}

export class NetworkBiz {
  private networkImp: NetworkImp;
  private validator: NetworkRequestValidator;

  constructor(networkImp: NetworkImp, policy?: NetworkPolicy) {
    this.networkImp = networkImp;
    this.validator = new NetworkRequestValidator(policy);
  }

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    const validation: NetworkValidationResult = this.validator.validate(request.params);
    if (validation.request === undefined) {
      return this.createErrorResponse(request.requestId, validation.code, validation.message);
    }

    try {
      const result: NetworkResult = await this.networkImp.request(validation.request);
      const body: string | Object | undefined = this.parseBody(result.bodyText, validation.request.responseType);
      if (body === undefined) {
        return this.createErrorResponse(
          request.requestId,
          BridgeErrorCode.NETWORK_INVALID_RESPONSE,
          'NETWORK_INVALID_RESPONSE: response body is not valid JSON'
        );
      }
      const data: BridgeResponseData = {
        echoAction: ACTION_NETWORK_REQUEST,
        statusCode: result.statusCode,
        headers: result.headers,
        body: body,
        duration: result.duration
      };
      const response: BridgeResponse = {
        requestId: request.requestId,
        code: BridgeErrorCode.SUCCESS,
        message: 'network request success',
        data: data
      };
      return response;
    } catch (error) {
      if (error instanceof NetworkImpError) {
        return this.createImpErrorResponse(request.requestId, error);
      }
      return this.createErrorResponse(
        request.requestId,
        BridgeErrorCode.NETWORK_REQUEST_FAILED,
        'NETWORK_REQUEST_FAILED: unexpected network error'
      );
    }
  }

  private parseBody(bodyText: string, responseType: NetworkResponseType): string | Object | undefined {
    if (responseType === NetworkResponseType.TEXT) {
      return bodyText;
    }
    try {
      const parsed: Object = JSON.parse(bodyText) as Object;
      if (parsed === null || typeof parsed !== 'object') {
        return undefined;
      }
      return parsed;
    } catch (error) {
      return undefined;
    }
  }

  private createImpErrorResponse(requestId: string, error: NetworkImpError): BridgeResponse {
    if (error.kind === NetworkImpErrorKind.TIMEOUT) {
      return this.createErrorResponse(requestId, BridgeErrorCode.NETWORK_TIMEOUT, 'NETWORK_TIMEOUT: request timed out');
    }
    if (error.kind === NetworkImpErrorKind.INVALID_RESPONSE) {
      return this.createErrorResponse(
        requestId,
        BridgeErrorCode.NETWORK_INVALID_RESPONSE,
        'NETWORK_INVALID_RESPONSE: invalid native response'
      );
    }
    return this.createErrorResponse(
      requestId,
      BridgeErrorCode.NETWORK_REQUEST_FAILED,
      'NETWORK_REQUEST_FAILED: native request failed'
    );
  }

  private createErrorResponse(requestId: string, code: BridgeErrorCode, message: string): BridgeResponse {
    const data: BridgeResponseData = { echoAction: ACTION_NETWORK_REQUEST };
    const response: BridgeResponse = { requestId: requestId, code: code, message: message, data: data };
    return response;
  }
}
