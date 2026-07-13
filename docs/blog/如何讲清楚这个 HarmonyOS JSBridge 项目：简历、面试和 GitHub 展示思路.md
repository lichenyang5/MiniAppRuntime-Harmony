# 如何讲清楚这个 HarmonyOS JSBridge 项目：简历、面试和 GitHub 展示思路

> 项目地址：https://github.com/lichenyang5/MiniAppRuntime-Harmony  
> 本文是 MiniAppRuntime-Harmony 系列总结篇，整理这个项目应该如何在简历、面试和 GitHub 中表达。

## 1. 不要把它说成 WebView Demo

这个项目最容易被误解成：一个 ArkWeb 加载 H5 的 Demo。

但它实际上包括：

```text
Web 容器
JSBridge 协议
requestId
Promise callback map
JavaScriptProxy
BridgeController
BridgeDispatcher
HandlerRegistry
RuntimeBootstrap
Biz / Imp
BridgeCallbackExecutor
TIMEOUT / CALLBACK_LOST
DebugPanel
本地 HAR 包
MyASCFRuntime 门面类
```

所以简历或面试里不要只写“实现 ArkWeb 加载 H5 页面”。

可以写成：

```text
设计并实现一个面向 HarmonyOS 的轻量级 Web 容器与 JSBridge 运行时框架，支持 H5 Promise 形式调用 ArkTS 能力，通过 Dispatcher / Registry / Biz / Imp 分层实现 Native API 注册、分发、参数校验和系统能力调用，并抽取为本地 HAR 模块供外部 Demo 复用。
```

## 2. 面试时可以按这条主线讲

不要一上来讲所有文件。按问题展开。

### 为什么做这个项目？

可以说：

> 我想验证 HarmonyOS 场景下，H5 页面如何通过 ArkWeb 与 ArkTS 进行双向通信，并进一步把通信、分发、能力注册、业务校验、系统能力调用和回调治理拆成清晰的运行时结构。

### 整体链路是什么？

讲这条：

```text
H5
→ window.myascf.send
→ JavaScriptProxy
→ BridgeController
→ BridgeDispatcher
→ HandlerRegistry
→ Biz
→ Imp
→ BridgeCallbackExecutor
→ H5 Promise
```

### 为什么要 Dispatcher / Registry？

回答：

> 为了避免 BridgeController 里写大量 if else。Dispatcher 负责统一分发，Registry 负责 action 到 handler 的注册和查询。新增 API 时只需要新增 ActionName、Biz、Imp 和 Bootstrap 注册，不需要改主链路。

### 为什么要 Biz / Imp？

回答：

> Biz 负责参数校验和业务语义，Imp 负责调用 HarmonyOS 公开系统能力。这样业务规则和平台调用解耦，后续新增 API 或做单测更方便。

### 为什么要 HAR？

回答：

> runtime 一开始放在 entry 里，只能算应用内部 Demo。抽成 myascf_runtime 本地 HAR 后，entry 变成示例应用，runtime 变成可复用库。新建 HarmonyOS Demo 可以依赖本地 HAR，并通过 MyASCFRuntime 门面类接入。

## 3. 简历项目可以这样写

```text
MiniAppRuntime-Harmony｜HarmonyOS / ArkTS / ArkWeb / JSBridge / HAR

设计并实现一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 运行时框架，支持 ArkWeb 加载本地 H5、H5 Promise 形式调用 ArkTS、requestId 与 callback map 管理异步回调，并通过 JavaScriptProxy 与 runJavaScript 完成双向通信。

框架侧实现 BridgeController、BridgeDispatcher、HandlerRegistry、RuntimeBootstrap、Biz/Imp 分层和 BridgeCallbackExecutor，完成 ui.showToast、system.clipboard.writeText/readText 等 API 的注册、参数校验和系统能力调用；补充 TIMEOUT、CALLBACK_LOST、UNKNOWN_ACTION、PARAM_ERROR 等错误处理，并提供 H5 DebugPanel 展示调用链路。

进一步将 runtime 核心抽取为 myascf_runtime 本地 HAR 模块，并封装 MyASCFRuntime 门面类，降低新建 HarmonyOS Demo 的接入成本。
```

## 4. GitHub README 应该突出什么

README 不要一上来堆代码。

应该让人 30 秒内看懂：

```text
项目是什么
解决什么问题
当前有哪些能力
架构图
如何运行
如何接入 HAR
有哪些 API
Roadmap
合规边界
```

特别要写清楚边界：

```text
本项目为个人开源学习与工程实践项目，基于公开 HarmonyOS / ArkTS / ArkWeb 能力实现，不包含任何公司内部源码、内部接口、内部文档或非公开实现。
```

这句话建议长期保留。

## 5. 博客系列可以怎么发

推荐按这个顺序发：

```text
1. 总览：从 ArkWeb 容器到 JSBridge 运行时
2. Web 容器：为什么先加载本地 H5
3. JSBridge：requestId、Promise、callback map
4. 框架分层：Dispatcher / Registry / Biz / Imp
5. 稳定性：runJavaScript、TIMEOUT、CALLBACK_LOST、DebugPanel
6. 工程化：抽成本地 HAR 包和 MyASCFRuntime 门面类
7. 总结：这个项目如何写进简历和面试讲解
```

## 6. 公开表达时要避免什么

不要写这些：

```text
复刻 ASCF
仿 ASCF
内部框架
内部源码
内部文档
客户问题
闭源实现
```

可以写：

```text
受小程序运行时架构启发
基于公开 HarmonyOS / ArkTS / ArkWeb 能力
个人开源学习与工程实践项目
探索 Web 容器与 JSBridge 运行时设计
```

这样既能体现你对框架的理解，也能避开不必要的风险。

## 7. 这个项目真正的价值

它的价值不在于 API 多。

真正的价值在于：

```text
你能把一个跨端通信问题拆成稳定的工程层次
你能设计协议
你能管理异步回调
你能处理错误和超时
你能把 Demo 抽成 HAR 库
你能写文档和架构图讲清楚
```

这就是这个项目作为代表项目的核心竞争力。
