# Roadmap

这篇文档解决的问题：说明项目当前真实进度、进行中事项和后续计划，避免 README 或文档夸大能力。

## 已完成

- [x] 阶段 01：项目初始化与架构规划。
- [x] 阶段 02：ArkWeb 加载本地 H5 页面。
- [x] 阶段 03：H5 通过 JavaScriptProxy 调用 ArkTS，并通过 runJavaScript 返回 H5 Promise。
- [x] 阶段 04：BridgeDispatcher / HandlerRegistry。
- [x] 阶段 05：`ui.showToast`，ToastBiz / ToastImp。
- [x] 阶段 06：BridgeCallbackExecutor、TIMEOUT、CALLBACK_LOST。
- [x] 阶段 07：`system.clipboard.writeText` / `system.clipboard.readText`。
- [x] 阶段 08：H5 DebugPanel / RuntimeLogger 可视化调用链路。
- [x] 阶段 09：runtime 抽取为 `myascf_runtime` HAR 模块。
- [x] 阶段 10：GitHub README、架构图和展示文档整理。
- [x] 阶段 11：`MyASCFRuntime` HAR 门面类。

## 当前进行中

- 项目展示材料持续完善：截图、博客文章、架构图细节。
- DevEco Studio 环境下的 HAR 构建与真机回归需要在本地 IDE 中继续验证。

## 后续计划

- [ ] Storage API。
- [ ] Network API。
- [ ] Web 容器白名单与错误页。
- [ ] 更完整的 API 文档生成。
- [ ] DebugPanel 搜索、筛选和耗时统计。
- [ ] 根 README 增加真实截图。

## 不夸大的边界

- 当前不是生产 SDK。
- 当前没有实现完整小程序规范。
- 当前没有实现 Storage / Network / 白名单错误页。
- 当前 API 数量有限，重点展示 JSBridge 主链路和工程分层。
