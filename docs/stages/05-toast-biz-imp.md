# 阶段 05：ToastBiz 与 ToastImp

这篇文档解决的问题：记录后续如何把 `ui.showToast` 从 mock handler 推进到真实 Biz / Imp 分层。

## 当前状态

当前尚未实现，后续阶段补充。

## 目标

- `ToastBiz` 校验参数。
- `ToastImp` 调用公开 HarmonyOS Toast 能力。
- 错误通过标准响应返回给 H5。

## 当前不做的原因

项目当前刚完成 JavaScriptProxy 通信边界。真实系统能力调用要等 Dispatcher / Registry 稳定后再接入。
