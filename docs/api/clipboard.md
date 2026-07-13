# API：Clipboard

这篇文档解决的问题：记录 Clipboard API 的 action 名称、请求参数、响应结构和错误处理方式。

## Actions

```text
system.clipboard.writeText
system.clipboard.readText
```

## system.clipboard.writeText

### 请求

```json
{
  "requestId": "string",
  "action": "system.clipboard.writeText",
  "params": {
    "text": "hello from MiniAppRuntime"
  }
}
```

### 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | 是 | 要写入剪贴板的文本，不能为空 |

### 成功响应

```json
{
  "requestId": "对应请求 requestId",
  "code": 0,
  "message": "write clipboard success",
  "data": {
    "echoAction": "system.clipboard.writeText"
  }
}
```

### 参数错误

```json
{
  "requestId": "对应请求 requestId",
  "code": 1002,
  "message": "PARAM_ERROR: text is required",
  "data": {
    "echoAction": "system.clipboard.writeText"
  }
}
```

## system.clipboard.readText

### 请求

```json
{
  "requestId": "string",
  "action": "system.clipboard.readText",
  "params": {}
}
```

### 成功响应

```json
{
  "requestId": "对应请求 requestId",
  "code": 0,
  "message": "read clipboard success",
  "data": {
    "echoAction": "system.clipboard.readText",
    "text": "剪贴板内容"
  }
}
```

## 当前实现范围

- 支持写入纯文本。
- 支持读取纯文本。
- 不支持图片、富文本、多 record 解析。
- 权限与系统弹窗遵循当前 HarmonyOS SDK 和设备行为，项目不额外实现权限框架。

## H5 示例

```js
window.myascf.send("system.clipboard.writeText", {
  text: "hello from MiniAppRuntime"
})

window.myascf.send("system.clipboard.readText", {})
```
