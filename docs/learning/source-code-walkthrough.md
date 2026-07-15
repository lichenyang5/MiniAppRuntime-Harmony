# Source Code Walkthrough

这篇文档解决什么问题：按一次完整 JSBridge 调用的先后顺序回读源码，帮助我从“会运行 Demo”进步到“能解释每一层为什么存在”。

## 1. 从 H5 SDK 发起请求

入口是 `h5_sdk/src/client.ts` 的 `MyASCFClient.send()`。它生成 requestId，创建 Promise，登记 callback 与 timeout，然后由 `NativeAdapter` 把 `BridgeRequest` 序列化后交给 `window.MyASCFNative.postMessage()`。

`initMyASCF()` 在 `h5_sdk/src/index.ts` 中把 client 挂到 `window.myascf`，同时注册 `window.__myascf_on_native_response__`。`auto-init.ts` 只是 IIFE 产物的自动初始化入口；ESM 使用者可以显式调用 `createMyASCF()` 或 `initMyASCF()`。

## 2. entry 连接 ArkWeb 与 HAR

`entry/src/main/ets/pages/Index.ets` 用 `$rawfile('web/index.html')` 加载本地页面。页面创建 `MyASCFRuntime`，再把它提供的 Native proxy、代理名和方法列表传给 `javaScriptProxy()`。

Demo 中的 `web/js/myascf.js` 是 `h5_sdk/dist/myascf.js` 同步后的 IIFE 产物，不是另一套手写协议。`demo.js` 只负责绑定按钮并调用 SDK；`debug-panel.js` 通过 SDK 的调试钩子记录请求状态，不参与请求分发。

## 3. 请求进入 ArkTS runtime

`JavaScriptProxy.postMessage()` 只把字符串转给 `BridgeController`。Controller 负责解析协议、记录日志和启动分发，不处理 Toast、Clipboard 或 Storage 业务。

`BridgeDispatcher` 根据 action 向 `HandlerRegistry` 查找 handler。`RuntimeBootstrap` 在 `MyASCFRuntime` 构造期间创建注册表并注册 8 个内置 action。未知 action 在 Dispatcher 层统一返回错误。

## 4. Biz 与 Imp 执行能力

Biz 负责参数校验和 BridgeResponse 语义。例如 `ToastBiz` 验证非空 message，`StorageBiz` 验证 key/value。Imp 只调用公开 HarmonyOS Kit：Toast 使用 ArkUI，Clipboard 使用系统剪贴板，Storage 使用 Preferences。

`RuntimeInfoBiz` 只读取内存中的 `BUILTIN_API_MANIFEST`，不需要系统能力，因此没有对应 Imp。

## 5. 响应回到 Promise

handler 返回 `BridgeResponse` 后，`BridgeCallbackExecutor` 先 JSON 序列化，再通过 `WebviewController.runJavaScript()` 调用 H5 的全局 response callback。H5 SDK 根据 requestId 从 callback store 取出记录，清理 timer，并按 code resolve 或 reject Promise。

timeout 由 H5 SDK 判断。请求超时后 callback 已被删除，Native 晚到响应会进入 CALLBACK_LOST 记录，而不会再次结算 Promise。

## 6. Manifest 与生成链

HAR 内的 `ApiManifest.ets` 服务运行时查询；`tools/api-manifest.json` 是 Node 生成工具使用的镜像。`generate-api-docs.js` 生成 API Markdown 和 README 表格，`generate-sdk-types.js` 生成 action、参数、响应类型以及 `createTypedApi()`。

typed helper 最终仍调用 `sendTyped()`，而 `sendTyped()` 继续复用 `send()`，所以项目只有一套 JSBridge 协议和请求生命周期。

## 回读结论

完整链路可以概括为：H5 SDK 管请求生命周期，entry 管容器接入，HAR runtime 管分发与平台能力，Manifest 工具链管能力描述和生成物一致性。每层职责明确后，新增 API 不需要修改 Controller 或 H5 协议。
