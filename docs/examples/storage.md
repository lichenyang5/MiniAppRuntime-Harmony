# Storage 场景

你将学会什么：保存用户名、读取配置、删除一项并清空框架缓存。

```ts
await api.system.storage.setItem({ key: 'username', value: 'lichenyang' });
const result = await api.system.storage.getItem({ key: 'username' });
console.log(result.data?.value ?? '');
await api.system.storage.removeItem({ key: 'username' });
await api.system.storage.clear();
```

当前 value 只能是字符串；key 不存在时 getItem 返回空字符串，removeItem 仍成功。

## 下一步阅读

- [Storage API](../api/storage.md)
- [Biz 与 Imp](../concepts/biz-and-imp.md)
