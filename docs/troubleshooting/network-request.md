# Network 请求问题

你将学会什么：区分参数、HTTP、连接、timeout、JSON 和取消错误。

| 现象 | 归属 | 排查 |
| --- | --- | --- |
| 404/500 且 Promise resolve | HTTP | 看 `data.ok=false` 和 statusCode |
| `NETWORK_INVALID_URL` | 参数/策略 | 检查绝对 URL、credentials、allowedHosts |
| `NETWORK_UNSUPPORTED_PROTOCOL` | 参数/策略 | 只允许配置中的 HTTP/HTTPS |
| `NETWORK_TIMEOUT` | Native | 调整 params.timeout，检查网络 |
| `TIMEOUT` | H5 callback | options.timeout 应略大于 Native timeout |
| `NETWORK_REQUEST_FAILED` | DNS/连接/Native | 检查设备网络、权限和服务地址 |
| `NETWORK_INVALID_RESPONSE` | 响应解析 | json 模式要求对象、数组或 null |
| `AbortError / ABORTED` | 用户取消 | 检查 AbortController 调用 |

POST 404 通常表示服务端没有对应 POST 路由，不代表 JavaScriptProxy 或 NetworkImp 没工作。确认 URL、method、Content-Type 和 body 与服务端约定一致。

## 下一步阅读

- [Network API](../api/network.md)
- [超时与取消](../guide/timeout-and-cancellation.md)
