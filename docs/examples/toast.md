# Toast 场景

你将学会什么：在保存、提交和失败反馈中使用 `ui.showToast`。

```ts
await api.ui.showToast({ message: '保存成功' });
await api.ui.showToast({ message: '表单已提交' });
await api.ui.showToast({ message: '请求失败，请稍后重试' });
```

message 必须是 trim 后非空字符串。Toast 本身失败时不要无限递归调用 Toast，可退回页面错误区域或 console。

## 下一步阅读

- [UI API](../api/ui.md)
- [错误处理](../guide/error-handling.md)
