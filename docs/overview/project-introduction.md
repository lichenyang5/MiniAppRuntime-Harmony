# 项目介绍

这篇文档解决的问题：用通俗语言说明 MiniAppRuntime-Harmony 是什么、为什么做、当前做到哪里，以及公开项目边界是什么。

## 一句话介绍

MiniAppRuntime-Harmony 是一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架，用于探索 H5 页面如何通过 ArkWeb 与 ArkTS 通信，并把 Native 能力注册、分发、校验、调用和回调组织成可维护的链路。

## 项目定位

这个项目不是只把 H5 放进 WebView，而是围绕一个完整调用闭环做工程化拆分：

```text
H5 页面
-> window.myascf.send(action, params)
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> Biz
-> Imp
-> HarmonyOS Public Kit
-> BridgeCallbackExecutor
-> H5 Promise resolve / reject
```

## 合规边界

本项目为个人开源学习与工程实践项目，基于公开 HarmonyOS / ArkTS / ArkWeb 能力实现，不包含任何公司内部源码、内部接口、内部文档或非公开实现。

## 当前已完成

- ArkWeb 加载本地 H5 Demo。
- H5 通过 Promise 调用 ArkTS。
- requestId + callback map 管理异步响应。
- TIMEOUT / CALLBACK_LOST。
- JavaScriptProxy 通信边界。
- BridgeController 请求解析。
- BridgeDispatcher / HandlerRegistry。
- ToastBiz / ToastImp 调用公开 Toast 能力。
- ClipboardBiz / ClipboardImp 调用公开剪贴板能力。
- BridgeCallbackExecutor 统一回调 H5。
- H5 DebugPanel 展示调用链路。
- runtime 抽取为 `myascf_runtime` HAR 模块。
- `MyASCFRuntime` 统一封装 HAR 对外接入。

## 当前尚未实现

- Storage API。
- Network API。
- Web 容器白名单与错误页。
- 更完整的 API 文档生成。
- 更完整的 DebugPanel 搜索、筛选和统计能力。

## 项目适合展示什么

- HarmonyOS ArkWeb 容器实践。
- H5 与 ArkTS 双向通信设计。
- JSBridge 协议设计。
- Dispatcher / Registry 解耦能力扩展。
- Biz / Imp 分层处理参数校验和平台能力调用。
- CallbackExecutor、timeout、callback lost 的异步治理。
- HAR 模块化和示例应用分离。
