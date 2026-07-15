# Technical Highlights

这篇文档解决什么问题：把项目最值得讲解的技术点压缩成可快速浏览的清单，并说明每一点解决的具体工程问题。

## 1. H5 / ArkTS 双端分层

`h5_sdk` 管浏览器请求生命周期，`myascf_runtime` 管 ArkTS 分发和平台调用，`entry` 只负责容器与演示组装。

## 2. requestId + callback map

每个跨端请求拥有独立 requestId，callback map 保存 Promise 与 timer，支持并发、乱序响应和确定性清理。

## 3. JavaScriptProxy + runJavaScript

请求通过 ArkWeb JavaScriptProxy 进入 ArkTS，响应由统一出口执行 `runJavaScript` 回到 H5 全局 callback，形成双向最小边界。

## 4. Dispatcher / Registry

Dispatcher 统一 UNKNOWN_ACTION 和异常，Registry 映射 action/handler，避免 Controller 变成不断增长的条件分支。

## 5. Biz / Imp

Biz 负责参数校验、错误码和 data 语义；Imp 负责公开 HarmonyOS 能力，隔离协议与平台细节。

## 6. CallbackExecutor

集中完成 BridgeResponse 序列化、JavaScript 字符串安全传递、`runJavaScript` 和日志，减少各 API 重复代码。

## 7. API Manifest

Manifest 描述 action、分类、参数、响应、错误、实现类和实现状态，为运行时、文档和 SDK 提供共同元信息。

## 8. runtime.getApiList

H5 可以动态读取 HAR 当前注册能力，DebugPanel 不再维护独立静态 action 列表。

## 9. H5 SDK IIFE + ESM

IIFE 服务 ArkWeb rawfile 与简单页面，ESM 服务 TypeScript 和现代前端构建工具，两者共享同一 Bridge 协议。

## 10. Manifest 生成 typed API

生成 action union、参数/响应映射和 nested helper，在不改变 `send` 的前提下提供编译期提示。

## 11. Tests + CI

Node 测试验证 H5 协议与错误生命周期；一致性脚本验证 Manifest、ArkTS 注册、生成物和 package；GitHub Actions 在 push/PR 自动运行这些检查。

## 12. Manual smoke test boundary

HAP、ArkWeb、权限、Toast/Clipboard/Storage 系统行为和容器 UI 由明确的手工清单验证。自动化边界被记录，而不是把 Node 测试结果扩大为设备结论。

## 13. 可回读的源码地图

项目为 H5 SDK 和 ArkTS runtime 分别维护 source map，记录每个核心文件的输入、输出、职责和禁止承担的工作。它既是维护索引，也是面试时解释架构边界的复习材料。

## 总结

项目亮点不是 API 数量，而是把跨端通信、扩展注册、平台调用、SDK、元数据、测试和展示文档连成一条可维护、可解释的工程链路。
