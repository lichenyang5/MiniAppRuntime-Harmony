import { webview } from '@kit.ArkWeb';
import { BridgeController } from '../runtime/bridge/BridgeController';
import { JavaScriptProxy } from '../runtime/bridge/JavaScriptProxy';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private bridgeController: BridgeController = new BridgeController(this.controller);
  private nativeProxy: JavaScriptProxy = new JavaScriptProxy(this.bridgeController);

  build() {
    Column() {
      Web({ src: $rawfile('web/index.html'), controller: this.controller })
        .javaScriptProxy({
          object: this.nativeProxy,
          name: 'MyASCFNative',
          methodList: ['postMessage'],
          controller: this.controller
        })
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
