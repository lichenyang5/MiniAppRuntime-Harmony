# 从 ArkWeb 容器到 JSBridge 运行时

这篇文档解决什么问题：从全局视角解释为什么这个项目不止是加载网页，以及完整运行时链路由哪些部分组成。

ArkWeb 加载一个 H5 页面并不难，真正有工程价值的问题是：H5 如何调用 ArkTS，多个并发请求如何匹配响应，未知 action 和参数错误如何统一处理，新能力如何接入而不让 Controller 越来越重。

```text
window.myascf.send -> JavaScriptProxy -> BridgeController
-> BridgeDispatcher -> HandlerRegistry -> Biz / Imp
-> BridgeCallbackExecutor -> H5 Promise
```

H5 SDK 负责 requestId、callback map、timeout 和 Promise；JavaScriptProxy 建立通信边界；Controller 解析请求；Dispatcher 和 Registry 完成 action 分发；Biz 校验参数并组织响应；Imp 调用公开 HarmonyOS Kit；CallbackExecutor 集中处理 runJavaScript。

项目当前接入了 Toast、Clipboard 和 Storage，并用 DebugPanel 展示请求生命周期。runtime 已抽成 `myascf_runtime` 本地 HAR，外部 Demo 只需创建 `MyASCFRuntime` 并注册 Native Proxy。

除了 JSBridge，entry 还维护加载进度、URL Guard、错误状态和重试入口。它们与 Bridge 不共享业务逻辑，但共同构成 H5 运行环境。

当前没有实现完整小程序规范、远程内容生产级治理或大量 Native API。项目重点是展示跨端协议设计、异步治理、模块分层和 HAR 工程化。
