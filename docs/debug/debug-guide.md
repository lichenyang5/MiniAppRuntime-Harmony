# 调试指南

这篇文档解决的问题：说明如何使用 H5 DebugPanel、console 和 RuntimeLogger 排查 JSBridge 调用链路。

## 调试入口

- H5 DebugPanel：页面内展示最近 20 条调用记录。
- H5 console：查看 `window.myascf.send`、timeout、callback lost。
- ArkTS RuntimeLogger：查看 BridgeController、Dispatcher、CallbackExecutor 等日志。

## DebugPanel 看什么

每条记录包含：

- requestId
- action
- status
- code
- message
- duration
- params JSON
- response JSON

状态包括：

```text
pending
resolve
reject
timeout
callback_lost
```

## 如何按链路排查

1. 先看 DebugPanel 是否出现 `pending` 记录。
2. 如果没有，检查 H5 按钮是否调用了 `window.myascf.send`。
3. 如果一直 pending，检查 ArkTS 是否收到 JavaScriptProxy 消息。
4. 如果返回 reject，查看 code 和 message。
5. 如果 timeout，检查 ArkTS 是否在 timeout 时间内回调 H5。
6. 如果 callback_lost，通常说明 response 迟到或页面刷新后 callback map 已丢失。

## 常见验证路径

- Toast 成功：点击 Toast 按钮，期望 `resolve`。
- 参数错误：点击参数错误按钮，期望 `reject` 和 `PARAM_ERROR`。
- 未知 action：点击 Unknown Action，期望 `UNKNOWN_ACTION`。
- Timeout：点击 Timeout，期望 `timeout`。
- Clipboard：点击写入和读取按钮，期望 `resolve`，读取结果出现在 response data 中。
- Storage：按 set/get/remove/clear 顺序验证，get 结果位于 `response.data.value`。
- URL Guard：点击外链测试按钮，期望容器进入 blocked 并显示重试入口。

## RuntimeLogger 对照

ArkTS 侧结构化日志方法：

```text
logBridgeRequest(requestId, action)
logBridgeResponse(requestId, action, code)
logBridgeError(requestId, action, code, message)
logWebLoadBegin(url)
logWebLoadProgress(url, progress)
logWebLoadEnd(url)
logWebLoadError(url, message)
logWebUrlBlocked(url, reason)
```

可以用 requestId 把 H5 DebugPanel 记录和 ArkTS 日志对齐。

## 展示建议

GitHub README 中暂时使用截图占位。后续可以补充：

- H5 Demo 首屏。
- Toast 调用成功。
- Clipboard readText 返回结果。
- DebugPanel 展开记录。
- Storage set/get 结果。
- Web 加载进度、URL Guard 和错误状态。
