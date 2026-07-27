# myascf_runtime

这篇文档解决什么问题：说明 HAR Runtime 的公共入口、宿主权限、接入方式和发布边界。

`myascf_runtime` 是基于 HarmonyOS、ArkTS 和 ArkWeb 公开能力实现的轻量级 JSBridge Runtime。它在 HAR 内部完成 JavaScriptProxy、请求分发、API 注册、Biz/Imp 调用和 `runJavaScript` 回调。

## 安装与入口

当前通过本地 HAR 接入：

```json5
{
  "dependencies": {
    "myascf_runtime": "file:./libs/myascf_runtime.har"
  }
}
```

外部工程只从包入口导入：

```ts
import { MyASCFRuntime, NetworkPolicy } from 'myascf_runtime';

const runtime = new MyASCFRuntime(controller, context, networkPolicy);
```

不要从 HAR 内部路径导入 Dispatcher、Registry、Biz、Imp、Bootstrap、Controller、Logger 或内置 Manifest。

## 公共 API

- 门面：`MyASCFRuntime`、`MyASCFNativeProxy`。
- 响应与错误：`BridgeResponse`、`BridgeResponseData`、`ApiSummary`、`BridgeErrorCode`。
- 网络配置：`NetworkPolicy`、`NetworkMethod`、`NetworkResponseType`。
- Web 容器：`WebContainerConfig`、`WebUrlGuard`、`WebLoadStatus`、`WebLoadState`。

`RuntimeLogger`、`BUILTIN_API_MANIFEST`、Bridge 请求解析类型和运行时装配类属于内部实现，不是首版兼容契约。

## 宿主权限

HAR 无法替宿主应用声明或动态申请权限，消费方需要按实际启用能力配置 `entry/src/main/module.json5`。

| 能力 | 宿主声明 | 用户授权 | 说明 |
| --- | --- | --- | --- |
| `network.request` | `ohos.permission.INTERNET` | 无运行时弹窗 | 只有使用网络能力时才声明。 |
| `system.clipboard.readText` | `ohos.permission.READ_PASTEBOARD` | 需要调用 `requestPermissionsFromUser` | 用户可能选择单次授权，拒绝后应正常返回错误。 |
| `system.clipboard.writeText` | 无额外权限 | 否 | 当前实现只调用系统剪贴板 `setData`。 |
| `system.storage.*` | 无额外权限 | 否 | 使用应用沙箱内 Preferences，需要向 Runtime 传入宿主 `Context`。 |
| `ui.showToast` | 无额外权限 | 否 | 使用 ArkUI `promptAction`。 |
| `runtime.getApiList` | 无额外权限 | 否 | 只读取 Runtime 内置元信息。 |

宿主声明示例：

```json5
"requestPermissions": [
  { "name": "ohos.permission.INTERNET" },
  {
    "name": "ohos.permission.READ_PASTEBOARD",
    "reason": "$string:pasteboard_reason",
    "usedScene": {
      "abilities": ["EntryAbility"],
      "when": "inuse"
    }
  }
]
```

权限应按需申请，不建议在应用启动时无条件批量请求。完整宿主示例见 `examples/npm-har-consumer-demo/harmony`。

## 分发状态

- H5 SDK：`@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` 已发布 npm。
- HAR Runtime：`myascf_runtime@1.0.0`，OHPM 发布准备中，尚未发布。
- 开源候选 HAR 使用 `artifactType: original`，正式发布参数固定为 `--source_type open`。
- GitHub Release：尚未创建正式资产。

完整接入、兼容矩阵和发布步骤见仓库 `docs/guide/har-runtime-usage.md`、`docs/version-compatibility.md` 与 `docs/release/ohpm-publish-guide.md`。
