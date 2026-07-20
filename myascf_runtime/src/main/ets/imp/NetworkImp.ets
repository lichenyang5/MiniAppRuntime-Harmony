import { BusinessError } from '@kit.BasicServicesKit';
import { http } from '@kit.NetworkKit';
import {
  NetworkImpError,
  NetworkImpErrorKind,
  NetworkMethod,
  NetworkResult,
  NormalizedNetworkRequest
} from '../types/NetworkTypes';
import { NetworkRequestHandle, NetworkRequestRegistry } from '../network/NetworkRequestRegistry';

const HTTP_TIMEOUT_ERROR_CODE: number = 2300028;

enum ActiveNetworkRequestState {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABORTED = 'aborted',
  TIMED_OUT = 'timed_out'
}

class ActiveNetworkRequest implements NetworkRequestHandle {
  private request: http.HttpRequest;
  private state: ActiveNetworkRequestState = ActiveNetworkRequestState.ACTIVE;
  private destroyed: boolean = false;
  private abortReject?: (reason?: Object) => void;
  private abortPromise: Promise<http.HttpResponse>;

  constructor(request: http.HttpRequest) {
    this.request = request;
    this.abortPromise = new Promise<http.HttpResponse>((resolve, reject) => {
      this.abortReject = reject;
    });
  }

  getAbortPromise(): Promise<http.HttpResponse> {
    return this.abortPromise;
  }

  complete(): boolean {
    if (this.state !== ActiveNetworkRequestState.ACTIVE) {
      return false;
    }
    this.state = ActiveNetworkRequestState.COMPLETED;
    this.abortReject = undefined;
    return true;
  }

  timeout(): boolean {
    if (this.state !== ActiveNetworkRequestState.ACTIVE) {
      return false;
    }
    this.state = ActiveNetworkRequestState.TIMED_OUT;
    this.abortReject = undefined;
    this.destroy();
    return true;
  }

  abort(): boolean {
    if (this.state !== ActiveNetworkRequestState.ACTIVE) {
      return false;
    }
    this.state = ActiveNetworkRequestState.ABORTED;
    const reject: ((reason?: Object) => void) | undefined = this.abortReject;
    this.abortReject = undefined;
    this.destroy();
    if (reject !== undefined) {
      reject(new NetworkImpError(NetworkImpErrorKind.ABORTED, 'Network request was aborted.'));
    }
    return true;
  }

  isAborted(): boolean {
    return this.state === ActiveNetworkRequestState.ABORTED;
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.request.destroy();
  }
}

export class NetworkImp {
  private registry: NetworkRequestRegistry;

  constructor(registry: NetworkRequestRegistry) {
    this.registry = registry;
  }

  async request(requestId: string, params: NormalizedNetworkRequest): Promise<NetworkResult> {
    const request: http.HttpRequest = http.createHttp();
    const activeRequest: ActiveNetworkRequest = new ActiveNetworkRequest(request);
    const startedAt: number = Date.now();
    let timeoutTimer: number = -1;
    const options: http.HttpRequestOptions = {
      method: this.toRequestMethod(params.method),
      header: params.headers,
      readTimeout: params.timeout,
      connectTimeout: params.timeout,
      expectDataType: http.HttpDataType.STRING,
      maxRedirects: 0
    };
    if (params.method !== NetworkMethod.GET && params.body !== undefined) {
      options.extraData = params.body;
    }

    if (!this.registry.register(requestId, activeRequest)) {
      activeRequest.destroy();
      throw new NetworkImpError(NetworkImpErrorKind.REQUEST_FAILED, 'Duplicate active requestId.');
    }

    try {
      const timeoutPromise: Promise<http.HttpResponse> = new Promise<http.HttpResponse>((resolve, reject) => {
        timeoutTimer = setTimeout(() => {
          if (activeRequest.timeout()) {
            reject(new NetworkImpError(NetworkImpErrorKind.TIMEOUT, 'Network request timed out.'));
          }
        }, params.timeout);
      });
      const requestPromise: Promise<http.HttpResponse> = request.request(params.url, options)
        .then((response: http.HttpResponse) => {
          if (!activeRequest.complete()) {
            if (activeRequest.isAborted()) {
              throw new NetworkImpError(NetworkImpErrorKind.ABORTED, 'Network request was aborted.');
            }
            throw new NetworkImpError(NetworkImpErrorKind.TIMEOUT, 'Network request timed out.');
          }
          return response;
        })
        .catch((error: Error) => {
          if (activeRequest.isAborted()) {
            throw new NetworkImpError(NetworkImpErrorKind.ABORTED, 'Network request was aborted.');
          }
          activeRequest.complete();
          throw error;
        });
      const response: http.HttpResponse = await Promise.race<http.HttpResponse>([
        requestPromise,
        timeoutPromise,
        activeRequest.getAbortPromise()
      ]);
      if (typeof response.result !== 'string') {
        throw new NetworkImpError(
          NetworkImpErrorKind.INVALID_RESPONSE,
          'Network response body is not a string.'
        );
      }
      return new NetworkResult(
        Number(response.responseCode),
        response.header,
        response.result,
        Date.now() - startedAt
      );
    } catch (error) {
      if (error instanceof NetworkImpError) {
        throw error;
      }
      const businessError: BusinessError = error as BusinessError;
      if (businessError.code === HTTP_TIMEOUT_ERROR_CODE) {
        throw new NetworkImpError(NetworkImpErrorKind.TIMEOUT, 'Network request timed out.');
      }
      throw new NetworkImpError(
        NetworkImpErrorKind.REQUEST_FAILED,
        `Network request failed with native code ${businessError.code}.`
      );
    } finally {
      if (timeoutTimer >= 0) {
        clearTimeout(timeoutTimer);
      }
      this.registry.remove(requestId, activeRequest);
      activeRequest.destroy();
    }
  }

  private toRequestMethod(method: NetworkMethod): http.RequestMethod {
    if (method === NetworkMethod.POST) {
      return http.RequestMethod.POST;
    }
    if (method === NetworkMethod.PUT) {
      return http.RequestMethod.PUT;
    }
    if (method === NetworkMethod.DELETE) {
      return http.RequestMethod.DELETE;
    }
    return http.RequestMethod.GET;
  }
}
