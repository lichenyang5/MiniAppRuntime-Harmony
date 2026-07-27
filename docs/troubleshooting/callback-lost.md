# CALLBACK_LOST

你将学会什么：理解“Native 有响应，但 H5 已找不到原 Promise”的场景。

**出现条件：** 响应 requestId 不在 callback map。常见原因是 H5 已 timeout、页面刷新、重复回调或错误 requestId。

**现象：** `window.__myascf_on_callback_lost__` 或 DebugPanel 收到 code `1004`。

```js
window.__myascf_on_callback_lost__ = (detail) => console.warn(detail);
```

按 requestId 对比发送日志、ArkTS BridgeResponse 和 H5 回调日志。Abort 后的晚到响应属于 `LATE_RESPONSE_AFTER_ABORT`，SDK 会单独忽略，不应误报 CALLBACK_LOST。

## 下一步阅读

- [requestId 与 callback map](../concepts/request-id-and-callback-map.md)
- [调试](../guide/debugging.md)
