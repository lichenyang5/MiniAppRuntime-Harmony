# Clipboard API

你将学会什么：写入和读取纯文本剪贴板，并处理读取权限。

## `system.clipboard.writeText`

### 参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `text` | `string` | 是 | 无 | trim 后必须非空 |

### 返回值与示例

返回 `echoAction`。

```ts
await api.system.clipboard.writeText({ text: 'ORDER-2026-001' });
await api.system.clipboard.writeText({ text: 'https://example.com/share' });
```

成功 message 为 `write clipboard success`；空文本返回 `PARAM_ERROR`。

## `system.clipboard.readText`

### 参数

无参数。

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `echoAction` | `string` | 当前 action |
| `text` | `string` | 系统剪贴板主文本 |

### React 示例

```tsx
const readClipboard = async (): Promise<void> => {
  try {
    const response = await api.system.clipboard.readText();
    setValue(response.data?.text ?? '');
  } catch (error: unknown) {
    setError('请检查剪贴板读取授权');
  }
};
```

成功 message 为 `read clipboard success`。权限拒绝或平台异常经 Dispatcher 转换为 `INTERNAL_ERROR`。

### 权限与实现链路

读取需要宿主声明 `ohos.permission.READ_PASTEBOARD` 并按系统要求授权；写入不需要该读取权限。H5 SDK → ClipboardBiz → ClipboardImp → pasteboard。

## 下一步阅读

- [Clipboard 示例](../examples/clipboard.md)
- [错误处理](../guide/error-handling.md)
