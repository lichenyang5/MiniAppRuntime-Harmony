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

## 后续计划

1. `BridgeDispatcher` 和 `HandlerRegistry`。
2. `ui.showToast` action 注册。
3. `ToastBiz` 参数校验。
4. `ToastImp` 调用公开 HarmonyOS Toast 能力。
5. 标准错误码和 timeout。
6. `runJavaScript` 回调治理。
7. Debug 日志与调试面板。
8. 更多 API 示例。

## 当前尚未实现，后续阶段补充

- API 注册完整生命周期。
- Biz/Imp 完整模板。
- UI 组件能力暴露。
- Debug 面板。
- 完整错误码说明。
