import { webview } from '@kit.ArkWeb';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { MyASCFRuntime } from 'myascf_runtime';

const LOG_DOMAIN: number = 0x1200;
const LOG_TAG: string = 'MyASCFDemo';
const BRIDGE_DIAGNOSTIC_SCRIPT: string = `JSON.stringify({
  myascfType: typeof window.myascf,
  nativeType: typeof window.MyASCFNative,
  postMessageType: typeof window.MyASCFNative?.postMessage,
  callbackType: typeof window.__myascf_on_native_response__
})`;

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));

  private diagnoseBridge(): void {
    this.controller.runJavaScript(BRIDGE_DIAGNOSTIC_SCRIPT)
      .then((result: string) => {
        hilog.info(LOG_DOMAIN, LOG_TAG, '%{public}s', `[ArkWeb] bridge globals: ${result}`);
      })
      .catch((error: Error) => {
        hilog.error(LOG_DOMAIN, LOG_TAG, '%{public}s', `[ArkWeb] bridge diagnostics failed: ${error.message}`);
      });
  }

  build() {
    Column() {
      Web({
        src: $rawfile('web/index.html'),
        controller: this.controller
      })
        .javaScriptAccess(true)
        .javaScriptProxy({
          object: this.runtime.getNativeProxy(),
          name: this.runtime.getProxyName(),
          methodList: this.runtime.getMethodList(),
          controller: this.controller
        })
        .onPageEnd(() => {
          this.diagnoseBridge();
        })
        .width('100%')
        .height('100%');
    }
    .width('100%')
    .height('100%');
  }
}
