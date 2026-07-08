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
}
