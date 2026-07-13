# 如何把一个 HarmonyOS JSBridge 项目讲成有价值的框架项目

这篇文档解决什么问题：把项目的技术价值整理成适合 GitHub、简历和面试的表达，同时保持边界真实。

## 不要只说“加载了 H5”

项目真正解决的是一条跨端运行时链路：

```text
H5 Promise -> JavaScriptProxy -> Controller -> Dispatcher -> Registry
-> Biz / Imp -> HarmonyOS Kit -> CallbackExecutor -> H5 Promise
```

链路之外还有 requestId、callback map、Timeout、Callback Lost、统一错误码、DebugPanel、本地 HAR、门面类，以及 Web 容器加载状态、URL Guard 和错误恢复。

## 面试讲解顺序

1. 为什么不把 action 判断写在 BridgeController。
2. requestId 和 callback map 如何管理并发异步请求。
3. Dispatcher/Registry 如何让 API 扩展变成注册。
4. Biz/Imp 如何隔离参数语义与平台调用。
5. CallbackExecutor 如何集中处理 runJavaScript。
6. 为什么抽成 HAR，以及 MyASCFRuntime 如何降低接入成本。
7. 为什么 Web 容器还需要加载状态、Guard 和错误页。

## 简历描述示例

```text
MiniAppRuntime-Harmony | HarmonyOS / ArkTS / ArkWeb / JSBridge / HAR

设计并实现轻量 HarmonyOS Web 容器与 JSBridge 运行时，支持 H5 Promise
调用 ArkTS、requestId/callback map、Timeout/Callback Lost 和统一错误响应；
通过 Dispatcher、Registry、Biz/Imp 与 CallbackExecutor 拆分通信、分发、校验、
平台调用和回调职责，并将 runtime 抽取为本地 HAR，通过 MyASCFRuntime 门面接入。

实现 Toast、Clipboard、Storage 能力和 H5 DebugPanel，并补充 Web 加载进度、
URL Guard、错误状态与重试入口。
```

## GitHub 首页应该突出什么

访问者应在短时间内看到项目定位、当前能力、架构图、HAR 接入、API、真实边界、Roadmap 和截图。不要只堆目录，也不要只展示某一个按钮效果。

## 当前不足

项目还缺真实截图、正式博客发布、自动化 API 文档、Network API、H5 SDK npm 化，以及更系统的设备兼容性和权限验证。这些应作为 Roadmap，而不是写成已完成。

## 合规表达

公开介绍统一使用“受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架”。只讲本仓库自行实现的代码和公开平台能力，明确这是个人开源学习与工程实践项目。
