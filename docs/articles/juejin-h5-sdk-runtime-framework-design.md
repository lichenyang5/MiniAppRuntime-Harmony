# H5 SDK 如何配合 ArkTS Runtime：我做了一个 HarmonyOS JSBridge 框架 Demo

这篇文档解决什么问题：从一个真实的 HarmonyOS Web 容器 Demo 出发，说明 H5 SDK 与 ArkTS Runtime 如何分工，并形成可追踪、可扩展的 JSBridge 调用链。

> 本文只讨论 MiniAppRuntime-Harmony 仓库自行实现的代码和公开 HarmonyOS、ArkTS、ArkWeb 能力。项目用于个人开源学习与工程实践，不代表完整小程序平台，也不提供生产级安全与兼容性承诺。

项目地址：[MiniAppRuntime-Harmony](https://github.com/lichenyang5/MiniAppRuntime-Harmony)

## 项目背景

在 ArkWeb 中加载一个 H5 页面并不难，真正麻烦的是让页面稳定调用 ArkTS 能力。一次看似简单的 Toast 调用，需要回答这些问题：多个请求并发时怎样关联响应？Native 没有返回怎么办？新增 action 是否要不断修改 Web 页面和 Controller？参数错误、未知 action 和平台异常怎样统一表达？

我用 MiniAppRuntime-Harmony 把这些问题拆成三个边界：

- `entry`：可运行的 ArkWeb Demo 和容器状态展示。
- `h5_sdk`：H5 侧 JSBridge 客户端。
- `myascf_runtime`：ArkTS 本地 HAR runtime。

## 整体架构

```text
H5 Demo
-> h5_sdk / window.myascf.send
-> window.MyASCFNative.postMessage
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> Biz
-> Imp
-> HarmonyOS public Kit
-> BridgeResponse
-> BridgeCallbackExecutor / runJavaScript
-> H5 callback map
-> Promise resolve / reject
```

这条链路的重点不是目录数量，而是让通信、分发、参数语义、平台调用和响应回调分别拥有稳定职责。

## H5 SDK 负责什么

H5 SDK 是浏览器侧客户端，不是 Native 能力实现。业务页面调用：

```js
const response = await window.myascf.send('ui.showToast', {
  message: 'hello from h5'
});
```

`send()` 会生成请求、登记 callback、启动 timeout，并通过 ArkWeb 注入对象发送字符串消息。Demo 只绑定按钮和展示结果，不重复实现 Bridge 生命周期。

IIFE 产物适合 rawfile 页面直接通过 `<script>` 加载并自动挂载 `window.myascf`；ESM 产物适合 TypeScript 和现代前端构建工具。两种产物来自同一套源码，使用同一协议。

## ArkTS Runtime 负责什么

ArkTS Runtime 处理进入 Native 边界后的工作：解析请求、查找 handler、校验参数、调用公开 HarmonyOS Kit，并构造统一 BridgeResponse。`MyASCFRuntime` 门面在 HAR 内部创建 Registry、Dispatcher、CallbackExecutor、Controller 和 JavaScriptProxy，entry 不需要手动组装这些对象。

当前 Demo 提供 Toast、Clipboard、Storage 和 `runtime.getApiList`，共 8 个内置 action。HAR 仍通过 `file:../myascf_runtime` 本地依赖接入，尚未发布到包仓库。

## requestId 与 callback map

跨端响应可能乱序返回，所以不能按调用顺序寻找 Promise。每次 `send()` 都会生成 requestId：

```json
{
  "requestId": "myascf_...",
  "action": "ui.showToast",
  "params": {
    "message": "hello from h5"
  }
}
```

callback map 保存 requestId 对应的 `resolve`、`reject`、timer、action 和创建时间。响应回来后，SDK 用 requestId 取出并删除记录，保证 Promise 只结算一次。

## timeout 与 CALLBACK_LOST

H5 SDK 默认等待 5000ms。到期仍没有响应时，它删除 callback 并 reject TIMEOUT，防止 Promise 永久 pending。

如果 Native 响应在 timeout 后才到达，callback 已经不存在。SDK 此时记录 CALLBACK_LOST，而不是重新结算已经结束的 Promise。timeout 表示“等待超时”，CALLBACK_LOST 表示“到达的响应已经无法关联”。

## JavaScriptProxy 与 runJavaScript

两个方向需要分清：

- JavaScriptProxy：H5 到 ArkTS，接收序列化请求。
- `runJavaScript`：ArkTS 到 H5，调用全局 response callback。

`BridgeCallbackExecutor` 集中序列化 BridgeResponse 和执行 `runJavaScript`，避免每个 API 自己拼接脚本。H5 的 `window.__myascf_on_native_response__` 再完成 response 校验、callback 查询、timer 清理和 Promise 结算。

## Dispatcher 与 Registry

如果 Controller 直接用大量 if/else 判断 action，它会同时承担协议、业务和平台职责。当前设计让 `BridgeDispatcher` 根据 action 查询 `HandlerRegistry`：找到 handler 就执行，找不到统一返回 UNKNOWN_ACTION；handler 异常统一转为 INTERNAL_ERROR。

`RuntimeBootstrap` 负责启动时创建和注册内置 handler，Registry 只保存 action 到 handler 的映射。因此新增 API 不需要修改 Controller 主链路。

## Biz 与 Imp

Biz 面向 JSBridge 协议，负责参数校验、错误码和响应数据语义；Imp 面向 HarmonyOS 平台调用，不理解 H5 callback 或 requestId。

```text
system.storage.setItem
-> StorageBiz 校验 key/value
-> StorageImp 使用 Preferences
-> BridgeResponse
```

StorageImp 需要 Context 来获取 Preferences；`runtime.getApiList` 只读取内存 Manifest，不调用系统能力，因此可以只有 Biz 而没有 Imp。

## BridgeResponse

所有 handler 返回统一响应：

```json
{
  "requestId": "myascf_...",
  "code": 0,
  "message": "success",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

H5 SDK 以 `code === 0` 作为 resolve，其余 code 进入 reject。统一协议让 Toast、Clipboard、Storage 和 runtime API 共享相同回调出口和 DebugPanel 记录方式。

## ApiManifest 与 runtime.getApiList

ApiManifest 描述 action、分类、参数、响应、错误、实现类和实现状态。`runtime.getApiList` 把 HAR 中的能力摘要返回给 H5，DebugPanel 因此不需要维护另一份静态 action 列表。

工具侧的 `tools/api-manifest.json` 目前是 ArkTS Manifest 的镜像，用于生成 API Markdown、README 表格、H5 action union、参数/响应类型和 nested typed helper。一致性脚本检查两侧 action 对齐，但两份数据仍不是完全统一的单一源。

## IIFE、ESM 与 typed API

H5 SDK 同时输出：

- `dist/myascf.js`：IIFE，供 ArkWeb rawfile Demo 使用。
- `dist/index.esm.js`：ESM，供前端工程 import。
- TypeScript 声明和由 Manifest 生成的 typed helper。

typed helper 最终仍调用 `sendTyped()`，而 `sendTyped()` 复用原有 `send()`，没有新增第二套 Bridge 协议。

## 项目边界

当前自动检查覆盖生成物、Manifest 注册关系、H5 SDK build/test、package exports 和 npm pack dry-run。ArkWeb 注入、系统权限、Toast UI 和设备差异仍需要 DevEco Studio 手工 smoke test。

H5 SDK 未发布 npm，HAR 未发布 ohpm，CLI、Network API、Device API 和生产级安全沙箱均未实现。当前仓库还需要先完成已暴露签名凭据的轮换/吊销和 Git 历史清理，之后才能继续 v0.1.0 Release 操作。

## 总结

这个项目让我真正理解的，不只是 H5 调一个 Native 方法，而是如何管理跨端请求的完整生命周期：用 requestId 关联并发请求，用 callback map 管 Promise，用 timeout 和 CALLBACK_LOST 处理异常时序，用 Dispatcher/Registry 扩展 action，用 Biz/Imp 隔离协议与平台，再用 HAR、H5 SDK、Manifest、测试和文档把链路整理成可复用、可解释的工程结构。
