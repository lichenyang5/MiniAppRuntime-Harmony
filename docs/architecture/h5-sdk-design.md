# H5 SDK 设计

这篇文档解决什么问题：解释为什么抽离 H5 SDK，以及浏览器侧请求生命周期如何与 ArkTS HAR 配合。

## 为什么抽离

原始 `myascf.js` 已经具备完整通信能力，但它位于 Demo rawfile 中，容易让通信逻辑与页面按钮、展示代码被视为同一层。抽离后，仓库形成清晰的两端结构：

```text
h5_sdk                         浏览器调用侧
myascf_runtime HAR             ArkTS 执行侧
entry                          集成与演示
```

`h5_sdk` 当前候选版本为 `0.1.0`，包入口只指向 `dist/myascf.js` 和 `dist/myascf.d.ts`。源码、构建脚本和测试保留在仓库中，但不进入未来 npm 候选包。

## SDK 负责什么

- 暴露 `window.myascf.send`。
- 生成 requestId 并维护 callback map。
- 启动和清理 timeout。
- 调用 `window.MyASCFNative.postMessage`。
- 接收 `window.__myascf_on_native_response__`。
- resolve / reject Promise。
- 处理 H5 侧错误并通知 DebugPanel。

## SDK 不负责什么

- 不实现 Toast、Clipboard、Storage 等业务。
- 不调用 HarmonyOS Kit。
- 不负责 Dispatcher、Registry、Biz/Imp 或 HAR 初始化。
- 不负责 ArkWeb 加载状态、URL Guard 和错误页。
- 不改变 BridgeRequest / BridgeResponse 协议。

## requestId

requestId 由时间戳和当前页面内递增序号组成：

```text
myascf_<timestamp>_<sequence>
```

它不承担安全凭证职责，只用于把异步响应匹配到当前页面中的请求。

## callback map

`CallbackStore` 以 requestId 为 key，保存 resolve、reject、timer、action、params 和 createdAt。响应、timeout 或发送失败都会删除记录并清理 timer，避免同一 Promise 被重复结算。

## Timeout 与 Callback Lost

timeout 先删除 callback，再 reject `TIMEOUT`。如果 Native 响应随后到达，SDK 找不到 callback，会记录 `CALLBACK_LOST` 并调用可选的 `window.__myascf_on_callback_lost__`，但不会抛出未捕获异常。

## Native Adapter

`NativeAdapter` 隔离 `window.MyASCFNative` 检查和序列化发送。普通浏览器中代理不存在时返回 `NATIVE_UNAVAILABLE`；请求无法序列化时返回 `INVALID_RESPONSE`，主页面不会直接崩溃。

## Invalid Response

SDK 校验 response 的 requestId、code、message 和 data 结构。可识别 requestId 的非法响应会结束对应 Promise；完全无法识别的输入只记录错误，不影响其他 callback。

## DebugPanel 集成

SDK 通过容错调用连接 DebugPanel：

```text
send                 -> recordStart
response             -> recordEnd
timeout/send failure -> recordError
late response        -> recordLost
invalid response     -> recordError
```

DebugPanel 未加载、方法缺失或内部抛错时，SDK 只输出 warn，Promise 主链路继续执行。

## 构建与 Demo 同步

TypeScript 使用 `outFile` 生成单个 `dist/myascf.js` 和 `dist/myascf.d.ts`。复制脚本把 JS 产物同步到 rawfile 原路径，因此 Demo HTML 和调用代码无需变化。

## npm 化方向

当前先保持单文件全局 SDK，适合 ArkWeb rawfile。package 元数据已准备，但仍保持 `private: true`，没有执行 npm publish。后续先做 `npm pack --dry-run`、包名确认和逐 action 类型，再决定是否增加 ES Module 产物或正式发布。
