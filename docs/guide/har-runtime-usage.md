# HAR Runtime Usage

这篇文档解决什么问题：说明如何构建、复制、接入和升级 `myascf_runtime.har`。

## HAR 是什么

HAR 是 HarmonyOS 静态共享包。`myascf_runtime` 将 BridgeController、Dispatcher、Registry、Biz/Imp、Manifest 和回调执行器封装为一个可复用 ArkTS Runtime。

H5 JavaScript SDK 通过 npm 分发；HarmonyOS HAR 使用本地文件、GitHub Release，未来再准备 ohpm。不要把 HAR 当作正式 npm 包。

## 构建

```powershell
.\scripts\build-har.ps1
```

脚本调用仓库真实 Hvigor 工程，并在构建结束后递归定位最新 HAR。当前标准产物为：

```text
myascf_runtime/build/default/outputs/default/myascf_runtime.har
```

## 复制到外部工程

```powershell
.\scripts\copy-har-to-demo.ps1 -DemoPath ".\examples\npm-har-consumer-demo\harmony"
```

目标工程应得到 `entry/libs/myascf_runtime.har`，并配置：

```json5
{
  "dependencies": {
    "myascf_runtime": "file:./libs/myascf_runtime.har"
  }
}
```

## ArkWeb 注册

```ts
import { webview } from '@kit.ArkWeb';
import { MyASCFRuntime } from 'myascf_runtime';

private controller: webview.WebviewController = new webview.WebviewController();
private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));
```

```ts
Web({ src: $rawfile('web/index.html'), controller: this.controller })
  .javaScriptAccess(true)
  .javaScriptProxy({
    object: this.runtime.getNativeProxy(),
    name: this.runtime.getProxyName(),
    methodList: this.runtime.getMethodList(),
    controller: this.controller
  })
```

`WebviewController` 负责页面控制和 `runJavaScript`；Context 供 Storage 等平台实现使用；`MyASCFRuntime` 在 HAR 内完成 Registry、Dispatcher、CallbackExecutor、Controller 和 Native Proxy 组装。

## 升级 HAR

重新构建、覆盖 `entry/libs/myascf_runtime.har`，然后执行 ohpm Sync、Clean 和 Rebuild。不要从 HAR 内部源码路径导入。

常见错误：

- `Cannot find module 'myascf_runtime'`：HAR 未复制或 ohpm 未同步。
- `Failed to resolve OhmUrl`：依赖路径或旧缓存仍指向源码模块。
- `Cannot import files outside current module`：存在跨工程源码 import，应改用包入口。

