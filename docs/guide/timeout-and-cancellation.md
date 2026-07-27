# 超时与取消

你将学会什么：区分 Native HTTP timeout 和 H5 callback timeout，并正确使用 AbortController。

Network params 中的 `timeout` 是 Native timeout，默认 10000ms，允许 1000–30000ms。send options 中的 `timeout` 是 H5 callback timeout，默认 5000ms。

对于 Network，推荐显式让 H5 timeout 略大于 Native timeout：

```ts
await api.network.request({
  url: 'https://example.com',
  timeout: 10000
}, {
  timeout: 12000
});
```

主动取消：

```ts
const controller = new AbortController();
const task = api.network.request({
  url: 'https://httpbin.org/delay/10',
  timeout: 15000
}, { signal: controller.signal, timeout: 17000 });

controller.abort();

try {
  await task;
} catch (error: unknown) {
  console.error(error);
}
```

SDK 取消时清理 callback、timer 和 listener。已发送的 Network 请求会触发 internal `network.abort`，Runtime 使用 `HttpRequest.destroy()` 做 best-effort 终止。晚到响应被忽略并记录，不会二次 settle。

示例中的公共测试服务仅用于演示，请在长期项目中替换为自己的可控服务。

## 下一步阅读

- [Timeout 排查](../troubleshooting/timeout.md)
- [requestId 与 callback map](../concepts/request-id-and-callback-map.md)
