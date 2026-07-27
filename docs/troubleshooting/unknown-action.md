# UNKNOWN_ACTION

你将学会什么：定位 SDK action、Manifest 和 Runtime 注册表不一致。

**出现条件：** Dispatcher 在 HandlerRegistry 中找不到 action。

**现象：** Promise reject，Runtime code `1001`，message 为 `Unknown action: ...`。

```ts
const list = await api.runtime.getApiList();
console.log(list.data?.apis?.map((item) => item.action));
```

检查包版本、ActionNames、Manifest、RuntimeBootstrap 和生成的 typed API。不要通过修改 BridgeController 增加 action。

## 下一步阅读

- [API Manifest](../concepts/api-manifest.md)
- [扩展 API](../guide/extending-api.md)
