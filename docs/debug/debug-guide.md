# 调试指南

这篇文档解决的问题：记录后续如何调试 ArkWeb、JavaScriptProxy、BridgeController 和 H5 Promise 回调链路。

## 当前状态

当前尚未实现完整调试面板，后续阶段补充。

## 当前可用排查点

- H5 console：查看 `window.myascf.send` 是否发出请求。
- ArkTS hilog：查看 BridgeController 是否收到原始 JSON。
- 页面结果区域：查看 mock response 是否展示。

## 后续计划

- 增加 Bridge 调用日志面板。
- 展示 requestId、action、耗时和结果。
- 展示错误码和错误消息。
