# 认识 MiniAppRuntime-Harmony

你将学会什么：这个项目解决什么问题、两端包分别负责什么，以及它明确不解决什么。

MiniAppRuntime-Harmony 是一个基于 HarmonyOS、ArkTS 和 ArkWeb 公开能力实现的轻量级 Web 容器与 JSBridge 框架。它让 React、Vue 或普通 H5 页面通过 Promise API 调用 Toast、Clipboard、Preferences 和 Network 等 HarmonyOS 能力。

```ts
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const api = createTypedApi(initMyASCF());
await api.ui.showToast({ message: 'Hello HarmonyOS' });
```

框架拆成两个公开包：

- npm 包 `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` 运行在 H5，管理 requestId、callback map、Promise、timeout 和 AbortSignal。
- OHPM 包 `myascf_runtime@1.0.0` 运行在 ArkTS，负责 JavaScriptProxy、Dispatcher、Registry、Biz/Imp、系统能力和回调。

两端通过 JSON 协议协作，不直接依赖彼此源码。当前 Manifest 有 10 个 action：9 个公开 API，另有 `network.abort` 供 SDK 内部取消请求使用。项目是个人开源工程实践，不宣称生产级，也不是任何官方方案的替代品。

## 下一步阅读

- [从零跑通](quick-start.md)
- [架构总览](architecture-overview.md)
- [npm 与 OHPM 的边界](../concepts/npm-and-ohpm-boundaries.md)
