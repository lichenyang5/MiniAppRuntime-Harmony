# API：ui.showToast

这篇文档解决的问题：记录后续 `ui.showToast` API 的设计意图、请求参数、返回结构和实现阶段。

## 当前状态

当前尚未实现真实 Toast 能力，后续阶段补充。

当前 H5 已经会发送：

```json
{
  "action": "ui.showToast",
  "params": {
    "message": "hello from h5"
  }
}
```

但 ArkTS 当前只返回 mock response，不调用 `promptAction.showToast`。

## 后续计划

- Dispatcher 注册 `ui.showToast`。
- ToastBiz 校验 `message`。
- ToastImp 调用公开 HarmonyOS Toast 能力。
- 返回标准 BridgeResponse。
