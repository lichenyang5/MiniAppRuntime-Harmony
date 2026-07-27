# BridgeResponse

你将学会什么：统一响应怎样让 Promise、错误处理、DebugPanel 和 Network 状态保持一致。

```ts
interface BridgeResponse {
  requestId: string;
  code: number;
  message: string;
  data?: Record<string, unknown>;
  action?: string;
  duration?: number;
}
```

Runtime 提供前四个字段；SDK 收到后补充 action 与 H5 端总 duration。`code === 0` resolve，其余 code reject。

Network 有第二层状态：HTTP 404/500 仍 resolve，但 `data.ok` 为 false。DNS、连接失败、Native timeout、无效 JSON 和取消进入错误链路。

## 下一步阅读

- [错误处理](../guide/error-handling.md)
- [Network API](../api/network.md)
