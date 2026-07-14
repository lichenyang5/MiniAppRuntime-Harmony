# 生成 API 文档

这篇文档解决什么问题：说明为什么引入 API 文档生成工具、如何运行，以及生成文件与手写文档的边界。

本方案用于个人开源学习与工程实践项目，目标是减少公开代码与文档之间的重复维护。

## 为什么生成

API action、参数和响应容易同时出现在 ArkTS Manifest、README 和 API 总览中。生成脚本让 README 核心表格与生成文档统一来自一个 JSON 镜像，减少重复手写。

## 当前数据来源

运行时真实元信息位于 `myascf_runtime/src/main/ets/api/ApiManifest.ets`。文档工具读取 `tools/api-manifest.json`，后者是当前阶段的文档生成镜像。新增 API 时必须同步两份数据。

## 运行命令

```bash
npm run docs:api
```

不使用 npm 时：

```bash
node tools/generate-api-docs.js
```

## 输出

- `docs/api/generated-api-table.md`
- `docs/api/generated-api-manifest.md`
- README 的 `API_TABLE_START/END` 区块
- `docs/api/index.md` 的 `API_TABLE_START/END` 区块

`docs/api/generated-api-table.md` 和 `docs/api/generated-api-manifest.md` 是生成文件，不建议手动修改。Toast、Clipboard、Storage、Runtime 和错误码文档仍是手写说明，用于补充行为、限制和调试信息。

## 新增 API 后

先更新 ActionNames、ApiManifest.ets、JSON 镜像和运行时实现，再执行生成命令。检查生成差异、README 表格、API 总览和构建结果。

## 当前限制

JSON 与 ArkTS Manifest 仍是两份数据，脚本只校验 JSON 内部完整性，暂时不会解析 ArkTS。后续可以从单一结构化源同时生成 ArkTS Manifest、Markdown 和 H5 类型声明。
