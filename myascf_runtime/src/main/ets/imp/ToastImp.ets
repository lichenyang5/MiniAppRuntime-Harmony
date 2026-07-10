import { promptAction } from '@kit.ArkUI';

export class ToastImp {
  async showToast(message: string): Promise<void> {
    promptAction.showToast({
      message: message,
      duration: 2000
    });
  }
}
