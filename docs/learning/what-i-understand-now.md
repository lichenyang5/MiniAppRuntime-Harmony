# 我现在对项目的理解

这篇文档解决什么问题：用第一人称检查我是否真正理解项目，而不是只记住文件名和演示步骤。

## 一句话

这是一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架实践项目。

## 我理解的三层

1. `entry` 是示例应用，负责 ArkWeb、本地 H5、容器状态和 HAR 接入。
2. `myascf_runtime` 是 ArkTS HAR runtime，负责协议入口、分发注册、Biz/Imp、系统能力和回调出口。
3. `h5_sdk` 是 H5 JSBridge SDK，负责 requestId、callback map、timeout、Native 适配和 Promise。

## 我理解的完整调用链

H5 调用 `window.myascf.send()`，SDK 生成 requestId 并保存 Promise callback，再调用 `window.MyASCFNative.postMessage()`。ArkWeb 把消息交给 JavaScriptProxy，Controller 解析后交给 Dispatcher，Dispatcher 从 Registry 找 handler，Biz 校验参数，Imp 调用公开 HarmonyOS Kit。返回的 BridgeResponse 由 CallbackExecutor 通过 `runJavaScript` 送回 H5，SDK 再根据 requestId resolve 或 reject 原 Promise。

## 我理解的 SDK

SDK 不是 Toast、Clipboard 或 Storage 的实现。它管理的是浏览器侧跨端请求生命周期。IIFE 适合 rawfile 直接加载，ESM 适合现代前端工程；两种产物共享同一套源码和协议。

## 我理解的 HAR

HAR 把 runtime 从 Demo 中抽离。`MyASCFRuntime` 是外部接入门面，entry 不需要了解 Controller、Dispatcher 和 Registry 的组装细节。Context 目前主要传给 StorageImp，用于获取 Preferences。

## 我理解的 Manifest

Manifest 描述 action、参数、响应、错误和实现状态。运行时用 ArkTS Manifest 提供 `runtime.getApiList`，Node 工具用 JSON 镜像生成文档和 H5 类型。当前两份 Manifest 仍需一致性检查，还不是真正的单一数据源。

## 我理解的质量边界

Node 测试和 CI 能验证 H5 SDK、生成物、注册关系、包入口和 npm pack 内容，但不能证明 ArkWeb 注入、系统权限、Toast UI 或不同设备行为。后者必须通过 DevEco Studio 与设备冒烟验证。

## 我还不熟的地方

- ArkWeb 生命周期和部分 HarmonyOS Kit 在不同 SDK/设备上的差异还需要继续验证。
- HAR 的公开发布方式、版本兼容和依赖治理还没有深入研究。
- 生产级 URL 安全策略、远程内容治理、权限模型和性能指标尚未覆盖。
- ArkTS runtime 的自动化测试范围仍有限。
- CLI 暂时不做，Network API 也不在 v0.1.0 范围。
- H5 SDK 暂不发布 npm，当前只完成本地构建和 pack 预检。
