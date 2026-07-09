# 阶段 06：runJavaScript 回调治理

这篇文档解决的问题：记录后续如何完善 ArkTS 回调 H5 的稳定性、错误处理和超时控制。

## 当前状态

当前尚未实现，后续阶段补充。

## 已有基础

当前已经可以通过 `WebviewController.runJavaScript` 调用 H5 全局回调：

```text
window.__myascf_on_native_response__(responseText)
```

## 后续目标

- 统一回调脚本生成。
- 处理 callback lost。
- 增加 timeout。
- 标准化 resolve / reject。
- 为 debug 面板记录回调事件。
