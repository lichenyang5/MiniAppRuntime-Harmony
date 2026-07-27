# 错误处理

你将学会什么：区分 H5 环境错误、Bridge 错误、Runtime 错误、Network 错误和 HTTP 状态。

```ts
try {
  const response = await api.network.request({
    url: 'https://example.com/not-found',
    responseType: 'text'
  });
  if (!response.data?.ok) {
    console.warn('HTTP failed', response.data?.statusCode);
  }
} catch (error: unknown) {
  console.error('Bridge rejected', error);
}
```

| 错误 | 出现条件 | 判断方式 |
| --- | --- | --- |
| `NATIVE_UNAVAILABLE` | 不在已注入 Proxy 的 ArkWeb 中 | code `1006`，message 含名称 |
| `TIMEOUT` | H5 callback 超时 | SDK code `1005` |
| `CALLBACK_LOST` | 响应找不到 callback | 全局 lost hook / DebugPanel |
| `INVALID_RESPONSE` | Native 响应不是合法协议 | SDK code `1007` |
| `UNKNOWN_ACTION` | Registry 没有 action | Runtime code `1001` |
| `PARAM_ERROR` | Biz 参数校验失败 | Runtime code `1002` |
| `INTERNAL_ERROR` | handler 未处理异常 | Runtime code `1003` |
| `ABORTED` | AbortSignal 主动取消 | `MyASCFAbortError`, name `AbortError` |
| Network 1101–1106 | URL、协议、timeout、连接、响应或取消错误 | BridgeResponse code |

注意：SDK 的 `NATIVE_UNAVAILABLE=1006` 与 Runtime 的 `PARSE_ERROR=1006` 属于不同错误域，应结合消息和发生位置判断。HTTP 非 2xx 不是 Bridge 错误。

## 下一步阅读

- [错误码](../api/error-code.md)
- [Troubleshooting](../troubleshooting/native-unavailable.md)
