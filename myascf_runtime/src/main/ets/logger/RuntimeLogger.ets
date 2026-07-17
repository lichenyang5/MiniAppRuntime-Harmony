import { hilog } from '@kit.PerformanceAnalysisKit';
import { BridgeRequest, BridgeRequestParams } from '../api/BridgeTypes';

const DOMAIN = 0x1200;
const TAG = 'MyASCF';

export class RuntimeLogger {
  static info(message: string): void {
    hilog.info(DOMAIN, TAG, '%{public}s', message);
  }

  static warn(message: string): void {
    hilog.warn(DOMAIN, TAG, '%{public}s', message);
  }

  static error(message: string): void {
    hilog.error(DOMAIN, TAG, '%{public}s', message);
  }

  static logBridgeRequest(requestId: string, action: string): void {
    RuntimeLogger.info(`[BridgeRequest] requestId=${requestId}, action=${action}`);
  }

  static logBridgeParams(request: BridgeRequest): void {
    if (request.action !== 'network.request') {
      RuntimeLogger.info(`[BridgeController] params: ${JSON.stringify(request.params)}`);
      return;
    }
    const params: BridgeRequestParams | undefined = request.params;
    const safeUrl: string = RuntimeLogger.removeQueryAndFragment(params?.url === undefined ? '' : params.url);
    const headerNames: string[] = params?.headers === undefined ? [] : Object.keys(params.headers);
    const bodyLength: number = params?.body === undefined ? 0 : params.body.length;
    RuntimeLogger.info(
      `[BridgeController] network params: url=${safeUrl}, method=${params?.method}, ` +
      `timeout=${params?.timeout}, responseType=${params?.responseType}, ` +
      `headerNames=${headerNames.join(',')}, bodyLength=${bodyLength}`
    );
  }

  static logBridgeResponse(requestId: string, action: string, code: number): void {
    RuntimeLogger.info(`[BridgeResponse] requestId=${requestId}, action=${action}, code=${code}`);
  }

  static logBridgeError(requestId: string, action: string, code: number, message: string): void {
    RuntimeLogger.error(`[BridgeError] requestId=${requestId}, action=${action}, code=${code}, message=${message}`);
  }

  static logWebLoadBegin(url: string): void {
    RuntimeLogger.info(`[WebContainer] load begin: ${url}`);
  }

  static logWebLoadProgress(url: string, progress: number): void {
    RuntimeLogger.info(`[WebContainer] load progress: url=${url}, progress=${progress}`);
  }

  static logWebLoadEnd(url: string): void {
    RuntimeLogger.info(`[WebContainer] load end: ${url}`);
  }

  static logWebLoadError(url: string, message: string): void {
    RuntimeLogger.error(`[WebContainer] load error: url=${url}, message=${message}`);
  }

  static logWebUrlBlocked(url: string, reason: string): void {
    RuntimeLogger.warn(`[WebContainer] url blocked: url=${url}, reason=${reason}`);
  }

  private static removeQueryAndFragment(value: string): string {
    const schemeEnd: number = value.indexOf('://');
    const pathStart: number = schemeEnd < 0 ? -1 : value.indexOf('/', schemeEnd + 3);
    const authorityEnd: number = pathStart < 0 ? value.length : pathStart;
    const credentialEnd: number = schemeEnd < 0 ? -1 : value.lastIndexOf('@', authorityEnd);
    const withoutCredentials: string = credentialEnd > schemeEnd
      ? value.substring(0, schemeEnd + 3) + value.substring(credentialEnd + 1)
      : value;
    const queryIndex: number = withoutCredentials.indexOf('?');
    const fragmentIndex: number = withoutCredentials.indexOf('#');
    let endIndex: number = withoutCredentials.length;
    if (queryIndex >= 0 && queryIndex < endIndex) {
      endIndex = queryIndex;
    }
    if (fragmentIndex >= 0 && fragmentIndex < endIndex) {
      endIndex = fragmentIndex;
    }
    return withoutCredentials.substring(0, endIndex);
  }
}
