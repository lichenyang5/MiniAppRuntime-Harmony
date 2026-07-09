# 错误码

这篇文档解决的问题：记录 JSBridge 后续需要统一的错误码，方便 H5 侧做 reject 和页面展示。

## 当前状态

当前尚未实现完整错误处理，后续阶段补充。

## 预留错误码

```text
SUCCESS         0
UNKNOWN_ACTION 1001
PARAM_ERROR    1002
INTERNAL_ERROR 1003
CALLBACK_LOST  1004
TIMEOUT        1005
```

## 后续计划

- Dispatcher 未找到 action 时返回 `UNKNOWN_ACTION`。
- Biz 参数校验失败时返回 `PARAM_ERROR`。
- Imp 调用异常时返回 `INTERNAL_ERROR`。
- H5 callback 丢失时记录 `CALLBACK_LOST`。
- 请求超时时返回 `TIMEOUT`。
