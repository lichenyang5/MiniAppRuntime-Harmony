# 调试 JSBridge

你将学会什么：检查四个全局边界，并按请求链路定位问题。

```js
JSON.stringify({
  myascfType: typeof window.myascf,
  nativeType: typeof window.MyASCFNative,
  postMessageType: typeof window.MyASCFNative?.postMessage,
  callbackType: typeof window.__myascf_on_native_response__
})
```

正常情况下四项都应是 `object/function`。DebugPanel 通过 `window.MyASCFDebugPanel` 接收 start/end/error/lost/abort/late-after-abort 记录，关键字段是 requestId、action、status、code 和 duration。

排查顺序：页面是否加载；SDK 是否加载；Native Proxy 是否注入；postMessage 是否进入 ArkTS；Dispatcher 是否找到 Handler；Imp 是否执行；runJavaScript 是否回调；requestId 是否匹配。

Network 调试要同时看 Bridge RESOLVED/REJECTED、HTTP status、`ok`、duration 和 error code。日志会隐藏 Authorization、Cookie、URL query 和过长 body。

## 下一步阅读

- [CALLBACK_LOST](../troubleshooting/callback-lost.md)
- [ArkWeb 白屏](../troubleshooting/arkweb-white-screen.md)
