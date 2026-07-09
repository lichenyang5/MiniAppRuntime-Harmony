# 常见问题

这篇文档解决的问题：收集后续开发中常见的 ArkWeb / JSBridge 问题和排查方向。

## 当前状态

当前尚未形成完整问题库，后续阶段补充。

## 已知排查方向

### H5 页面没有显示

检查 `Index.ets` 是否使用 `$rawfile('web/index.html')` 加载本地页面。

### H5 调不到 ArkTS

检查 `javaScriptProxy` 注入名称是否为 `MyASCFNative`，H5 是否调用 `window.MyASCFNative.postMessage`。

### H5 Promise 没有 resolve

检查 ArkTS 是否通过 `runJavaScript` 调用了 `window.__myascf_on_native_response__`，并确认 response 中的 `requestId` 和 callback map 中的一致。
