<!-- AUTO-GENERATED: DO NOT EDIT DIRECTLY -->

# API Reference

这篇文档解决什么问题：从真实 API Manifest 汇总当前公开 action、参数、响应、版本和权限边界。

Current compatibility: H5 SDK `0.1.0` + HAR Runtime metadata `1.0.0`.

> Run `npm run docs:api` to regenerate this file. Internal actions are intentionally excluded.

## runtime.getApiList

- Params: -
- Response: `apis: ApiSummary[]`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("runtime.getApiList", {})
```

Failure handling:

```js
try {
  await window.myascf.send("runtime.getApiList", {});
} catch (error) {
  console.error('runtime.getApiList', error);
}
```

Errors: `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## ui.showToast

- Params: `message: string`
- Response: `echoAction: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("ui.showToast", { message: "hello" })
```

Failure handling:

```js
try {
  await window.myascf.send("ui.showToast", { message: "hello" });
} catch (error) {
  console.error('ui.showToast', error);
}
```

Errors: `PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## system.clipboard.writeText

- Params: `text: string`
- Response: `echoAction: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("system.clipboard.writeText", { text: "hello" })
```

Failure handling:

```js
try {
  await window.myascf.send("system.clipboard.writeText", { text: "hello" });
} catch (error) {
  console.error('system.clipboard.writeText', error);
}
```

Errors: `PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## system.clipboard.readText

- Params: -
- Response: `echoAction: string, text: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: `ohos.permission.READ_PASTEBOARD`

Success call:

```js
window.myascf.send("system.clipboard.readText", {})
```

Failure handling:

```js
try {
  await window.myascf.send("system.clipboard.readText", {});
} catch (error) {
  console.error('system.clipboard.readText', error);
}
```

Errors: `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## system.storage.setItem

- Params: `key: string, value: string`
- Response: `echoAction: string, key: string, value: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("system.storage.setItem", { key: "username", value: "lichenyang" })
```

Failure handling:

```js
try {
  await window.myascf.send("system.storage.setItem", { key: "username", value: "lichenyang" });
} catch (error) {
  console.error('system.storage.setItem', error);
}
```

Errors: `PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## system.storage.getItem

- Params: `key: string`
- Response: `echoAction: string, key: string, value: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("system.storage.getItem", { key: "username" })
```

Failure handling:

```js
try {
  await window.myascf.send("system.storage.getItem", { key: "username" });
} catch (error) {
  console.error('system.storage.getItem', error);
}
```

Errors: `PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## system.storage.removeItem

- Params: `key: string`
- Response: `echoAction: string, key: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("system.storage.removeItem", { key: "username" })
```

Failure handling:

```js
try {
  await window.myascf.send("system.storage.removeItem", { key: "username" });
} catch (error) {
  console.error('system.storage.removeItem', error);
}
```

Errors: `PARAM_ERROR`, `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## system.storage.clear

- Params: -
- Response: `echoAction: string`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: No additional permission

Success call:

```js
window.myascf.send("system.storage.clear", {})
```

Failure handling:

```js
try {
  await window.myascf.send("system.storage.clear", {});
} catch (error) {
  console.error('system.storage.clear', error);
}
```

Errors: `INTERNAL_ERROR`, `TIMEOUT`, `CALLBACK_LOST`

## network.request

- Params: `url: string, method?: NetworkMethod, headers?: NetworkHeaders, body?: string, timeout?: number, responseType?: NetworkResponseType`
- Response: `ok: boolean, statusCode: number, statusText?: string, headers: NetworkHeaders, body: NetworkBody, duration: number`
- Supported combination: H5 SDK `0.1.0` / HAR Runtime `1.0.0`
- Permission: `ohos.permission.INTERNET`

Success call:

```js
window.myascf.send("network.request", { url: "https://example.com", method: "GET" })
```

Failure handling:

```js
try {
  await window.myascf.send("network.request", { url: "https://example.com", method: "GET" });
} catch (error) {
  console.error('network.request', error);
}
```

Errors: `PARAM_ERROR`, `NETWORK_INVALID_URL`, `NETWORK_UNSUPPORTED_PROTOCOL`, `NETWORK_TIMEOUT`, `NETWORK_REQUEST_FAILED`, `NETWORK_INVALID_RESPONSE`, `NETWORK_ABORTED`, `TIMEOUT`, `CALLBACK_LOST`
