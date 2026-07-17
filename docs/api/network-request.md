# network.request

这篇文档解决什么问题：说明 `network.request` 的请求参数、响应数据、错误语义和 HTTP 状态码策略。

`network.request` 通过 ArkTS Runtime 执行 HTTP/HTTPS 请求。H5 SDK 只封装 JSBridge 请求、Promise 生命周期和回调超时，不直接访问网络。

## 请求

```ts
await window.myascf.send('network.request', {
  url: 'https://example.com/api/user',
  method: 'GET',
  headers: { Accept: 'application/json' },
  timeout: 10000,
  responseType: 'json'
}, {
  timeout: 12000
});
```

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `url` | `string` | 是 | - | 绝对 HTTP/HTTPS URL |
| `method` | `GET \| POST \| PUT \| DELETE` | 否 | `GET` | 当前 SDK 公开枚举支持的方法 |
| `headers` | `Record<string, string>` | 否 | - | Header value 必须是字符串 |
| `body` | `string` | 否 | - | GET 会忽略 body |
| `timeout` | `number` | 否 | `10000` | Native 整体请求截止时间，范围 `1000-30000ms` |
| `responseType` | `text \| json` | 否 | `text` | JSON 模式会在 Biz 层解析响应 |

当前 SDK 的公开 `RequestMethod` 枚举没有 `PATCH`，因此 v0.2.0 不通过类型强转伪装支持；传入其他 method 会返回 `PARAM_ERROR`。

URL 不允许携带 `username:password@host` 凭据，Header name/value 不允许空名称或 CR/LF。Native 请求关闭自动重定向，避免 allowlist 被 30x 跳转绕过；遇到 3xx 时不会自动访问 `Location` 目标，具体响应或错误形态以当前 NetworkKit 行为为准。

## 响应

```json
{
  "requestId": "myascf_xxx",
  "code": 0,
  "message": "network request success",
  "data": {
    "statusCode": 200,
    "headers": {},
    "body": {},
    "duration": 18
  }
}
```

`body` 在 `text` 模式下为字符串，在 `json` 模式下为对象或数组。JSON 无法解析时返回 `NETWORK_INVALID_RESPONSE`。

## HTTP 与 Bridge 状态

HTTP `4xx/5xx` 仍是有效 HTTP 响应，Bridge 外层 `code` 保持 `SUCCESS`，业务方读取 `data.statusCode`。DNS、连接失败、网络超时和响应解析失败才会形成 Bridge reject。

## 错误

- `PARAM_ERROR`：缺少 URL、method/header/timeout/responseType/body 非法。
- `NETWORK_INVALID_URL`：URL 无法解析或 host 不符合策略。
- `NETWORK_UNSUPPORTED_PROTOCOL`：不是允许的 HTTP/HTTPS 协议。
- `NETWORK_TIMEOUT`：HarmonyOS 网络请求本身超时。
- `NETWORK_REQUEST_FAILED`：DNS、连接或其他 Native 请求失败。
- `NETWORK_INVALID_RESPONSE`：Native 响应或 JSON body 不符合约定。
- `TIMEOUT`：H5 SDK 等待整个 Native 回调链路超时。

## 权限

示例 entry 在 `module.json5` 声明 `ohos.permission.INTERNET`。接入方仍需结合应用场景配置域名策略、隐私说明和权限，并在目标设备验证。
