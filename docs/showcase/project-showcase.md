# Project Showcase

这篇文档解决什么问题：用适合 GitHub、面试和技术社区的方式概括项目动机、实现内容、工程亮点与真实边界。

## 项目一句话

MiniAppRuntime-Harmony 是一个受小程序运行时架构启发、基于 HarmonyOS ArkWeb 的 Web 容器与 JSBridge 运行时实践项目。

## 为什么做

ArkWeb 可以承载 H5，HarmonyOS 可以提供 Native 能力，但“页面调用一个系统能力”不只是注入一个方法。跨端请求还要处理协议、异步回调、并发 requestId、参数校验、action 扩展、错误语义、超时、调试和包边界。本项目用一个 Demo 工程把这些问题拆开并形成可维护的主链路；候选版本仍需按设备与 CI 清单留下当次验收记录。

## 做了什么

- `entry` 提供 ArkWeb 容器、本地 H5 Demo、加载状态、URL Guard 和错误状态页。
- `myascf_runtime` 以本地 HAR 组织 JavaScriptProxy、Controller、Dispatcher、Registry、Biz/Imp、CallbackExecutor 与内置 API。
- `h5_sdk` 提供 IIFE/ESM、Promise `send`、requestId、callback map、timeout、错误处理和 typed API。
- API Manifest 描述 8 个内置 action，并驱动 API 文档和 H5 类型生成。
- DebugPanel、Node 测试、一致性脚本、npm pack 预检和 GitHub Actions CI 补充工程验证。

## 架构亮点

```text
H5 SDK -> JavaScriptProxy -> BridgeController
       -> BridgeDispatcher -> HandlerRegistry -> Biz -> Imp
       -> BridgeCallbackExecutor -> runJavaScript
       -> callback map -> Promise resolve / reject
```

Controller 只负责协议入口，Dispatcher/Registry 负责扩展，Biz 负责参数和响应语义，Imp 负责公开 HarmonyOS 能力，CallbackExecutor 负责统一跨端响应。新增 action 不需要把更多分支塞进 Web 页面或 Controller。

## 工程化亮点

- 本地 HAR 门面 `MyASCFRuntime` 降低 Demo 接入成本。
- H5 SDK 同时支持 rawfile script 和现代前端 ESM import。
- Manifest 生成 typed API 和 Markdown，减少多处手工维护。
- 测试覆盖 Promise、错误、timeout、callback lost、IIFE/ESM 和 DebugPanel 容错。
- CI 检查生成物、注册关系、H5 构建、测试和 package 入口。
- 手工 smoke test 明确承接 ArkWeb、权限、设备 UI 等自动测试无法覆盖的部分。

## 当前边界

项目是个人开源学习与工程实践，不是完整小程序平台，也不宣称达到生产级安全、兼容性和发布要求。H5 SDK 尚未发布到 npm，HAR 仅提供本地依赖；真实设备行为、权限和截图需要按候选版本逐次验证。

## 后续计划

- 补齐真实设备与 CI 截图。
- 发布并根据反馈修订技术文章。
- 调研 H5 SDK npm 和 HarmonyOS HAR 的公开发布流程。
- 在现有边界稳定后再评估 Network API 和更完整的 Web 内容安全策略。
