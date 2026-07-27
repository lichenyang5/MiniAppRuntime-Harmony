# UI API

你将学会什么：从 H5 显示 HarmonyOS Toast，并正确处理参数错误。

## `ui.showToast`

### 参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message` | `string` | 是 | 无 | trim 后必须非空 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `echoAction` | `string` | `ui.showToast` |

### 最小示例

```ts
await api.ui.showToast({ message: '保存成功' });
```

### React 示例

```tsx
const submit = async (): Promise<void> => {
  try {
    await saveForm();
    await api.ui.showToast({ message: '提交成功' });
  } catch (error: unknown) {
    await api.ui.showToast({ message: '提交失败' }).catch(() => undefined);
  }
};
```

### 成功与失败

成功 message 为 `showToast success`。message 缺失、不是字符串或为空时 reject `PARAM_ERROR`；平台调用异常转换为 `INTERNAL_ERROR`。

### 权限与实现链路

无需额外权限。H5 SDK → ToastBiz → ToastImp → `promptAction.showToast`。当前 Toast duration 为 2000ms。

## 下一步阅读

- [Toast 示例](../examples/toast.md)
- [错误处理](../guide/error-handling.md)
