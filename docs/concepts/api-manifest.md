# API Manifest

你将学会什么：一份 Manifest 怎样同时驱动 Runtime 查询、文档、TypeScript 类型和一致性检查。

`ApiManifest.ets` 是 Runtime 的内置事实；`tools/api-manifest.json` 是 Node 工具读取的镜像。当前有 10 个 action，`network.abort` 标记为 internal，不进入 typed API 和 `runtime.getApiList`。

Manifest 驱动 README/API Markdown、ApiAction/参数/响应类型、`createTypedApi`、`runtime.getApiList` 和注册一致性检查。执行 `npm run generate` 更新生成物，执行 `npm run check` 检查漂移。

## 下一步阅读

- [API 总览](../api/README.md)
- [扩展新 API](../guide/extending-api.md)
