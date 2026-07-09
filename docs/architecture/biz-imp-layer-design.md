# Biz / Imp 分层设计

这篇文档解决的问题：说明为什么后续要把参数校验和 HarmonyOS 系统能力调用拆成 Biz / Imp 两层。

## 当前状态

当前尚未实现，后续阶段补充。

## 分层目标

- `Biz`：负责参数校验、业务编排、错误转换。
- `Imp`：负责调用公开 HarmonyOS 系统能力。

## 以 ui.showToast 为例

后续计划：

```text
ToastBiz
-> 校验 message
-> 调用 ToastImp

ToastImp
-> 调用 promptAction.showToast
```

这样可以让业务规则和系统 API 调用保持清晰边界。
