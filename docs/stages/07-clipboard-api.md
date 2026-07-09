# 阶段 07：Clipboard API

这篇文档解决的问题：记录如何在现有 Dispatcher / Registry / Biz / Imp 架构上扩展第二组真实 API，验证框架的可扩展性。

## 本步骤目标

本阶段新增 Clipboard 能力：

```text
system.clipboard.writeText
system.clipboard.readText
```

目标不是单纯增加 API 数量，而是验证新增能力时主链路不需要大改。

## 为什么选择 Clipboard API

Clipboard API 适合作为第二组真实能力：

- 它是常见系统能力。
- 同时覆盖写入和读取两个方向。
- 写入需要参数校验。
- 读取需要把系统能力结果返回给 H5。
- 能验证 `BridgeResponse.data.text` 的扩展能力。

## 新增文件

```text
entry/src/main/ets/runtime/biz/ClipboardBiz.ets
entry/src/main/ets/runtime/imp/ClipboardImp.ets
docs/stages/07-clipboard-api.md
docs/api/clipboard.md
```

## 修改文件

```text
entry/src/main/ets/runtime/api/ActionNames.ets
entry/src/main/ets/runtime/api/BridgeTypes.ets
entry/src/main/ets/runtime/registry/RuntimeBootstrap.ets
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/js/demo.js
entry/src/main/resources/rawfile/web/css/demo.css
docs/architecture/biz-imp-layer-design.md
docs/overview/roadmap.md
```

## 写入剪贴板链路

```text
H5 点击写入按钮
-> window.myascf.send("system.clipboard.writeText", { text: "hello from MiniAppRuntime" })
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> ClipboardBiz.writeText
-> ClipboardBiz 校验 params.text
-> ClipboardImp.writeText
-> pasteboard 写入剪贴板
-> BridgeResponse
-> BridgeCallbackExecutor
-> H5 Promise resolve
```

## 读取剪贴板链路

```text
H5 点击读取按钮
-> window.myascf.send("system.clipboard.readText", {})
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> ClipboardBiz.readText
-> ClipboardImp.readText
-> pasteboard 读取剪贴板文本
-> BridgeResponse.data.text
-> BridgeCallbackExecutor
-> H5 Promise resolve
```

## ClipboardBiz 职责

- 校验 `writeText` 的 `params.text`。
- 调用 ClipboardImp。
- 组装标准 BridgeResponse。
- 返回 `PARAM_ERROR` 或成功响应。

ClipboardBiz 不直接依赖 ArkWeb，不直接回调 H5，不直接操作 Registry。

## ClipboardImp 职责

- 调用公开 HarmonyOS `pasteboard` 能力。
- 对外只暴露 `writeText(text)` 和 `readText()`。
- 不关心 H5 协议、requestId、Dispatcher 或 BridgeResponse。

## 参数校验

`system.clipboard.writeText` 的 `params.text` 必须存在，并且 `trim()` 后不能为空。

这些调用会返回 PARAM_ERROR：

```js
window.myascf.send("system.clipboard.writeText", {})
window.myascf.send("system.clipboard.writeText", { text: "" })
```

`system.clipboard.readText` 不需要参数。

## 错误处理

- 参数缺失：返回 `PARAM_ERROR`。
- 剪贴板系统能力异常：由 Dispatcher 捕获并返回 `INTERNAL_ERROR`。
- 未注册 action：仍返回 `UNKNOWN_ACTION`。
- H5 timeout：仍由 H5 timeout 机制处理。

## H5 Demo

Demo 页面新增 Clipboard 区域：

- 写入剪贴板。
- 读取剪贴板。
- 剪贴板参数错误。

Toast、未知 action 和 timeout 测试入口仍然保留。

## 验收标准

- 原有 `ui.showToast` 仍然可用。
- 写入剪贴板按钮可以调用 `system.clipboard.writeText`。
- 读取剪贴板按钮可以调用 `system.clipboard.readText`。
- 页面可以展示读取到的 `data.text`。
- 写入参数缺失时返回 `PARAM_ERROR`。
- UNKNOWN_ACTION 和 TIMEOUT 逻辑不被破坏。

## 下一步计划

下一步可以选择 DebugPanel / RuntimeLogger 可视化，或者继续扩展 storage API。
