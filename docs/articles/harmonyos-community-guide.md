# HarmonyOS ArkWeb JSBridge 实践：使用 npm H5 SDK 与 OHPM HAR 构建 Web 容器

## 你将学会什么

在 Stage Model 工程中安装 Runtime、配置 ArkWeb、注入 JavaScriptProxy 并验证 H5 Promise 回调。

## 摘要

本文从一个 Stage Model Demo 出发，完成 OHPM HAR 安装、WebviewController、JavaScriptProxy、rawfile H5、权限和 `runJavaScript` 回调接入。

**适合读者：**HarmonyOS、ArkTS、ArkWeb 开发者。

## 正文目录

1. 安装 H5 SDK 与 HAR
2. 准备 rawfile
3. module.json5 权限
4. ArkTS 完整接入
5. 验证与排障

## 1. 安装

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
ohpm install myascf_runtime@1.0.0
```

`entry/oh-package.json5`：

```json5
{
  "dependencies": {
    "myascf_runtime": "1.0.0"
  }
}
```

## 2. 准备 rawfile

Vite 使用 `base: './'`，构建后把 dist 同步到：

```text
entry/src/main/resources/rawfile/web/
```

ArkWeb 入口为 `$rawfile('web/index.html')`。

## 3. 权限

```json5
"requestPermissions": [
  { "name": "ohos.permission.INTERNET" },
  {
    "name": "ohos.permission.READ_PASTEBOARD",
    "reason": "$string:pasteboard_reason",
    "usedScene": { "abilities": ["EntryAbility"], "when": "inuse" }
  }
]
```

声明权限后仍要请求用户授权，单独修改 `module.json5` 不能保证 Clipboard Read 成功：

```ets
import { abilityAccessCtrl, Permissions, UIAbility } from '@kit.AbilityKit';

const READ_PASTEBOARD_PERMISSION: Permissions = 'ohos.permission.READ_PASTEBOARD';

export default class EntryAbility extends UIAbility {
  requestClipboardPermission(): void {
    abilityAccessCtrl.createAtManager()
      .requestPermissionsFromUser(this.context, [READ_PASTEBOARD_PERMISSION])
      .catch((error: Error) => console.error(error.message));
  }
}
```

正式应用建议在用户触发读取操作时申请，并明确处理拒绝；独立 Demo 在启动时申请是为了演示方便。

## 4. ArkTS 完整接入

```ets
import { webview } from '@kit.ArkWeb';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { MyASCFRuntime } from 'myascf_runtime';

const DOMAIN: number = 0x1200;
const TAG: string = 'MyASCFDemo';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));

  private diagnose(): void {
    this.controller.runJavaScript(`JSON.stringify({
      myascfType: typeof window.myascf,
      nativeType: typeof window.MyASCFNative,
      postMessageType: typeof window.MyASCFNative?.postMessage,
      callbackType: typeof window.__myascf_on_native_response__
    })`).then((result: string) => {
      hilog.info(DOMAIN, TAG, '%{public}s', result);
    }).catch((error: Error) => {
      hilog.error(DOMAIN, TAG, '%{public}s', error.message);
    });
  }

  build() {
    Web({ src: $rawfile('web/index.html'), controller: this.controller })
      .javaScriptAccess(true)
      .javaScriptProxy({
        object: this.runtime.getNativeProxy(),
        name: this.runtime.getProxyName(),
        methodList: this.runtime.getMethodList(),
        controller: this.controller
      })
      .onPageEnd(() => this.diagnose())
      .width('100%')
      .height('100%');
  }
}
```

H5 初始化：

```ts
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';
const api = createTypedApi(initMyASCF());
await api.runtime.getApiList();
```

## 5. 验证

在 DevEco Studio 执行 Sync、Clean、Rebuild、Run。依次验证四个全局对象、Toast、Storage、Clipboard、Network 和 DebugPanel。Clipboard 读取按系统权限流程授权。

项目地址：[MiniAppRuntime-Harmony](https://github.com/lichenyang5/MiniAppRuntime-Harmony)

完整代码：`examples/npm-har-consumer-demo/`

## 已知边界

`getContext` 和部分系统 API 在不同 SDK 版本可能产生弃用或异常处理 warning，应以目标 SDK 文档为准。项目是个人开源实践，不宣称生产级。

## 总结

HAR 门面把 ArkWeb 需要的 Proxy 对象、名称和 methodList 集中起来，使宿主页面只负责容器生命周期和权限。

## 下一步阅读

- [Quick Start](../getting-started/quick-start.md)
- [调试](../guide/debugging.md)
