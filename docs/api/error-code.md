# 错误码

这篇文档解决的问题：记录 JSBridge 统一错误码，方便 H5 侧根据 `code` 做 resolve / reject、timeout 和 callback lost 展示。

每个 action 可能返回的错误名称同时记录在 `BUILTIN_API_MANIFEST`；错误码数值仍以 `BridgeErrorCode.ets` 为准。

## 当前错误码

```text
SUCCESS         0
UNKNOWN_ACTION 1001
PARAM_ERROR    1002
INTERNAL_ERROR 1003
CALLBACK_LOST  1004
TIMEOUT        1005
PARSE_ERROR    1006
```

## SUCCESS

成功响应：

```json
{
  "requestId": "对应请求 requestId",
  "code": 0,
  "message": "showToast success",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

## UNKNOWN_ACTION

当 `BridgeDispatcher` 在 `HandlerRegistry` 中找不到 action 时返回。

当前已实现。

## PARAM_ERROR

当 Toast、Clipboard 或 Storage Biz 参数校验失败时返回。

```json
{
  "requestId": "对应请求 requestId",
  "code": 1002,
  "message": "PARAM_ERROR: message is required",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

## INTERNAL_ERROR

当 handler 执行过程中抛出异常时，`BridgeDispatcher` 捕获并返回。

## CALLBACK_LOST

当 H5 收到 response，但 callback map 中已经找不到对应 requestId 时出现。

常见原因：

- 请求已经 timeout。
- 页面刷新导致 callback map 清空。
- requestId 不匹配。

当前 H5 会输出 console.warn，并追加 demo 事件日志，不会抛出阻断错误。

## TIMEOUT

当 H5 在指定时间内没有收到 ArkTS response 时出现。

默认 timeout 为 5000ms，可通过第三个参数覆盖：

```js
window.myascf.send("ui.showToast", { message: "hello" }, { timeout: 1000 })
```

## PARSE_ERROR

当 ArkTS 侧无法解析 raw message，或请求缺少必要字段时返回。

如果无法解析出 requestId，ArkTS 会使用空字符串作为 requestId。这个响应可能无法被 H5 callback map 匹配，因此会被 H5 识别为 callback lost。

## ArkTS 类型注意

错误响应中的 `data` 使用显式 `BridgeResponseData` 类型承载，避免未声明对象字面量。
