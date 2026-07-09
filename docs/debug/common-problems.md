# 常见问题

这篇文档解决的问题：收集后续开发中常见的 ArkWeb / JSBridge 问题和排查方向。

## 当前状态

当前尚未形成完整问题库，后续阶段补充。

## 已知排查方向

### H5 页面没有显示

检查 `Index.ets` 是否使用 `$rawfile('web/index.html')` 加载本地页面。

### H5 调不到 ArkTS

检查 `javaScriptProxy` 注入名称是否为 `MyASCFNative`，H5 是否调用 `window.MyASCFNative.postMessage`。

### H5 Promise 没有 resolve

检查 ArkTS 是否通过 `runJavaScript` 调用了 `window.__myascf_on_native_response__`，并确认 response 中的 `requestId` 和 callback map 中的一致。

### 请求出现 TIMEOUT

检查 ArkTS 是否在 timeout 时间内返回 response。默认 timeout 是 5000ms，也可以通过 `window.myascf.send(action, params, { timeout })` 调整。

如果 timeout 很短，例如 1ms，真实 response 可能会迟到。这种情况会先 reject TIMEOUT，随后迟到 response 会进入 CALLBACK_LOST。

### 出现 CALLBACK_LOST

CALLBACK_LOST 表示 H5 收到了 response，但 callback map 中已经找不到对应 requestId。

常见原因：

- 请求已 timeout。
- 页面刷新或重新加载。
- response 中的 requestId 异常。

当前处理方式是输出 warning 并追加 demo 事件日志，不会影响其他请求。
