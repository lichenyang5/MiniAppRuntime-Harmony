# requestId 与 callback map

你将学会什么：并发 Promise 为什么需要 requestId，以及 timeout、取消和晚到响应怎样清理状态。

`action` 只能说明“做什么”，不能说明“这是第几次请求”。SDK 为每次发送生成 `myascf_...` requestId，并在 `Map<string, CallbackRecord>` 中保存 resolve、reject、timer、action、params 和创建时间。

Native 响应带回同一个 requestId 后，SDK 使用 `take()` 读取并删除 callback。timeout 和主动取消都会删除 callback，并清理 timer 与 AbortSignal listener。取消后的晚到响应记录为 `LATE_RESPONSE_AFTER_ABORT`；普通晚到响应找不到 callback 时记录 `CALLBACK_LOST`。

## 下一步阅读

- [超时与取消](../guide/timeout-and-cancellation.md)
- [BridgeResponse](bridge-response.md)
