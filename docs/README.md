# MyASCF / ArkMiniRuntime 文档

这篇文档解决的问题：作为 docs 首页，帮助读者按正确顺序理解这个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。

## 一句话介绍

MyASCF / ArkMiniRuntime 是一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架，用于探索 ArkWeb 容器、H5 与 ArkTS 通信、API 注册分发、Biz/Imp 分层、UI 组件能力暴露和调试能力。

## 推荐阅读顺序

1. `overview/project-introduction.md`
2. `architecture/runtime-architecture.md`
3. `architecture/jsbridge-architecture.md`
4. `stages/02-load-local-h5-with-arkweb.md`
5. `stages/03-h5-to-arkts-javascript-proxy.md`
6. 后续再看 Dispatcher、Registry、Biz/Imp、API 和 Debug 文档。

## 目录作用

- `overview/`：项目介绍、阶段路线和整体目标。
- `architecture/`：运行时架构、JSBridge 架构和后续分层设计。
- `stages/`：按开发阶段记录每一步做了什么、为什么做、如何验收。
- `api/`：后续记录公开 API 的请求参数、返回结构和错误码。
- `debug/`：后续记录调试方法、常见问题和排查路径。

## 当前已完成阶段

- 阶段 01：项目初始化与架构规划。
- 阶段 02：ArkWeb 加载本地 H5 页面。
- 阶段 03：H5 通过 JavaScriptProxy 调到 ArkTS，ArkTS 返回 mock response，H5 Promise resolve。
- 阶段 04：接入 BridgeDispatcher 和 HandlerRegistry，`ui.showToast` 仍返回 mock handler response。
- 阶段 05：接入 ToastBiz 和 ToastImp，`ui.showToast` 调用真实 HarmonyOS Toast。
- 阶段 06：抽出 BridgeCallbackExecutor，并补充 H5 timeout / callback lost 处理。
- 阶段 07：扩展 Clipboard API，验证新增能力只需局部扩展。

## 后续阶段计划

1. 补充 debug 面板和 RuntimeLogger 可视化。
2. 继续扩展 storage API。
3. 增加更完整的调用链耗时统计。

## 面试讲解推荐路径

可以按这条线讲：

1. 先讲项目目标：为什么要做一个 HarmonyOS Web 容器与 JSBridge 框架。
2. 再讲最小闭环：H5 发起 action，ArkTS 接收，后续分发到 Biz/Imp。
3. 讲阶段 02：先把 ArkWeb 和本地 H5 跑通。
4. 讲阶段 03：用 JavaScriptProxy 和 runJavaScript 打通双向通信。
5. 讲阶段 04：Dispatcher / Registry 解决 action 扩展问题。
6. 讲阶段 05：Biz/Imp 解决校验和系统能力调用分层。
7. 讲阶段 06：回调治理、超时控制和 callback lost。
8. 讲后续设计：调试可视化和更多 API 扩展。
