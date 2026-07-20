<!-- AUTO-GENERATED: DO NOT EDIT DIRECTLY -->

# Generated API Manifest

Generated from `tools/api-manifest.json` by `npm run docs:api`.

## runtime.getApiList

- Title: 获取 API 列表
- Category: `runtime`
- Status: Implemented
- Biz: `RuntimeInfoBiz`
- Imp: `-`

返回当前 runtime 内置 API Manifest 的精简信息。

### Params

-

### Response

| Name | Type | Description |
| --- | --- | --- |
| `apis` | `ApiSummary[]` | 当前 runtime 支持的 API 简要列表。 |

### Errors

`INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("runtime.getApiList", {})
```

## ui.showToast

- Title: 显示 Toast
- Category: `ui`
- Status: Implemented
- Biz: `ToastBiz`
- Imp: `ToastImp`

从 H5 侧触发 HarmonyOS Toast 提示。

### Params

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | `string` | Yes | Toast 展示的文本内容。 |

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |

### Errors

`PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("ui.showToast", { message: "hello" })
```

## system.clipboard.writeText

- Title: 写入剪贴板
- Category: `system`
- Status: Implemented
- Biz: `ClipboardBiz`
- Imp: `ClipboardImp`

向 HarmonyOS 系统剪贴板写入纯文本。

### Params

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | `string` | Yes | 写入剪贴板的文本。 |

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |

### Errors

`PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("system.clipboard.writeText", { text: "hello" })
```

## system.clipboard.readText

- Title: 读取剪贴板
- Category: `system`
- Status: Implemented
- Biz: `ClipboardBiz`
- Imp: `ClipboardImp`

读取 HarmonyOS 系统剪贴板中的纯文本。

### Params

-

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |
| `text` | `string` | 读取到的剪贴板文本。 |

### Errors

`INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("system.clipboard.readText", {})
```

## system.storage.setItem

- Title: 写入本地存储
- Category: `system`
- Status: Implemented
- Biz: `StorageBiz`
- Imp: `StorageImp`

向 Preferences 写入字符串键值。

### Params

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | 非空存储键。 |
| `value` | `string` | Yes | 要保存的字符串值。 |

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |
| `key` | `string` | 已写入的 key。 |
| `value` | `string` | 已写入的 value。 |

### Errors

`PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("system.storage.setItem", { key: "username", value: "lichenyang" })
```

## system.storage.getItem

- Title: 读取本地存储
- Category: `system`
- Status: Implemented
- Biz: `StorageBiz`
- Imp: `StorageImp`

从 Preferences 读取字符串键值，不存在时返回空字符串。

### Params

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | 非空存储键。 |

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |
| `key` | `string` | 查询的 key。 |
| `value` | `string` | 读取结果。 |

### Errors

`PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("system.storage.getItem", { key: "username" })
```

## system.storage.removeItem

- Title: 删除本地存储
- Category: `system`
- Status: Implemented
- Biz: `StorageBiz`
- Imp: `StorageImp`

幂等删除 Preferences 中的指定 key。

### Params

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | 非空存储键。 |

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |
| `key` | `string` | 已删除的 key。 |

### Errors

`PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("system.storage.removeItem", { key: "username" })
```

## system.storage.clear

- Title: 清空本地存储
- Category: `system`
- Status: Implemented
- Biz: `StorageBiz`
- Imp: `StorageImp`

清空框架使用的 Preferences 存储。

### Params

-

### Response

| Name | Type | Description |
| --- | --- | --- |
| `echoAction` | `string` | 回显当前 action。 |

### Errors

`INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("system.storage.clear", {})
```

## network.request

- Title: Network Request
- Category: `network`
- Status: Implemented
- Biz: `NetworkBiz`
- Imp: `NetworkImp`

Send an HTTP or HTTPS request through the ArkTS runtime.

### Params

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | `string` | Yes | Absolute HTTP or HTTPS URL. |
| `method` | `NetworkMethod` | No | GET, POST, PUT or DELETE. |
| `headers` | `NetworkHeaders` | No | String request headers. |
| `body` | `string` | No | Request body for non-GET methods. |
| `timeout` | `number` | No | Native request timeout in milliseconds. |
| `responseType` | `NetworkResponseType` | No | text or json. |

### Response

| Name | Type | Description |
| --- | --- | --- |
| `ok` | `boolean` | Whether the HTTP status is in the 2xx range. |
| `statusCode` | `number` | HTTP status code. |
| `statusText` | `string` | Standard text for known HTTP status codes. |
| `headers` | `NetworkHeaders` | HTTP response headers. |
| `body` | `NetworkBody` | Text or parsed JSON response body. |
| `duration` | `number` | Native request duration in milliseconds. |

### Errors

`PARAM_ERROR`, `NETWORK_INVALID_URL`, `NETWORK_UNSUPPORTED_PROTOCOL`, `NETWORK_TIMEOUT`, `NETWORK_REQUEST_FAILED`, `NETWORK_INVALID_RESPONSE`, `NETWORK_ABORTED`, `TIMEOUT`, `CALLBACK_LOST`

### Example

```js
window.myascf.send("network.request", { url: "https://example.com", method: "GET" })
```
