# Biz / Imp 分层设计

这篇文档解决的问题：说明为什么要把业务校验和 HarmonyOS 系统能力调用拆成 Biz / Imp 两层，并用 Toast 与 Clipboard 展示当前实现。

## 当前状态

当前已有两组真实能力接入 Biz / Imp：

```text
ui.showToast
-> ToastBiz
-> ToastImp
-> promptAction.showToast

system.clipboard.writeText / readText
-> ClipboardBiz
-> ClipboardImp
-> pasteboard
```

## 分层目标

- `Biz`：负责参数校验、业务语义、标准响应。
- `Imp`：负责调用公开 HarmonyOS 系统能力。

这样可以避免 handler 直接堆业务逻辑，也让后续 API 更容易扩展和测试。

## ToastBiz / ToastImp

`ToastBiz` 校验 `params.message`，成功后调用 `ToastImp.showToast(message)`。

`ToastImp` 只负责调用：

```ts
promptAction.showToast(...)
```

## ClipboardBiz / ClipboardImp

`ClipboardBiz` 负责：

- 校验 `system.clipboard.writeText` 的 `params.text`。
- 调用 `ClipboardImp.writeText(text)`。
- 调用 `ClipboardImp.readText()`。
- 组装写入和读取的 BridgeResponse。

`ClipboardImp` 只负责调用公开剪贴板能力：

```ts
pasteboard.createData(...)
pasteboard.getSystemPasteboard().setData(...)
pasteboard.getSystemPasteboard().getData(...)
```

## 边界收益

- BridgeController 更薄，只管通信。
- Dispatcher 只管分发。
- Registry 只管注册和查询。
- Biz 只管业务语义。
- Imp 只管系统能力。

扩展 Clipboard API 时，主链路不需要大改，说明当前架构已经具备基础扩展能力。
