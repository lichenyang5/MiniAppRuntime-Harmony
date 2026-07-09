# 错误码

这篇文档解决的问题：记录 JSBridge 统一错误码，方便 H5 侧根据 `code` 做 resolve / reject 和页面展示。

## 当前错误码

```text
SUCCESS         0
UNKNOWN_ACTION 1001
PARAM_ERROR    1002
INTERNAL_ERROR 1003
CALLBACK_LOST  1004
TIMEOUT        1005
```

## SUCCESS

成功响应：

```json
{
  "requestId": "对应请求 requestId",
  "code": 0,
  "message": "mock handler success from BridgeDispatcher",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

## UNKNOWN_ACTION

当 `BridgeDispatcher` 在 `HandlerRegistry` 中找不到 action 时返回。

```json
{
  "requestId": "对应请求 requestId",
  "code": 1001,
  "message": "Unknown action: xxx",
  "data": {}
}
```

当前已实现。

## INTERNAL_ERROR

当 handler 执行过程中抛出异常时返回。

```json
{
  "requestId": "对应请求 requestId",
  "code": 1003,
  "message": "Internal error while handling bridge request.",
  "data": {}
}
```

当前已实现。

## 尚未实现的错误

- `PARAM_ERROR`：后续由 ToastBiz 参数校验阶段使用。
- `CALLBACK_LOST`：后续由回调治理阶段记录。
- `TIMEOUT`：后续由超时控制阶段实现。

## ArkTS 类型注意

错误响应中的 `data` 不能使用未声明对象字面量。当前使用显式 `BridgeResponseData` 类型承载空数据。
