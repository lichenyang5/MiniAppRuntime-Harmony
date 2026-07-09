# 调试指南

这篇文档解决的问题：说明如何使用 H5 DebugPanel、console 和 RuntimeLogger 排查 JSBridge 调用链路。

## 当前调试入口

- H5 DebugPanel：页面内展示最近 20 条调用记录。
- H5 console：查看 `window.myascf.send`、TIMEOUT、CALLBACK_LOST。
- ArkTS HiLog：查看 BridgeController、Dispatcher、CallbackExecutor 日志。

## DebugPanel 能看到什么

每条记录展示：

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

## 如何验证常见路径

- 正常调用：点击 `ui.showToast`。
- 参数错误：点击 Toast 参数错误或 Clipboard 参数错误。
- 未知 action：点击未知 action 测试。
- timeout：点击 Timeout 测试。
- callback lost：timeout 后迟到 response 会被记录为 callback_lost。

## RuntimeLogger 对照

ArkTS 侧补充了这些结构化日志方法：

```text
logBridgeRequest(requestId, action)
logBridgeResponse(requestId, action, code)
logBridgeError(requestId, action, code, message)
```

可以用 requestId 把 H5 DebugPanel 记录和 ArkTS HiLog 对齐。
