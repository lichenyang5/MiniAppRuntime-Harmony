# Network 场景

你将学会什么：发送 GET/POST、判断非 2xx、配置双 timeout 并主动取消。

```ts
const response = await api.network.request({
  url: 'https://example.com',
  method: 'GET',
  responseType: 'text',
  timeout: 10000
}, { timeout: 12000 });

if (!response.data?.ok) {
  console.warn(response.data?.statusCode);
}
```

```ts
await api.network.request({
  url: 'https://httpbin.org/post',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ source: 'demo' }),
  responseType: 'json'
});
```

```ts
const controller = new AbortController();
const task = api.network.request({
  url: 'https://httpbin.org/delay/10',
  timeout: 15000
}, { timeout: 17000, signal: controller.signal });
controller.abort();
await task;
```

404/500 resolve 且 `ok=false`；连接失败、Native timeout、H5 timeout 和取消 reject。公共服务只用于演示。

## 下一步阅读

- [Network API](../api/network.md)
- [超时与取消](../guide/timeout-and-cancellation.md)
