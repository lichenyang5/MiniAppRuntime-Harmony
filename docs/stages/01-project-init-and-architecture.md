# 阶段 01：项目初始化与架构规划

这篇文档解决的问题：记录项目初始化阶段做了哪些分析，以及第一阶段为什么选择最小可运行闭环。

## 本阶段目标

- 分析 HarmonyOS 工程结构。
- 确认当前项目是 ArkTS Stage Model 工程。
- 设计运行时目录结构。
- 设计 H5 demo 目录结构。
- 明确第一阶段只做最小闭环。

## 当前结论

当前项目可以作为 HarmonyOS Web 容器与 JSBridge 框架的宿主工程继续演进。

第一阶段目标链路：

```text
ArkWeb 本地 H5
-> window.myascf.send
-> JavaScriptProxy
-> BridgeController
-> 后续 Dispatcher
-> 后续 Registry
-> 后续 Biz / Imp
-> runJavaScript 回调 H5
```

## 当前尚未实现，后续阶段补充

阶段 01 只做工程分析和目录规划，不实现运行时代码。
