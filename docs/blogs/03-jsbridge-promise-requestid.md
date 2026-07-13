# 用 Promise 和 requestId 设计 H5 到 ArkTS 的 JSBridge

这篇文档解决什么问题：解释 H5 调用 ArkTS 时，为什么需要 requestId、callback map 和统一响应协议。

```js
const response = await window.myascf.send('ui.showToast', {
  message: 'hello from h5'
});
```

`send` 生成唯一 requestId，把 resolve、reject、timer、action 和 params 放入 callback map，再通过 `window.MyASCFNative.postMessage(JSON.stringify(request))` 把消息交给 JavaScriptProxy。

ArkTS 响应顺序不一定与请求顺序一致。requestId 让 H5 能找到准确的 Promise：

```json
{
  "requestId": "request-id",
  "code": 0,
  "message": "success",
  "data": {}
}
```

ArkTS 通过 BridgeCallbackExecutor 执行 `runJavaScript`，调用 H5 全局 response callback。H5 根据 code 决定 resolve 或 reject，并清理 timer 和 callback。

统一异步回调适合系统能力和超时治理，也让所有 action 共享同一协议。当前协议已经承载 Toast、Clipboard 和 Storage，并随 runtime 进入本地 HAR。DebugPanel 通过 requestId 展示 action、状态、耗时、参数和响应。
