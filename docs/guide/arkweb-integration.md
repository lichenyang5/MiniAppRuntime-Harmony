# ArkWeb 接入 Runtime

你将学会什么：创建 `WebviewController`、初始化 `MyASCFRuntime`、注册 JavaScriptProxy 并加载 rawfile H5。

```ets
import { webview } from '@kit.ArkWeb';
import { MyASCFRuntime } from 'myascf_runtime';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));

  build() {
    Column() {
      Web({ src: $rawfile('web/index.html'), controller: this.controller })
        .javaScriptAccess(true)
        .javaScriptProxy({
          object: this.runtime.getNativeProxy(),
          name: this.runtime.getProxyName(),
          methodList: this.runtime.getMethodList(),
          controller: this.controller
        })
        .width('100%')
        .height('100%');
    }
  }
}
```

构造函数真实签名是：

```ets
new MyASCFRuntime(controller, context, networkPolicy?)
```

Proxy 名称为 `MyASCFNative`，公开方法列表为 `['postMessage']`。本地页面放在 `entry/src/main/resources/rawfile/web/`，入口使用 `$rawfile('web/index.html')`。

## 下一步阅读

- [JavaScriptProxy 原理](../concepts/javascript-proxy.md)
- [调试](debugging.md)
