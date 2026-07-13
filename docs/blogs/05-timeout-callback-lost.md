# JSBridge 的异步治理：Timeout 与 Callback Lost

这篇文档解决什么问题：说明跨端请求迟到、丢失或页面重载时，Promise 如何结束而不是永久 pending。

`window.myascf.send` 为每个 requestId 创建 timer。超过默认 5000ms 仍未收到响应时，H5 删除 callback，reject TIMEOUT，并在 DebugPanel 记录耗时：

```js
window.myascf.send('ui.showToast', { message: 'hello' }, { timeout: 1000 });
```

如果响应在 timeout 后才到达，或页面重载清空了 callback map，H5 无法找到 requestId。此时记录 CALLBACK_LOST，而不是再次 resolve 已结束的 Promise，也不影响其他请求。

BridgeCallbackExecutor 统一负责 JSON 转义和 `runJavaScript`，避免 Controller、Biz 或 Handler 各自拼接脚本。H5 全局 callback 再统一完成 map 查询、timer 清理和 resolve/reject。

DebugPanel 展示 pending、resolve、reject、timeout、callback_lost，以及 action、requestId、code、message 和 duration。当前这些机制已随 runtime 进入本地 HAR，Toast、Clipboard 和 Storage 共用同一回调出口。
