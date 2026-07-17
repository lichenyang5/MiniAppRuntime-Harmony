# Network Request 使用指南

这篇文档解决什么问题：给出通用 `send`、typed API、双超时和 NetworkPolicy 的接入示例。

## 通用调用

```ts
const response = await client.send('network.request', {
  url: 'https://example.com/api/user',
  method: 'GET',
  headers: { Accept: 'application/json' },
  timeout: 10000,
  responseType: 'json'
}, {
  timeout: 12000
});
```

## Typed API

```ts
const api = createTypedApi(client);
const response = await api.network.request({
  url: 'https://example.com/api/user',
  method: 'GET',
  timeout: 10000,
  responseType: 'json'
}, {
  timeout: 12000
});

console.log(response.data?.statusCode);
console.log(response.data?.body);
```

H5 SDK 不执行 HTTP。它把相同 BridgeRequest 交给 `window.MyASCFNative.postMessage`，真正的请求由 HAR 内的 `NetworkImp` 调用公开 HarmonyOS 网络能力完成。

## 两种 timeout

- `params.timeout`：Native HTTP 的连接和读取超时，默认 `10000ms`。
- `options.timeout`：H5 SDK 等待整个 ArkTS 回调的超时，默认 `5000ms`。

网络调用应显式让 SDK timeout 略大于 network timeout，例如 `10000ms` 与 `12000ms`。否则 H5 Promise 可能先以 `TIMEOUT` reject，随后到达的 Native response 会被记录为 `CALLBACK_LOST`。

## Runtime 策略

```ts
const runtime = new MyASCFRuntime(controller, context, {
  allowedProtocols: ['https'],
  allowedHosts: ['api.example.com']
});
```

未传策略时允许 `http` 和 `https`，host 列表为空表示本阶段不限制 host。公开 Demo 仅验证协议和可选 allowlist；生产场景还需域名白名单、证书策略、权限和敏感信息保护。

## 调试

DebugPanel 会显示 action、requestId、duration、status 和 error code。网络记录只保留去掉 query 的 URL、Header 名称、body 长度和有限响应预览，不记录 Authorization、Cookie 或完整 body。
