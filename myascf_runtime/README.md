# myascf_runtime

## 你将学会什么

了解 ArkTS HAR Runtime 的安装、公共入口、宿主权限和 npm H5 SDK 配套方式。

`myascf_runtime` 是基于 HarmonyOS、ArkTS 和 ArkWeb 公开能力实现的轻量级 JSBridge Runtime。它在 HAR 内完成 JavaScriptProxy、请求分发、API 注册、Biz/Imp 调用和 `runJavaScript` 回调。

## 安装

```bash
ohpm install myascf_runtime@1.0.0
```

模块依赖将写入：

```json5
{
  "dependencies": {
    "myascf_runtime": "1.0.0"
  }
}
```

## 公共入口

```ts
import { MyASCFRuntime, NetworkPolicy } from 'myascf_runtime';

const runtime = new MyASCFRuntime(controller, context, networkPolicy);
```

应用通过 `getNativeProxy()`、`getProxyName()` 和 `getMethodList()` 注册 ArkWeb JavaScriptProxy。不要从 HAR 内部路径导入 Dispatcher、Registry、Biz、Imp、Bootstrap、Controller、Logger 或内置 Manifest。

首版公共类型还包括 Bridge 响应/错误、NetworkPolicy 与 WebContainerConfig 等必要契约；以包入口 `Index.ets` 的实际导出为准。

## 开发分支的宿主扩展

开发分支新增 registerCustomApi(action, handler, metadata?)，以及 BridgeHandler、BridgeRequest、BridgeRequestParams、CustomApiMetadata 公共契约。已发布 OHPM 1.0.0 不含这个注册入口；本地构建 HAR 验证，发布后消费项目再升级。使用步骤见[宿主 API 扩展教程](../docs/guide/extending-api.md)。

## 宿主权限

| 能力 | 宿主声明 | 运行时授权 |
| --- | --- | --- |
| `network.request` | `ohos.permission.INTERNET` | 无弹窗 |
| `system.clipboard.readText` | `ohos.permission.READ_PASTEBOARD` | 需要 |
| Clipboard write / Storage / Toast / API List | 无额外权限 | 不需要 |

HAR 不能替宿主声明或申请权限。剪贴板读取权限应按需申请，Storage 通过宿主 `Context` 使用应用沙箱 Preferences。

## 配套版本

- OHPM Runtime：`myascf_runtime@1.0.0`
- npm H5 SDK：`@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`
- 公开 API：9 个；内部取消 action：1 个

## 下一步

- [Runtime 安装](../docs/guide/runtime-installation.md)
- [ArkWeb 接入](../docs/guide/arkweb-integration.md)
- [版本兼容矩阵](../docs/version-compatibility.md)
