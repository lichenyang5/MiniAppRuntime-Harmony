# API 文档工具

这篇文档解决什么问题：说明 `tools/` 中的 Manifest JSON 镜像和 API 文档生成脚本如何使用。

该工具服务于个人开源学习与工程实践项目，只处理公开项目中的 API 元信息。

运行：

```bash
npm run docs:api
```

也可以直接执行：

```bash
node tools/generate-api-docs.js
```

脚本读取 `tools/api-manifest.json`，生成 `docs/api/generated-api-table.md` 和 `docs/api/generated-api-manifest.md`，并更新 README 与 `docs/api/index.md` 的 API 表格标记区块。

当前 JSON 是 `ApiManifest.ets` 的文档生成镜像。新增或修改 API 时，两份 Manifest 必须同步，然后运行生成命令并检查差异。
