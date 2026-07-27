# Storage API

你将学会什么：用 HarmonyOS Preferences 保存、读取、删除和清空字符串数据。

Storage 名称为 `myascf_storage`，当前只接受字符串 value。不存在的 key 返回空字符串，因此无法仅凭空字符串区分“未保存”和“保存了空字符串”。

## `system.storage.setItem`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | 无 | trim 后非空 |
| `value` | `string` | 是 | 无 | 原样保存，可为空字符串 |

```ts
await api.system.storage.setItem({ key: 'username', value: 'lichenyang' });
```

返回 `echoAction`、`key`、`value`；非法参数返回 `PARAM_ERROR`。

## `system.storage.getItem`

参数为必填字符串 `key`，返回 `echoAction`、`key`、`value`。

```ts
const response = await api.system.storage.getItem({ key: 'theme' });
console.log(response.data?.value ?? '');
```

## `system.storage.removeItem`

参数为必填字符串 `key`。删除是幂等操作，key 不存在仍可成功。

```ts
await api.system.storage.removeItem({ key: 'username' });
```

## `system.storage.clear`

无参数，清空框架专用 Preferences。

```ts
await api.system.storage.clear();
```

## React 示例

```tsx
const saveName = async (): Promise<void> => {
  try {
    await api.system.storage.setItem({ key: 'username', value: name });
  } catch (error: unknown) {
    setError(JSON.stringify(error));
  }
};
```

## 权限、错误和实现链路

无需额外权限。四项 API 都可能出现 `PARAM_ERROR`（有参数时）、`INTERNAL_ERROR`、H5 `TIMEOUT` 与 `CALLBACK_LOST`。H5 SDK → StorageBiz → StorageImp → Preferences，写、删、清都会 flush。

## 下一步阅读

- [Storage 示例](../examples/storage.md)
- [Preferences 边界](../concepts/biz-and-imp.md)
