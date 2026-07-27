# Network API

你将学会什么：发送 GET/POST/PUT/DELETE，选择 text/json 响应，理解 HTTP 与 Bridge 状态，并取消请求。

## `network.request`

### 参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `url` | `string` | 是 | 无 | 绝对 HTTP/HTTPS URL，不允许 URL credentials |
| `method` | `GET｜POST｜PUT｜DELETE` | 否 | `GET` | GET 会忽略 body |
| `headers` | `Record<string,string>` | 否 | 无 | 名称和值禁止 CR/LF |
| `body` | `string` | 否 | 无 | 非 GET 请求体，JSON 需先 stringify |
| `timeout` | `number` | 否 | `10000` | Native timeout，1000–30000ms |
| `responseType` | `text｜json` | 否 | `text` | json 只接受对象、数组或 null |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | `boolean` | statusCode 是否 2xx |
| `statusCode` | `number` | 真实 HTTP 状态 |
| `statusText` | `string?` | 已知状态的标准文本 |
| `headers` | `Record<string,string>` | 响应头 |
| `body` | `string｜object｜array｜null` | text 或解析后的 JSON |
| `duration` | `number` | Native 请求耗时 ms |

### GET 与 POST

```ts
await api.network.request({
  url: 'https://example.com',
  method: 'GET',
  responseType: 'text'
});

await api.network.request({
  url: 'https://httpbin.org/post',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hello: 'HarmonyOS' }),
  responseType: 'json'
});
```

公共测试服务仅用于演示，请替换为自己的可控服务。

### HTTP 与错误

200/201/204 resolve 且 `ok=true`；404/500 也 resolve，但 `ok=false`。DNS、连接失败、非法协议、Native timeout、无效 JSON 和取消 reject。`maxRedirects` 为 0。

可能错误：`PARAM_ERROR`、`NETWORK_INVALID_URL`、`NETWORK_UNSUPPORTED_PROTOCOL`、`NETWORK_TIMEOUT`、`NETWORK_REQUEST_FAILED`、`NETWORK_INVALID_RESPONSE`、`NETWORK_ABORTED`、H5 `TIMEOUT`、`CALLBACK_LOST`。

### React 与取消

```tsx
const controller = new AbortController();
void api.network.request({
  url: 'https://httpbin.org/delay/10',
  timeout: 15000
}, { timeout: 17000, signal: controller.signal }).catch(setError);
controller.abort();
```

### 权限与实现链路

宿主需要 `ohos.permission.INTERNET`。H5 SDK → NetworkBiz → NetworkImp → NetworkKit `HttpRequest`；取消通过 internal `network.abort` 和 `destroy()` 协作。

## 下一步阅读

- [Network 示例](../examples/network.md)
- [超时与取消](../guide/timeout-and-cancellation.md)
