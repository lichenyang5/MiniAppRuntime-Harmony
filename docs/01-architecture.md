# MyASCF / ArkMiniRuntime 架构设计

## 当前 HarmonyOS 工程结构分析

当前仓库是一个标准 HarmonyOS ArkTS 工程，主要目录职责如下：

```text
ArkMiniRuntime/
  AppScope/                         # 应用级配置和全局资源
  AppScope/app.json5                # bundleName、版本、图标、应用标签等配置
  build-profile.json5               # 工程级构建、签名、SDK、模块配置
  hvigor/                           # Hvigor 构建系统配置
  hvigorfile.ts                     # 工程级 Hvigor 入口
  oh-package.json5                  # 工程依赖声明
  oh-package-lock.json5             # 依赖锁定文件
  oh_modules/                       # 已安装依赖
  entry/                            # 主 entry 模块
  entry/build-profile.json5         # entry 模块构建配置，声明 stageMode
  entry/hvigorfile.ts               # entry 模块 Hvigor 配置
  entry/oh-package.json5            # entry 模块依赖声明
  entry/src/main/module.json5       # 模块声明、Ability、页面、设备类型
  entry/src/main/ets/               # ArkTS 主源码目录
  entry/src/main/ets/entryability/  # UIAbility 入口
  entry/src/main/ets/pages/         # ArkUI 页面目录
  entry/src/main/resources/         # entry 模块资源目录
  entry/src/test/                   # 本地单元测试
  entry/src/ohosTest/               # 设备或集成测试
  docs/                             # 项目设计与实现文档
  .codex/skills/                    # 当前仓库内的 Codex 协作规则
```

当前关键源码职责：

- `entry/src/main/ets/entryability/EntryAbility.ets`：应用 UIAbility 入口，负责窗口创建和页面加载。
- `entry/src/main/ets/pages/Index.ets`：当前默认页面，仍是 DevEco 生成的 Hello World 示例。
- `entry/src/main/resources/base/profile/main_pages.json`：页面注册文件，目前只注册 `pages/Index`。
- `entry/src/main/module.json5`：声明 `EntryAbility`、入口、图标、标签、设备类型和页面配置。
- `entry/src/main/resources/`：后续可承载 rawfile H5 demo、图片、颜色、字符串等资源。

## Stage Model 可运行性检查

当前项目可以作为 ArkTS Stage Model 工程继续开发，依据如下：

- `entry/build-profile.json5` 包含 `"apiType": "stageMode"`。
- `entry/src/main/module.json5` 声明 `mainElement` 为 `EntryAbility`。
- `entry/src/main/module.json5` 中的 `abilities` 配置包含 `EntryAbility`，并设置了 `srcEntry`。
- `EntryAbility.ets` 继承 `UIAbility`。
- `EntryAbility.onWindowStageCreate` 调用 `windowStage.loadContent('pages/Index', ...)` 加载页面。
- `main_pages.json` 注册了 `pages/Index`。
- `Index.ets` 存在 `@Entry` 和 `@Component`，可作为当前默认页面启动。

结论：当前仓库是可运行的 ArkTS Stage Model 基础工程。下一步可以在此基础上引入 ArkWeb 容器，而不需要重新初始化项目。

## 第一阶段核心调用链

第一阶段只实现并验证下面这条链路：

```text
H5 Demo 页面
  -> window.myascf.send("ui.showToast", { message: "hello" })
  -> H5 创建 requestId 并记录 Promise callback
  -> H5 调用 ArkWeb 暴露的 JavaScriptProxy 边界
  -> BridgeController 接收原始请求
  -> BridgeDispatcher.dispatch(request)
  -> HandlerRegistry 查询 action 对应 handler
  -> ToastBiz 校验 params.message
  -> ToastImp 调用 promptAction.showToast
  -> BridgeController 组装 BridgeResponse
  -> ArkWebController.runJavaScript(callbackScript)
  -> H5 callback map resolve / reject Promise
```

推荐请求协议：

```json
{
  "requestId": "string",
  "action": "ui.showToast",
  "params": {
    "message": "hello"
  }
}
```

推荐响应协议：

```json
{
  "requestId": "string",
  "code": 0,
  "message": "success",
  "data": {}
}
```

第一阶段需要预留的标准错误码：

```text
UNKNOWN_ACTION   # action 未注册
PARAM_ERROR      # 参数缺失或类型不合法
INTERNAL_ERROR   # ArkTS 侧内部执行异常
CALLBACK_LOST    # H5 callback 丢失或无法回调
TIMEOUT          # 调用超时
```

## 推荐 ArkTS 运行时目录结构

后续在 `entry/src/main/ets/` 下规划运行时目录：

```text
entry/src/main/ets/runtime/
  bridge/
    BridgeController.ets       # 管理消息接收、响应组装和 runJavaScript 回调
    BridgeProtocol.ets         # BridgeRequest / BridgeResponse 协议辅助
    JavaScriptProxy.ets        # ArkWeb 暴露给 H5 的边界对象

  dispatcher/
    BridgeDispatcher.ets       # 所有 action 的统一分发入口

  registry/
    HandlerRegistry.ets        # 注册和查询 action handler
    RuntimeBootstrap.ets       # 运行时启动时注册内置 API

  api/
    ActionNames.ets            # 公开 action 常量，例如 ui.showToast
    BridgeTypes.ets            # request / response / handler 类型定义

  biz/
    ToastBiz.ets               # 校验 showToast 参数并编排调用

  imp/
    ToastImp.ets               # 调用 HarmonyOS promptAction.showToast

  error/
    BridgeError.ets            # 标准化错误对象
    BridgeErrorCode.ets        # 错误码常量

  logger/
    RuntimeLogger.ets          # 统一日志与未来调试面板事件源
```

分层约束：

- Web 页面只负责承载 ArkWeb 和连接 Bridge 边界，不直接写业务逻辑。
- 所有 action 必须经过 `BridgeDispatcher`。
- `HandlerRegistry` 只负责注册和查询，不做业务判断。
- `Biz` 层负责参数校验和业务编排。
- `Imp` 层负责调用公开 HarmonyOS 系统能力。
- 错误必须标准化后再返回给 H5。
- 日志统一进入 `logger`，为后续调试面板留出口。

## 推荐 H5 Demo 目录结构

后续在 `entry/src/main/resources/rawfile/web/` 下规划本地 H5 demo：

```text
entry/src/main/resources/rawfile/web/
  index.html
  js/
    myascf.js
    demo.js
  css/
    demo.css
```

职责说明：

- `index.html`：ArkWeb 加载的本地页面，提供一个最小 demo 按钮或自动测试入口。
- `js/myascf.js`：定义 `window.myascf.send(action, params)`，管理 `requestId`、Promise 和 callback map。
- `js/demo.js`：调用 `window.myascf.send("ui.showToast", { message: "hello" })`，展示调用结果。
- `css/demo.css`：只提供基础可读样式，不做复杂 UI。

## 当前暂不实现的能力

本阶段明确不做：

- 完整 JSBridge API 集合。
- 小程序包格式、包管理、页面路由和生命周期框架。
- 组件 DSL 或跨端组件渲染系统。
- 插件市场、动态插件下载和远程包加载。
- 生产级安全沙箱、权限授权体系、账号体系。
- 复杂调试面板和可视化链路追踪。
- 自动化文档生成工具。
- 除 `ui.showToast` 之外的批量 Native 能力接入。

## 后续 Roadmap

1. 确认 ArkWeb 依赖和权限配置，准备加载本地 rawfile H5 页面。
2. 将 `Index.ets` 改造成最小 ArkWeb 容器页，或新增 `pages/WebContainer.ets` 并更新 `main_pages.json`。
3. 新增 `rawfile/web/index.html`、`js/myascf.js`、`js/demo.js`、`css/demo.css`。
4. 先让 ArkWeb 成功显示本地 H5 页面。
5. 定义最小 Bridge 请求 / 响应类型，不急于扩展 API 面。
6. 实现 H5 `window.myascf.send`，生成 `requestId` 并保存 Promise callback。
7. 实现 ArkTS Bridge 接收边界，将原始消息交给 Dispatcher。
8. 实现只包含 `ui.showToast` 的 Dispatcher、Registry、ToastBiz、ToastImp。
9. 使用 `runJavaScript` 回调 H5，完成 Promise resolve / reject。
10. 补充超时、错误码、日志和 `docs/01-jsbridge.md`。

## 下一步计划：ArkWeb 本地 H5 加载准备

下一步建议只做 ArkWeb 加载本地 H5 页面和 JSBridge 最小闭环准备：

1. 检查 `@kit.ArkWeb` 相关 API 在当前 SDK 下的导入方式。
2. 在 `Index.ets` 中引入 Web 组件和 `webview.WebviewController`。
3. 将 Web 页面地址指向 `resource://rawfile/web/index.html`。
4. 新增 `rawfile/web/index.html`，先展示静态页面，确认本地资源可被 ArkWeb 加载。
5. 在 H5 中预留 `window.myascf.send` 脚本文件，但第一步只做空壳和日志输出。
6. ArkWeb 显示成功后，再加入 JavaScriptProxy、Dispatcher 和 `ui.showToast` 链路。

这能确保第一阶段每一步都可运行、可验证、可回退。
