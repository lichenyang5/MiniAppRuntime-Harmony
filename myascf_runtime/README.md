# myascf_runtime

这篇文档解决什么问题：说明 HAR 模块的职责、公开入口和消费方式。

`myascf_runtime` 是 MiniAppRuntime-Harmony 的 ArkTS Runtime，基于 HarmonyOS、ArkTS 和 ArkWeb 公开能力实现。它负责 JavaScriptProxy 接收、Bridge 分发、API 注册、Biz/Imp 调用和 `runJavaScript` 回调。

外部工程只从包入口导入：

```ts
import { MyASCFRuntime } from 'myascf_runtime';
```

推荐分发方式：

- 当前：本地 HAR 或 GitHub Release 资产。
- 后续：确认 ohpm 账号、包名和公开发布意图后再发布到 ohpm。
- 不推荐：把 HAR 作为正式 npm 包分发。

完整接入见仓库的 `docs/guide/har-runtime-usage.md`。

