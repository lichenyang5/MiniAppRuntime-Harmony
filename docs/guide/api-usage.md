# API 使用方式

你将学会什么：在 typed helper 与底层 `send` 之间选择，并理解真实请求结构。

推荐 typed API：

```ts
const api = createTypedApi(initMyASCF());
const response = await api.system.storage.getItem({ key: 'username' });
console.log(response.data?.value);
```

底层接口适合调试协议：

```ts
const client = initMyASCF();
await client.send('ui.showToast', { message: 'Hello' }, { timeout: 5000 });
```

发送给 ArkTS 的 JSON 是：

```json
{
  "requestId": "myascf_...",
  "action": "ui.showToast",
  "params": { "message": "Hello" }
}
```

当前公开 API：`runtime.getApiList`、Toast、Clipboard 两项、Storage 四项和 `network.request`。完整参数与响应见 [API Reference](../api/README.md)。

## 下一步阅读

- [API Reference](../api/README.md)
- [BridgeResponse](../concepts/bridge-response.md)
