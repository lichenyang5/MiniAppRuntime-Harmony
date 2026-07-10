import { hilog } from '@kit.PerformanceAnalysisKit';

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

  static logBridgeResponse(requestId: string, action: string, code: number): void {
    RuntimeLogger.info(`[BridgeResponse] requestId=${requestId}, action=${action}, code=${code}`);
  }

  static logBridgeError(requestId: string, action: string, code: number, message: string): void {
    RuntimeLogger.error(`[BridgeError] requestId=${requestId}, action=${action}, code=${code}, message=${message}`);
  }
}
