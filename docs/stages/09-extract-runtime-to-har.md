# 阶段 09：抽取 Runtime 为 HAR 模块

这篇文档解决的问题：记录如何把 `entry` 内部的 JSBridge runtime 抽取为 `myascf_runtime` HAR 模块，让项目从 Demo 演进为可复用库。

## 本步骤目标

将原来的：

```text
entry/src/main/ets/runtime/**
```

迁移到：

```text
myascf_runtime/src/main/ets/**
```

迁移后，`entry` 只负责示例应用和 H5 Demo，`myascf_runtime` 负责 JSBridge 框架核心。

## 为什么要抽取 HAR

如果 runtime 一直放在 `entry` 里，它更像一个页面 Demo。抽成 HAR 后，可以表达出更清晰的工程化能力：

- 框架核心可复用。
- 示例应用和运行时解耦。
- 后续可以独立发布或被其他模块依赖。
- 面试讲解时更容易说明工程边界和演进路线。

## 修改了哪些配置

```text
build-profile.json5
entry/oh-package.json5
entry/src/main/ets/pages/Index.ets
myascf_runtime/build-profile.json5
myascf_runtime/hvigorfile.ts
myascf_runtime/oh-package.json5
myascf_runtime/Index.ets
myascf_runtime/src/main/module.json5
myascf_runtime/src/main/ets/Index.ets
```

## 移动了哪些文件

```text
entry/src/main/ets/runtime/api       -> myascf_runtime/src/main/ets/api
entry/src/main/ets/runtime/bridge    -> myascf_runtime/src/main/ets/bridge
entry/src/main/ets/runtime/dispatcher -> myascf_runtime/src/main/ets/dispatcher
entry/src/main/ets/runtime/registry  -> myascf_runtime/src/main/ets/registry
entry/src/main/ets/runtime/biz       -> myascf_runtime/src/main/ets/biz
entry/src/main/ets/runtime/imp       -> myascf_runtime/src/main/ets/imp
entry/src/main/ets/runtime/error     -> myascf_runtime/src/main/ets/error
entry/src/main/ets/runtime/logger    -> myascf_runtime/src/main/ets/logger
```

## Import 路径变化

迁移前：

```ts
import { BridgeController } from '../runtime/bridge/BridgeController';
import { JavaScriptProxy } from '../runtime/bridge/JavaScriptProxy';
```

迁移后：

```ts
import { MyASCFRuntime } from 'myascf_runtime';
```

## 抽取后的职责边界

`myascf_runtime` HAR 负责：

- JavaScriptProxy
- BridgeController
- BridgeCallbackExecutor
- BridgeDispatcher
- HandlerRegistry
- RuntimeBootstrap
- ActionNames / BridgeTypes
- ToastBiz / ToastImp
- ClipboardBiz / ClipboardImp
- BridgeError / BridgeErrorCode
- RuntimeLogger

`entry` 示例应用负责：

- EntryAbility
- Index.ets ArkWeb 容器页面
- `rawfile/web` H5 Demo
- H5 DebugPanel
- 页面按钮和验收交互
- 创建 WebviewController 和 MyASCFRuntime，并把 runtime proxy 注册给 ArkWeb

## 对外导出

HAR 通过 `myascf_runtime/Index.ets` 作为 ohpm 包入口，并转发到 `myascf_runtime/src/main/ets/Index.ets` 的稳定导出清单。entry 当前只依赖：

```ts
MyASCFRuntime
```

BridgeController、JavaScriptProxy、Dispatcher、Registry、RuntimeBootstrap、Biz/Imp 由 MyASCFRuntime 在 HAR 内部组装。

## 当前实现范围

本阶段只做 runtime HAR 抽取：

- 不新增业务 API。
- 不新增 Storage / Network API。
- 不修改 H5 侧协议。
- 不重写 DebugPanel。
- 不改变 `ui.showToast`、Clipboard、错误链路的行为。

## 验收标准

- 工程包含 `myascf_runtime` HAR 模块。
- `entry` 通过 `myascf_runtime` 导入 runtime 能力。
- `entry/src/main/ets/runtime` 不再承载核心 runtime 实现。
- H5 Demo 不需要感知 runtime 是否被抽成 HAR。
- `ui.showToast`、Clipboard、PARAM_ERROR、UNKNOWN_ACTION、TIMEOUT、CALLBACK_LOST、DebugPanel 均需要回归验证。

## 下一步计划

下一步可以继续扩展 Storage API，或者准备 README 项目展示文档和架构图。
