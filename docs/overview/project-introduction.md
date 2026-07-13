# 项目介绍

这篇文档解决什么问题：用几分钟说明 MiniAppRuntime-Harmony 是什么、为什么做、当前完成了什么以及公开边界。

## 一句话介绍

MiniAppRuntime-Harmony 是一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。

## 为什么做

ArkWeb 能让应用加载 H5，但一个可维护的运行时还需要解决通信协议、并发回调、action 分发、能力注册、参数校验、平台调用、错误处理和调试观察。本项目用一条最小但完整的链路探索这些问题。

```text
H5 -> JavaScriptProxy -> BridgeController -> Dispatcher -> Registry
   -> Biz -> Imp -> HarmonyOS Public Kit
   -> BridgeCallbackExecutor -> H5 Promise
```

## 当前完成状态

项目已经实现本地 H5、Promise JSBridge、requestId/callback map、Timeout/Callback Lost、Dispatcher/Registry、Biz/Imp、Toast/Clipboard/Storage、DebugPanel、本地 HAR、MyASCFRuntime 门面，以及加载进度、URL Guard 和错误状态页。

## 项目边界

这是个人开源学习与工程实践项目，基于公开 HarmonyOS、ArkTS 和 ArkWeb 能力自行实现。当前不是完整小程序规范，也不是生产级安全沙箱；远程内容治理、自动化 API 文档、Network API 和 npm 化 H5 SDK 仍在 Roadmap 中。

## 适合如何阅读

先看运行时架构和 JSBridge 协议，再看 HAR 接入与 Biz/Imp，最后通过阶段文档理解项目如何从本地 H5 演进到可复用模块和 Web 容器增强。
