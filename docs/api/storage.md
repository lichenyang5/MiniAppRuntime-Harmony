# Storage API

这篇文档解决什么问题：说明 H5 如何通过 MyASCF 调用 HarmonyOS Preferences 本地键值存储，以及参数、响应和错误约定。

## Actions

- `system.storage.setItem`：写入字符串值，参数为 `key`、`value`。
- `system.storage.getItem`：读取字符串值，参数为 `key`；不存在时 `data.value` 返回空字符串。
- `system.storage.removeItem`：删除指定 key；key 不存在也返回成功。
- `system.storage.clear`：清空 `myascf_storage` Preferences 文件。

```js
await window.myascf.send('system.storage.setItem', { key: 'username', value: 'lichenyang' });
const response = await window.myascf.send('system.storage.getItem', { key: 'username' });
await window.myascf.send('system.storage.removeItem', { key: 'username' });
await window.myascf.send('system.storage.clear', {});
```

`key` 必须是非空字符串；`setItem.value` 当前只接受字符串。校验失败返回 `PARAM_ERROR`，Preferences 调用异常由 Dispatcher 转换为 `INTERNAL_ERROR`。

调用链为 H5 -> JavaScriptProxy -> BridgeController -> BridgeDispatcher -> HandlerRegistry -> StorageBiz -> StorageImp -> Preferences，响应沿原链路回到 H5 Promise。

StorageBiz 只处理参数和响应语义；StorageImp 只封装 `@kit.ArkData` Preferences。Context 通过 `new MyASCFRuntime(controller, getContext(this))` 传入 HAR，并由门面内部完成注册。

当前只支持字符串键值，不支持 object、批量操作、过期时间和多存储空间。
