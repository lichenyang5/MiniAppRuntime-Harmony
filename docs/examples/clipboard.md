# Clipboard 场景

你将学会什么：复制订单号和链接，读取剪贴板并处理授权失败。

```ts
await api.system.clipboard.writeText({ text: 'ORDER-2026-001' });
await api.system.clipboard.writeText({ text: 'https://example.com/share' });

try {
  const response = await api.system.clipboard.readText();
  console.log(response.data?.text ?? '');
} catch (error: unknown) {
  console.error('读取失败，请检查 READ_PASTEBOARD 授权', error);
}
```

## 下一步阅读

- [Clipboard API](../api/clipboard.md)
- [Runtime 权限](../guide/runtime-installation.md)
