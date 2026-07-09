# Roadmap

这篇文档解决的问题：说明项目当前进度和后续阶段计划，方便 GitHub 读者快速判断项目完成度。

## 当前状态

已完成：

- ArkWeb 加载本地 H5 页面。
- H5 `window.myascf.send(action, params)` 返回 Promise。
- H5 生成 `requestId` 并维护 callback map。
- H5 通过 JavaScriptProxy 调用 ArkTS。
- ArkTS 解析请求并返回 mock response。
- H5 Promise resolve 并展示结果。
- BridgeDispatcher 统一分发 action。
- HandlerRegistry 注册并查询 `ui.showToast` mock handler。
- UNKNOWN_ACTION 和 INTERNAL_ERROR 已有统一响应入口。
- ToastBiz 校验 `ui.showToast` 参数。
- ToastImp 调用公开 HarmonyOS Toast 能力。
- `PARAM_ERROR` 已在 `ui.showToast` 中生效。
- BridgeCallbackExecutor 统一执行 ArkTS 到 H5 的回调。
- H5 timeout 与 callback lost 已有基础处理。
- Clipboard write/read 已作为第二组真实 API 接入。

## 后续计划

1. Debug 日志与调试面板。
2. Storage API 示例。
3. 更完整的调用链耗时统计。

## 当前尚未实现，后续阶段补充

- API 注册完整生命周期。
- Biz/Imp 完整模板。
- UI 组件能力暴露。
- Debug 面板。
- 完整错误码说明。
