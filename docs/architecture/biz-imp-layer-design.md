# Biz / Imp 分层设计

这篇文档解决的问题：说明为什么要把业务校验和 HarmonyOS 系统能力调用拆成 Biz / Imp 两层，并用 `ui.showToast` 展示当前实现。

## 当前状态

当前已经完成 `ui.showToast` 的 Biz / Imp 分层：

```text
ui.showToast handler
-> ToastBiz
-> ToastImp
-> promptAction.showToast
```

## 分层目标

- `Biz`：负责参数校验、业务语义、标准响应。
- `Imp`：负责调用公开 HarmonyOS 系统能力。

这样可以避免 handler 直接堆业务逻辑，也让后续 API 更容易扩展和测试。

## ToastBiz

`ToastBiz` 接收 `BridgeRequest`，负责：

- 校验 `params.message`。
- 参数错误时返回 `PARAM_ERROR`。
- 参数正确时调用 `ToastImp.showToast(message)`。
- 成功后返回 `showToast success`。

`ToastBiz` 不持有 WebviewController，不调用 H5，不负责 action 注册。

## ToastImp

`ToastImp` 只接收业务参数：

```text
message: string
```

然后调用：

```ts
promptAction.showToast({
  message: message,
  duration: 2000
})
```

`ToastImp` 不关心 H5 协议、requestId、错误码和 Dispatcher。

## 边界收益

- BridgeController 更薄，只管通信。
- Dispatcher 只管分发。
- Registry 只管注册和查询。
- Biz 只管业务语义。
- Imp 只管系统能力。

这条边界是后续接入更多 API 的基础。
