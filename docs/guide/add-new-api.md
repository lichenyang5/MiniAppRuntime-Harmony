# 新增 API 标准流程

这篇文档解决什么问题：为后续能力扩展提供固定检查清单，避免代码已经注册但 Manifest、Demo 或文档遗漏。

以下以尚未实现的占位 action `system.xxx.demo` 为例，只展示流程，不在本阶段新增该 API。

## 1. 新增 ActionName

在 `ActionNames.ets` 定义稳定常量，运行时代码不要散落硬编码字符串。

## 2. 新增 ApiManifestItem

在 `BUILTIN_API_MANIFEST` 添加 action、category、title、description、params、response、errors、implemented、biz、imp 和 example。

## 3. 新增 Biz

Biz 校验 BridgeRequest 参数、表达业务语义并构造 BridgeResponse，不直接操作 ArkWeb 或回调 H5。

## 4. 新增 Imp

Imp 只封装公开 HarmonyOS Kit，不关心 requestId、Registry 或 H5 协议。

## 5. 在 RuntimeBootstrap 注册

创建实现 `BridgeHandler` 的 handler，并使用 ActionNames 常量注册到 HandlerRegistry。Manifest 不自动执行注册。

## 6. 扩展 BridgeTypes

如果请求参数或响应字段新增，需要在显式接口中声明；不要使用 `any` 或未声明对象字面量。

## 7. 更新 H5 Demo

增加最小成功与参数错误测试入口，继续使用 `window.myascf.send`，不要为单个 API 绕过统一协议。

## 8. 验证 DebugPanel API 列表

不再维护 `api-list.js`。确认 Manifest 更新后，`runtime.getApiList` 返回新 action，DebugPanel 能动态渲染 category、description 和 paramsText。

## 9. 更新 docs/api

记录请求、响应、参数校验、错误和限制，并在 `docs/api/index.md` 添加链接。

## 10. 更新 README API 表格

保持 Category、Action、Params、Response 和 Status 与 Manifest 一致。

## 11. 回归错误链路

至少验证成功调用、PARAM_ERROR、UNKNOWN_ACTION、TIMEOUT 和 CALLBACK_LOST，并确认旧 API、HAR 导入、DebugPanel 和 WebContainer 不受影响。

## 完成定义

只有当 ActionNames、Manifest、RuntimeBootstrap、Biz/Imp、BridgeTypes、Demo、DebugPanel、API 文档和 README 同步完成，并通过构建与回归检查后，API 才应标记为 `implemented: true`。
