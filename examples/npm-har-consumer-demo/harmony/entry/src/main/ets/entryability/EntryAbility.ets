import { abilityAccessCtrl, Permissions, UIAbility } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';
import { hilog } from '@kit.PerformanceAnalysisKit';

const LOG_DOMAIN: number = 0x1200;
const LOG_TAG: string = 'MyASCFDemo';
const READ_PASTEBOARD_PERMISSION: Permissions = 'ohos.permission.READ_PASTEBOARD';

export default class EntryAbility extends UIAbility {
  private requestClipboardPermission(): void {
    try {
      abilityAccessCtrl.createAtManager()
        .requestPermissionsFromUser(this.context, [READ_PASTEBOARD_PERMISSION])
        .then(() => {
          hilog.info(LOG_DOMAIN, LOG_TAG, '%{public}s', '[ArkWeb] clipboard permission request completed');
        })
        .catch((error: Error) => {
          hilog.warn(LOG_DOMAIN, LOG_TAG, '%{public}s', `[ArkWeb] clipboard permission was not granted: ${error.message}`);
        });
    } catch (error) {
      const message: string = error instanceof Error ? error.message : String(error);
      hilog.warn(LOG_DOMAIN, LOG_TAG, '%{public}s', `[ArkWeb] clipboard permission request failed: ${message}`);
    }
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index');
    this.requestClipboardPermission();
  }
}
