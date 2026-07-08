# MyASCF / ArkMiniRuntime 项目概览

## 项目定位

MyASCF / ArkMiniRuntime 是一个个人开源探索项目，面向 HarmonyOS / ArkTS / ArkWeb，目标是实现一个受小程序运行时架构启发的轻量级 HarmonyOS Web 容器与 JSBridge 框架。

项目关注的核心问题是：如何在 HarmonyOS 应用中通过 ArkWeb 承载本地 H5 页面，并建立一条清晰、可测试、可扩展的 H5 到 ArkTS 能力调用链。第一阶段不会追求大而全，而是先证明最小可运行闭环。

项目边界：

- 这是个人开源项目。
- 只基于公开 HarmonyOS / ArkTS / ArkWeb 能力设计和实现。
- 不复制任何闭源源码。
- 不使用公司内部类名、接口名、模块名或文档内容。
- 对外统一描述为：受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。

## 当前工程状态

当前仓库是 DevEco Studio 生成的 HarmonyOS ArkTS 应用工程，已经具备作为运行时宿主壳的基础条件。

关键事实：

- 根目录存在 `build-profile.json5`、`hvigorfile.ts`、`oh-package.json5` 等工程配置。
- `entry` 是当前唯一主模块。
- `entry/build-profile.json5` 中声明了 `apiType: "stageMode"`。
- `entry/src/main/module.json5` 声明了 `EntryAbility` 作为主入口。
- `EntryAbility.ets` 继承 `UIAbility`，并在 `onWindowStageCreate` 中加载 `pages/Index`。
- `entry/src/main/resources/base/profile/main_pages.json` 当前只注册了 `pages/Index`。
- `pages/Index.ets` 仍是默认 Hello World 页面，后续可以改造为 ArkWeb 容器页。

因此，当前项目可以作为 ArkTS Stage Model 工程继续演进。

## 第一阶段目标

第一阶段只围绕一个最小可运行闭环展开：

```text
ArkWeb 加载本地 H5 页面
-> H5 调用 window.myascf.send("ui.showToast", { message: "hello" })
-> ArkTS 接收 action
-> Dispatcher 分发
-> ToastBiz 校验参数
-> ToastImp 调用 HarmonyOS promptAction.showToast
-> ArkTS 通过 runJavaScript 回调 H5 Promise
```

这个闭环要验证的不是 API 数量，而是运行时分层是否成立：Web 容器、Bridge 边界、Dispatcher、Registry、Biz、Imp、Error、Logger 都应各司其职。

## 推荐目录结构

第一阶段推荐在 `entry/src/main/ets/` 下规划运行时代码目录：

```text
entry/src/main/ets/runtime/
  bridge/        # ArkWeb 与 H5 通信边界，负责接收消息与执行 H5 回调
  dispatcher/    # 统一 action 分发入口，禁止在 Web 页面中直接写业务逻辑
  registry/      # API handler 注册和查询
  api/           # action 常量、请求响应类型、公开协议定义
  biz/           # 参数校验和业务编排，例如 ToastBiz
  imp/           # HarmonyOS 能力调用实现，例如 ToastImp
  error/         # 标准错误码和错误对象
  logger/        # 运行时日志、调试事件、调用链追踪
```

推荐在 `entry/src/main/resources/rawfile/web/` 下规划 H5 demo 目录：

```text
entry/src/main/resources/rawfile/web/
  index.html       # ArkWeb 加载的本地 H5 demo 页面
  js/
    myascf.js      # H5 侧 bridge 封装，暴露 window.myascf.send
    demo.js        # demo 交互逻辑，触发 ui.showToast
  css/
    demo.css       # demo 页面基础样式
```

本次任务只完成文档规划，不创建完整运行时代码文件。运行时目录和 H5 demo 文件会在实现 ArkWeb 本地页面加载时逐步落地。

## 当前暂不实现的能力

第一阶段暂不实现以下能力：

- 完整小程序包格式和包解析器。
- 多页面路由和完整生命周期抽象。
- 复杂组件渲染 DSL。
- 大量 Native API 或插件市场。
- 远程包加载与生产级安全沙箱。
- 账号、权限弹窗、授权体系。
- 完整调试面板 UI。
- 自动化 API 文档生成。
- `ui.showToast` 之外的大规模 API 面。

## Roadmap

1. 将默认 `pages/Index` 改造成 ArkWeb 容器页，或新增独立 Web 容器页并注册。
2. 在 `rawfile/web/` 下添加最小 H5 demo 页面。
3. 在 H5 侧暴露 `window.myascf.send(action, params)`。
4. 在 ArkTS 侧建立 Bridge 接收边界和请求响应类型。
5. 添加 `BridgeDispatcher` 与 `HandlerRegistry`，先只注册 `ui.showToast`。
6. 添加 `ToastBiz` 负责参数校验和业务编排。
7. 添加 `ToastImp` 调用公开 HarmonyOS `promptAction.showToast`。
8. 通过 ArkWeb `runJavaScript` 将结果回调给 H5 Promise。
9. 补充超时、标准错误码和基础日志。
10. 第一条链路稳定后，再扩展更多 API、调试能力和组件能力暴露。

## 文档同步规则

后续每一步代码实现都必须同步更新 docs。文档至少说明：

- 本次改了哪些文件。
- 为什么这样设计。
- 影响了哪条调用链。
- 对 H5 暴露的公开调用方式。
- 当前限制和后续计划。
