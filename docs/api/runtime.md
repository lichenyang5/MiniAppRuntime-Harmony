# Runtime API

你将学会什么：查询当前 Runtime 实际暴露的公开能力，并用于兼容检查和动态面板。

## `runtime.getApiList`

返回 9 个非 internal API 的精简 Manifest。

### 参数

无参数。

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `apis` | `ApiSummary[]` | action、category、title、description、implemented、paramsText |

### 最小与 React 示例

```ts
const response = await api.runtime.getApiList();
console.log(response.data?.apis);
```

React 中可把 `response.data?.apis ?? []` 存入 state，生成动态能力面板。也可以比对业务依赖的 action，发现 SDK 与 Runtime 版本不匹配。

### 成功响应

```json
{"requestId":"myascf_...","code":0,"message":"get api list success","data":{"echoAction":"runtime.getApiList","apis":[]}}
```

### 失败响应与错误

可能出现 `INTERNAL_ERROR`、H5 `TIMEOUT` 或 `CALLBACK_LOST`。它不会返回 internal `network.abort`。

### 权限与实现链路

无需额外权限。H5 SDK → RuntimeInfoBiz → `BUILTIN_API_MANIFEST`。

## 下一步阅读

- [API Manifest](../concepts/api-manifest.md)
- [API 使用](../guide/api-usage.md)
