# API：ui.showToast

这篇文档解决的问题：记录 `ui.showToast` 的请求参数、响应格式、错误处理和当前实现状态。

## 当前状态

`ui.showToast` 已经从 mock handler 改为真实能力：

```text
H5
-> BridgeDispatcher
-> HandlerRegistry
-> ToastBiz
-> ToastImp
-> promptAction.showToast
```

## 请求格式

```json
{
  "requestId": "string",
  "action": "ui.showToast",
  "params": {
    "message": "hello from h5"
  }
}
```

## 参数说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `message` | `string` | 是 | Toast 显示文本，不能为空字符串 |

## 成功响应

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

## 参数错误

以下调用会返回 `PARAM_ERROR`：

```js
window.myascf.send("ui.showToast", {})
window.myascf.send("ui.showToast", { message: "" })
```

错误响应：

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

## 当前限制

- 当前只支持 `message`。
- 当前 Toast 时长固定为 2000ms。
- 当前不支持 icon、position 等扩展参数。

## 下一步

等 timeout 和 callback lost 处理完善后，再考虑扩展更多 UI API。
