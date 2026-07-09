# 阶段 06：runJavaScript 回调治理

这篇文档解决的问题：记录如何把 ArkTS 回调 H5 的 `runJavaScript` 逻辑从 BridgeController 中抽离出来，并补充 H5 timeout 与 callback lost 处理。

## 本步骤目标

本阶段只做回调治理，不新增业务 API。

目标链路：

```text
H5 window.myascf.send
-> H5 生成 requestId 并保存 callback
-> H5 启动 timeout timer
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> ToastBiz / ToastImp
-> BridgeController 调用 BridgeCallbackExecutor.sendResponse(response)
-> BridgeCallbackExecutor 安全拼接 JS 并执行 runJavaScript
-> H5 __myascf_on_native_response__
-> H5 清理 timeout 和 callback
-> Promise resolve / reject
```

## 修改文件

```text
entry/src/main/ets/runtime/bridge/BridgeCallbackExecutor.ets
entry/src/main/ets/runtime/bridge/BridgeController.ets
entry/src/main/ets/runtime/error/BridgeErrorCode.ets
entry/src/main/resources/rawfile/web/js/myascf.js
entry/src/main/resources/rawfile/web/js/demo.js
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/css/demo.css
docs/stages/06-runjavascript-callback.md
docs/architecture/jsbridge-architecture.md
docs/api/error-code.md
docs/debug/common-problems.md
```

## 为什么抽出 BridgeCallbackExecutor

BridgeController 的职责应该保持很薄：

- 接收 raw message。
- 解析 BridgeRequest。
- 调用 BridgeDispatcher。
- 触发 H5 回调。

如果 BridgeController 里继续拼 JS 字符串、处理转义、直接调用 `runJavaScript`，它会越来越难维护。

`BridgeCallbackExecutor` 只负责一件事：把标准 `BridgeResponse` 安全送回 H5。

## 职责边界

### BridgeController

负责：

- 接收 raw message。
- 解析 BridgeRequest。
- 调用 BridgeDispatcher。
- 调用 BridgeCallbackExecutor。

不负责：

- 拼接 JS 字符串。
- 直接调用 `runJavaScript`。
- 业务校验。
- 系统能力调用。

### BridgeCallbackExecutor

负责：

- 序列化 BridgeResponse。
- 对 JSON 字符串做安全转义。
- 拼接 H5 全局回调脚本。
- 执行 `runJavaScript`。
- 记录执行成功或失败日志。

不负责：

- action 分发。
- 参数校验。
- ToastBiz / ToastImp。

## runJavaScript 回调流程

ArkTS 侧生成 response：

```json
{
  "requestId": "string",
  "code": 0,
  "message": "showToast success",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

BridgeCallbackExecutor 会先 `JSON.stringify(response)`，得到 responseText，再对 responseText 做一次 `JSON.stringify`，生成安全的 JS 字符串参数。

最终执行：

```js
window.__myascf_on_native_response__(responseText)
```

二次 stringify 可以避免引号、换行等字符破坏 JS 脚本。

## H5 Callback Map 生命周期

H5 每次调用 `window.myascf.send(action, params, options?)` 时会：

1. 生成 requestId。
2. 创建 Promise。
3. 创建 timeout timer。
4. 保存 callback 到 map。
5. 调用 `window.MyASCFNative.postMessage(requestText)`。

收到 ArkTS response 后：

1. 根据 requestId 查找 callback。
2. 找到后清理 timer。
3. 删除 callback。
4. code 为 0 时 resolve。
5. code 非 0 时 reject。

## TIMEOUT

默认 timeout 为 5000ms。调用方也可以传：

```js
window.myascf.send("ui.showToast", { message: "timeout test" }, { timeout: 1 })
```

如果超时前没有收到 response，H5 会：

- 删除 callback。
- reject 一个 `TIMEOUT` 响应对象。
- 页面展示 timeout 结果。

## CALLBACK_LOST

如果 ArkTS response 到达时 callback 已经不存在，H5 会认为出现 callback lost。

常见原因：

- 请求已经 timeout。
- 页面刷新后 callback map 被清空。
- requestId 不匹配。

处理方式：

- 输出 `CALLBACK_LOST` console.warn。
- 不抛异常。
- 不影响其他请求。
- demo 页面会追加一条事件日志。

## 当前实现范围

已实现：

- BridgeCallbackExecutor。
- BridgeController 不再直接拼接 JS。
- BridgeController 不再直接调用 `runJavaScript`。
- H5 默认 timeout。
- H5 自定义 timeout。
- H5 callback lost 识别。
- demo 页面增加正常调用、参数错误、未知 action、timeout 测试。

未实现：

- DebugPanel 可视化。
- 更复杂的调用链耗时统计。
- Native 侧主动取消 H5 callback。

## 验收标准

- 正常 `ui.showToast` 可以 resolve。
- 参数错误可以 reject。
- 未知 action 可以 reject。
- 极短 timeout 可以 reject TIMEOUT。
- timeout 后如果迟到 response 到达，H5 输出 CALLBACK_LOST 日志。
- BridgeController 不直接拼 JS，也不直接调用 `runJavaScript`。

## 下一步计划

下一步可以补充 DebugPanel / RuntimeLogger 可视化，或者继续扩展第二个 API。
