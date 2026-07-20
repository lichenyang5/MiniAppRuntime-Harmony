# network.abort

这篇文档解决什么问题：说明 H5 SDK 如何通过内部 Bridge action 请求 Runtime 取消一个仍在执行的 `network.request`。

## 定位

`network.abort` 是 `internal: true` 的运行时 action。它经过 JavaScriptProxy、Dispatcher 和 HandlerRegistry，但不会出现在 `runtime.getApiList`、公开 API 表或 `createTypedApi` 中。业务代码应使用 `AbortController`，不要直接依赖该 action。

## 请求协议

```json
{
  "requestId": "abort_action_request_id",
  "action": "network.abort",
  "params": {
    "targetRequestId": "original_network_request_id"
  }
}
```

`network.abort` 自身有独立 `requestId`，`targetRequestId` 指向原始网络请求。

## 响应协议

找到仍活跃的请求：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "targetRequestId": "original_network_request_id",
    "aborted": true
  }
}
```

请求已经完成或不存在时保持幂等，不抛出不可控异常：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "targetRequestId": "original_network_request_id",
    "aborted": false,
    "reason": "REQUEST_NOT_FOUND"
  }
}
```

## 底层边界

当前 API 23 SDK 的 `http.HttpRequest` 公开 `destroy()`，没有 `abort()`、`cancel()` 或 `close()`。Runtime 调用 `destroy()` 并同时结束本地 abort race，因此这是 best-effort cancellation：H5 会立即停止等待，但不同系统版本和网络阶段下，不能承诺远端已经停止处理请求。

## 相关文档

- [network.request](network-request.md)
- [请求生命周期](../architecture/request-lifecycle.md)
