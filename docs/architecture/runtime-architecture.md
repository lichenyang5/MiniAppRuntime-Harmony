# 运行时架构

这篇文档解决的问题：说明 MyASCF / ArkMiniRuntime 的工程结构、Stage Model 基础、运行时分层，以及每一层为什么这样拆。

## 当前 HarmonyOS 工程结构

```text
ArkMiniRuntime/
  AppScope/                         # 应用级配置和全局资源
  build-profile.json5               # 工程级构建、签名、SDK、模块配置
  hvigor/                           # Hvigor 构建配置
  oh-package.json5                  # 工程依赖声明
  entry/                            # 主 entry 模块
  entry/src/main/module.json5       # 模块声明、Ability、页面、设备类型
  entry/src/main/ets/               # ArkTS 主源码目录
  entry/src/main/ets/entryability/  # UIAbility 入口
  entry/src/main/ets/pages/         # ArkUI 页面目录
  entry/src/main/resources/         # entry 模块资源目录
  docs/                             # 项目设计与阶段文档
```

## Stage Model 检查

当前项目可以作为 ArkTS Stage Model 工程继续演进：

- `entry/build-profile.json5` 包含 `"apiType": "stageMode"`。
- `entry/src/main/module.json5` 声明 `mainElement` 为 `EntryAbility`。
- `EntryAbility.ets` 继承 `UIAbility`。
- `EntryAbility.onWindowStageCreate` 加载 `pages/Index`。
- `main_pages.json` 注册了 `pages/Index`。
- `Index.ets` 已经作为 ArkWeb 容器页承载本地 H5。

## 核心调用链

目标调用链如下：

```text
H5 页面
-> window.myascf.send(action, params)
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> Biz
-> Imp
-> HarmonyOS System API
-> BridgeResponse
-> runJavaScript
-> H5 Promise resolve / reject
```

当前已经完成：

- ArkWeb 加载本地 H5 页面。
- H5 `window.myascf.send` 返回 Promise。
- JavaScriptProxy 接收 H5 JSON 字符串。
- BridgeController 解析请求并交给 BridgeDispatcher。
- BridgeDispatcher 通过 HandlerRegistry 找到 `ui.showToast` mock handler。
- H5 根据 `requestId` resolve Promise。

当前尚未实现：

- ToastBiz
- ToastImp
- 真实 `promptAction.showToast`

## 推荐运行时目录

```text
entry/src/main/ets/runtime/
  bridge/        # ArkWeb 与 H5 通信边界
  dispatcher/    # action 统一分发入口
  registry/      # API handler 注册和查询
  api/           # action 常量、请求响应类型、公开协议
  biz/           # 参数校验和业务编排
  imp/           # HarmonyOS 能力调用实现
  error/         # 标准错误码和错误对象
  logger/        # 日志、调试事件、调用链追踪
```

## 分层约束

- Web 页面只负责承载 ArkWeb 和连接通信边界。
- 所有 action 后续必须经过 `BridgeDispatcher`。
- `HandlerRegistry` 只负责注册和查询。
- `Biz` 层负责参数校验和业务编排。
- `Imp` 层负责调用公开 HarmonyOS 系统能力。
- 错误对象在返回 H5 前必须标准化。
- 日志统一进入 `logger`，为后续调试面板留出口。

## 为什么这样设计

这个拆法适合面试讲解，也方便后续维护：

- Web 容器和业务逻辑分离，避免页面越来越厚。
- JSBridge 协议独立，方便扩展更多 action。
- Biz/Imp 分层让参数校验和系统 API 调用分开。
- Registry 让 API 接入变成注册行为，而不是到处写条件判断。
- Logger 和 Error 独立后，调试面板可以自然接入。
