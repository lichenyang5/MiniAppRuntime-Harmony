# NATIVE_UNAVAILABLE

你将学会什么：判断 SDK 是否运行在正确的 ArkWeb 容器，以及 Proxy 是否完成注入。

**出现条件：** `window.MyASCFNative` 不存在，或没有 `postMessage` 方法。

**现象：** Promise reject，SDK code 为 `1006`，message 提示 Native bridge unavailable。普通浏览器中这是预期行为。

```js
console.log(typeof window.MyASCFNative, typeof window.MyASCFNative?.postMessage);
```

确认 ArkWeb 已调用 `.javaScriptProxy(...)`，name 是 `MyASCFNative`，methodList 包含 `postMessage`，并在页面加载完成后再发请求。

## 下一步阅读

- [ArkWeb 接入](../guide/arkweb-integration.md)
- [调试](../guide/debugging.md)
