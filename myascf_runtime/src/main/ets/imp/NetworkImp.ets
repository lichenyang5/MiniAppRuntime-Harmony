import { BusinessError } from '@kit.BasicServicesKit';
import { http } from '@kit.NetworkKit';
import {
  NetworkImpError,
  NetworkImpErrorKind,
  NetworkMethod,
  NetworkResult,
  NormalizedNetworkRequest
} from '../types/NetworkTypes';

const HTTP_TIMEOUT_ERROR_CODE: number = 2300028;

export class NetworkImp {
  async request(params: NormalizedNetworkRequest): Promise<NetworkResult> {
    const request: http.HttpRequest = http.createHttp();
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

    try {
      const timeoutPromise: Promise<http.HttpResponse> = new Promise<http.HttpResponse>((resolve, reject) => {
        timeoutTimer = setTimeout(() => {
          reject(new NetworkImpError(NetworkImpErrorKind.TIMEOUT, 'Network request timed out.'));
        }, params.timeout);
      });
      const response: http.HttpResponse = await Promise.race<http.HttpResponse>([
        request.request(params.url, options),
        timeoutPromise
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
      request.destroy();
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
