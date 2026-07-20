# Network Request Lifecycle

这篇文档解决什么问题：解释并发 `network.request` 从创建、完成、超时到取消的资源所有权，以及竞态发生时如何保证只 settle 一次。

## 调用链

```text
AbortController.abort()
-> H5 SDK take callback and cleanup timer/listener
-> original Promise rejects AbortError / ABORTED
-> internal network.abort(targetRequestId)
-> BridgeDispatcher / HandlerRegistry
-> NetworkRequestRegistry.abort(targetRequestId)
-> ActiveNetworkRequest.destroy()
-> NetworkImp abort race rejects
-> original late callback is classified as LATE_RESPONSE_AFTER_ABORT
```

## H5 SDK 生命周期

每个 callback record 保存 resolve、reject、timer、action、params、创建时间和 abort listener cleanup。成功、Bridge reject、非法响应、SDK timeout 和主动取消都通过同一个 cleanup 入口释放 timer 与 listener。

发送前 `signal.aborted` 时不会调用 `postMessage`。发送后取消时，SDK 先从 callback map 取出原 callback，再 reject `MyASCFAbortError`，因此后续事件无法重复 settle。

已取消 requestId 会暂存在容量 100、TTL 30 秒的集合中。晚到响应会记录为 `LATE_RESPONSE_AFTER_ABORT`，不会触发普通 `CALLBACK_LOST`；集合按访问清理并有容量上限，不会无限增长。

## Runtime Registry

`NetworkRequestRegistry` 只保存 `requestId -> NetworkRequestHandle`，不长期保存完整 BridgeRequest、URL、Header 或 Body。

请求结束时由 owner 携带原 handle 做身份校验后移除。即使外部绕过 SDK 复用了同一个 requestId，旧请求的 `finally` 也不会误删后来注册的新请求。

- 请求创建后、发起 HTTP 前注册。
- HTTP 成功、失败、Native timeout、主动取消后在 `finally` 删除。
- `network.abort` 只操作目标 requestId，不影响其他并发请求。
- `clear()` 会 best-effort 终止并移除所有活跃句柄。

## 竞态规则

`ActiveNetworkRequest` 使用 `ACTIVE / COMPLETED / ABORTED / TIMED_OUT` 状态。HTTP Promise、Native timeout Promise 与 abort Promise 参加同一个 race，只有 `ACTIVE` 可以转入终态。

| 终止原因 | H5 结果 | 错误标识 |
| --- | --- | --- |
| 用户调用 `AbortController.abort()` | reject | `AbortError` / `ABORTED` |
| SDK 等待回调超时 | reject | `TIMEOUT` |
| ArkTS HTTP 请求超时 | reject | `NETWORK_TIMEOUT` |
| 有效 HTTP 404/500 | resolve | `data.ok=false` |

取消与 HTTP 完成同时发生时，先取得 callback 或先改变 Runtime active state 的一方获胜。另一条晚到路径只负责清理，不会再次 resolve/reject。

## 能力边界

本实现不增加 download、upload、WebSocket、重试或 Cookie 管理，也不宣称是生产级网络调度框架。底层取消只使用当前公开 SDK 的 `destroy()`。
