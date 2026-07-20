# HarmonyOS 手工冒烟测试

这篇文档解决什么问题：提供一份可重复执行的真机或模拟器检查清单，验证 Node 自动测试无法覆盖的 ArkWeb、HAR 与 HarmonyOS Native 链路。

GitHub Actions 只覆盖 H5 SDK 和 Node 工具链。即使 CI 通过，ArkWeb、HarmonyOS Kit、权限和设备 UI 仍必须按本文手工验证。

## 测试记录

- 日期：`__________`
- 分支 / Commit：`__________`
- DevEco Studio：`__________`
- HarmonyOS SDK / API：`__________`
- 设备与系统版本：`__________`
- 执行人：`__________`

## 环境检查

- [ ] DevEco Studio 可以打开并同步工程。
- [ ] `myascf_runtime` 本地 HAR 依赖可以解析。
- [ ] `entry` 完成 Clean 和 Rebuild，没有 ArkTS 编译错误。
- [ ] 模拟器或真机可以安装并启动 entry Demo。
- [ ] ArkWeb 能加载 `rawfile/web/index.html`。
- [ ] H5 页面样式、按钮和 DebugPanel 正常显示。

## JSBridge 与 API

- [ ] `ui.showToast` 显示预期文本，Promise resolve。
- [ ] `system.clipboard.writeText` 写入文本并返回成功。
- [ ] `system.clipboard.readText` 读取文本；权限行为符合当前 SDK 和设备要求。
- [ ] `system.storage.setItem` 写入键值。
- [ ] `system.storage.getItem` 读取相同键值。
- [ ] `system.storage.removeItem` 删除指定键。
- [ ] 删除后 `getItem` 返回当前协议约定的结果。
- [ ] `system.storage.clear` 清空测试数据。
- [ ] `runtime.getApiList` 返回 9 个当前内置 action，内容与 API 文档一致。
- [ ] `network.request` GET 200 resolve，返回 `ok=true`、状态码、headers 摘要、body 和 duration。
- [ ] `network.request` POST 在可控测试服务上可返回预期响应。
- [ ] HTTP 201 resolve 且 `ok=true`。
- [ ] HTTP 204 resolve、`ok=true` 且 `body=null`。
- [ ] `responseType=json` 返回对象或数组，`responseType=text` 返回字符串。
- [ ] 空 URL 返回 `PARAM_ERROR`，非法 URL 返回 `NETWORK_INVALID_URL`。
- [ ] `javascript:`、`file:`、`data:` 等协议返回 `NETWORK_UNSUPPORTED_PROTOCOL`。
- [ ] 带 `username:password@host` 的 URL 返回 `NETWORK_INVALID_URL`。
- [ ] 非法 method、越界 timeout、非字符串 Header value 或 CR/LF Header 返回 `PARAM_ERROR`。
- [ ] 未传 method/timeout/responseType 时分别使用 `GET`、`10000ms`、`text`。
- [ ] 30x 不自动跟随，host allowlist 不能被重定向绕过。
- [ ] 断网或 DNS/连接失败返回 `NETWORK_REQUEST_FAILED`。
- [ ] Native 网络超时返回 `NETWORK_TIMEOUT`。
- [ ] H5 SDK timeout 小于网络耗时时返回 `TIMEOUT`，晚到响应进入 `CALLBACK_LOST`。
- [ ] 点击 Cancel Request 后 Promise reject `AbortError / ABORTED`，页面显示 `CANCELLED`。
- [ ] `ABORTED`、SDK `TIMEOUT` 和 Native `NETWORK_TIMEOUT` 可以明确区分。
- [ ] 同时发起两个请求时，取消其中一个不影响另一个完成。
- [ ] 主动取消后的晚到响应显示 `LATE_RESPONSE_AFTER_ABORT`，不触发普通 `CALLBACK_LOST`。
- [ ] 请求成功或 timeout 后再次调用 controller.abort() 不产生第二次 settle。
- [ ] HTTP 404/500 仍 resolve、Bridge `SUCCESS`、`data.ok=false`，并保留真实 `statusCode`。
- [ ] POST 404 被识别为服务端路由结果，不误判为 Bridge 或 NetworkImp 失败。
- [ ] 未注册 action 返回 `UNKNOWN_ACTION`，应用不崩溃。
- [ ] 缺少必填参数返回 `PARAM_ERROR`，Promise reject。
- [ ] 人为阻断或延迟回调后返回 `TIMEOUT`。
- [ ] 超时后的晚到响应被记录为 `CALLBACK_LOST`，不会再次改变 Promise。

## H5 SDK

- [ ] rawfile Demo 使用 IIFE 产物并挂载 `window.myascf`。
- [ ] `examples/sdk-consumer-demo` 可以通过 ESM import 使用本地 tarball。
- [ ] typed `ui.showToast`、`system.storage.getItem` 与 `runtime.getApiList` helper 可调用。
- [ ] typed `api.network.request(params, options)` 正确传递 network timeout 与 SDK timeout。
- [ ] 在无 `MyASCFNative` 的普通浏览器环境调用时 reject `NATIVE_UNAVAILABLE`。
- [ ] IIFE 和 ESM 的 BridgeRequest / BridgeResponse 结构保持一致。

## Web 容器

- [ ] 首次加载显示进度或 loading 状态。
- [ ] 加载完成后进入 success 状态，进度 UI 消失。
- [ ] 白名单内本地页面正常加载。
- [ ] 不允许的 URL 被 URL Guard 拦截并显示 blocked 状态。
- [ ] 主页面加载失败时显示错误页。
- [ ] 修复加载条件后点击重试可以恢复页面。
- [ ] RuntimeLogger 能看到关键加载、拦截、请求和响应日志。

## DebugPanel

- [ ] 每次调用能看到 requestId、action、开始和结束状态。
- [ ] Native 错误与 timeout 能显示错误记录。
- [ ] callback lost 能显示 lost 记录。
- [ ] API 列表来自 `runtime.getApiList`，没有额外静态 action 清单漂移。
- [ ] Network 调试记录不包含 URL query、Authorization/Cookie 值或完整 body。
- [ ] Network 调试记录分别显示 Bridge、HTTP、OK、Duration 和 Error Code。
- [ ] Network 主动取消显示 `CANCELLED / ABORTED`，晚到响应显示 `LATE_RESPONSE_AFTER_ABORT`。
- [ ] 清空与导出调试记录功能可用。

## 文档与包

- [ ] 根 README API 表格包含 9 个 action。
- [ ] `docs/api/generated-api-table.md` 与 generated manifest 已刷新。
- [ ] typed API 使用文档与实际导出一致。
- [ ] release 文档和 CHANGELOG 状态真实，没有误写已发布。
- [ ] `npm run check` 通过，pack 预览包含 IIFE、ESM 与 d.ts。

## 结果

- [ ] 通过
- [ ] 有条件通过，问题记录：`______________________________`
- [ ] 不通过，阻塞问题：`__________________________________`
