# TIMEOUT

你将学会什么：区分 H5 callback timeout 与 Native Network timeout。

**H5 TIMEOUT：** 默认 5000ms 内没有匹配响应，SDK 清理 callback/timer/listener 并 reject code `1005`。

**NETWORK_TIMEOUT：** Runtime 的 HTTP 请求超过 params.timeout，reject code `1103`。

```ts
await api.network.request({ url, timeout: 10000 }, { timeout: 12000 });
```

若 H5 timeout 更短，它可能先结束，Native 的后续响应会成为晚到响应。检查 requestId、ArkTS 日志、NetworkKit 错误和 `runJavaScript` 回调。

## 下一步阅读

- [超时与取消](../guide/timeout-and-cancellation.md)
- [Network 排障](network-request.md)
