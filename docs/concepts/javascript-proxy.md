# JavaScriptProxy

你将学会什么：ArkWeb 怎样把一个 ArkTS 方法注入 H5，以及普通浏览器为什么没有它。

Runtime 的 Proxy 名称固定为 `MyASCFNative`，methodList 只有 `postMessage`：

```js
window.MyASCFNative.postMessage(JSON.stringify(request));
```

`JavaScriptProxy.postMessage` 只把原始字符串交给 `BridgeController`，不处理业务参数。普通浏览器没有 ArkWeb 的 `.javaScriptProxy(...)` 注入，因此 SDK 会 reject `NATIVE_UNAVAILABLE`。

## 下一步阅读

- [ArkWeb 接入](../guide/arkweb-integration.md)
- [NATIVE_UNAVAILABLE 排查](../troubleshooting/native-unavailable.md)
