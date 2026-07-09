# 项目介绍

这篇文档解决的问题：用一篇简短说明讲清楚 MyASCF / ArkMiniRuntime 是什么、为什么做、当前完成到哪里，以及它和后续架构文档的关系。

## 一句话介绍

MyASCF / ArkMiniRuntime 是一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架，用于探索 ArkWeb 本地 H5 容器、H5 与 ArkTS 通信、API 注册分发、Biz/Imp 分层、UI 组件能力暴露和调试能力。

## 项目定位

这是一个个人开源探索项目，面向 HarmonyOS / ArkTS / ArkWeb。项目重点不是堆很多 API，而是用一个最小可运行闭环，把 Web 容器、JSBridge 协议、运行时分层和调试链路讲清楚、做扎实。

当前项目遵守以下边界：

- 只基于公开 HarmonyOS / ArkTS / ArkWeb 能力设计和实现。
- 不复制任何闭源源码。
- 不使用公司内部类名、接口名、模块名或文档内容。
- 对外统一描述为：受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。
- 每一步代码实现都同步补充 docs 文档。

## 当前工程状态

当前仓库是 DevEco Studio 生成的 HarmonyOS ArkTS Stage Model 应用工程，已经具备作为运行时宿主壳的基础条件。

关键事实：

- `entry` 是当前唯一主模块。
- `entry/build-profile.json5` 声明了 `apiType: "stageMode"`。
- `entry/src/main/module.json5` 声明 `EntryAbility` 作为主入口。
- `EntryAbility.ets` 加载 `pages/Index`。
- `Index.ets` 已经改造成 ArkWeb 容器页。
- ArkWeb 已经可以加载 `entry/src/main/resources/rawfile/web/index.html`。
- H5 已经可以通过 `window.myascf.send` 生成请求，并通过 JavaScriptProxy 调到 ArkTS。
- ArkTS 当前返回 mock response，H5 Promise 可以 resolve 并展示结果。

## 第一阶段目标

第一阶段围绕这条最小闭环展开：

```text
ArkWeb 加载本地 H5 页面
-> H5 调用 window.myascf.send("ui.showToast", { message: "hello from h5" })
-> ArkTS 通过 JavaScriptProxy 接收 action
-> 后续 Dispatcher 分发
-> 后续 ToastBiz 校验参数
-> 后续 ToastImp 调用 promptAction.showToast
-> ArkTS 通过 runJavaScript 回调 H5 Promise
```

当前已经完成到 JavaScriptProxy 通信边界，Dispatcher / Registry / Biz / Imp 还没有实现。

## 当前暂不实现的能力

第一阶段暂不实现：

- 完整小程序包格式和包解析器。
- 多页面路由和完整生命周期抽象。
- 复杂组件渲染 DSL。
- 远程包加载与生产级安全沙箱。
- 账号、权限弹窗、授权体系。
- 完整调试面板 UI。
- 大规模 API 面。

## 推荐阅读

先看这篇了解项目定位，再按顺序阅读：

1. `architecture/runtime-architecture.md`
2. `architecture/jsbridge-architecture.md`
3. `stages/02-load-local-h5-with-arkweb.md`
4. `stages/03-h5-to-arkts-javascript-proxy.md`
5. 后续阶段文档和 API 文档
