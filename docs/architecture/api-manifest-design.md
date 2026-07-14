# API Manifest 设计

这篇文档解决什么问题：解释 API 元信息如何服务运行时能力查询、文档生成和 H5 SDK 类型生成，以及当前尚未统一的边界。

## Manifest 的作用

API 信息分布在 action 常量、RuntimeBootstrap、Biz/Imp、README 和 Demo 中，手工维护容易遗漏。Manifest 为每个 API 描述：

- action 与 category。
- 标题和说明。
- params 与 required。
- response 字段。
- errors 与 implemented。
- Biz / Imp 归属和示例。

Manifest 描述能力，但不执行 API，不替代 HandlerRegistry，也不替代 Biz 参数校验。

## 当前两种表示

```text
myascf_runtime ApiManifest   运行时自省，供 runtime.getApiList 使用
tools/api-manifest.json      生成镜像，供 Node 工具读取
```

当前 JSON 仍需与 ArkTS Manifest 同步维护，尚未实现真正的单一数据源。选择 JSON 作为生成输入，是因为 Node 可以稳定解析结构化数据，不需要脆弱地解析 ArkTS imports、对象或类型语法。

## 生成链路

文档链路：

```text
tools/api-manifest.json
-> tools/generate-api-docs.js
-> API Markdown 与 README 表格
```

H5 SDK 类型链路：

```text
tools/api-manifest.json
-> tools/generate-sdk-types.js
-> h5_sdk/src/generated/api-types.ts
-> h5_sdk/src/generated/api-client.ts
-> IIFE / ESM / d.ts
```

生成器校验完整元数据、action、参数、响应、错误列表、实现状态、重复字段、类型和 nested helper 路径。字段缺失或类型不支持时退出非 0；只有 `implemented: true` 的 API 会进入 H5 SDK 类型，避免把规划中的 action 暴露为可调用能力。

## 生成的能力

- `ApiAction` 联合类型。
- `ApiParamsMap`。
- `ApiResponseDataMap`。
- `TypedBridgeResponse<T>`。
- `TypedSendArgs<T>`。
- `createTypedApi(client)` nested helper。

这些类型增强 H5 开发体验，但运行时仍走既有 `send` 与 Dispatcher 主链路。

## 维护命令

```bash
npm run docs:api
npm run sdk:types
npm run generate
```

SDK build 会通过 `prebuild` 自动刷新 generated 文件。

## 后续演进

下一阶段可以把 ArkTS Manifest、JSON 镜像、Markdown 和 H5 类型统一到一个结构化来源，并增加“生成后工作树必须无差异”的 CI 检查。当前文档只描述已经落地的 JSON 驱动文档与 H5 类型能力。
