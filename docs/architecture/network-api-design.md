# Network API 设计

这篇文档解决什么问题：解释 `network.request` 如何验证当前 JSBridge 架构对复杂异步能力的承载能力，以及各层职责边界。

## 调用链

```text
H5 SDK
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> NetworkBiz
-> NetworkImp
-> @kit.NetworkKit http
-> BridgeCallbackExecutor
-> H5 Promise
```

`BridgeController` 不判断网络 action，`BridgeDispatcher` 不包含 HTTP 逻辑，`HandlerRegistry` 只保存 action-handler 映射。`RuntimeBootstrap` 创建并注册 `NetworkBiz` 与 `NetworkImp`。

## Biz / Imp 分工

`NetworkBiz` 负责 URL、协议、host、method、headers、timeout、body 与 responseType 校验，补齐默认值，解析 JSON，计算 HTTP `ok`，并把可识别传输异常映射为 BridgeResponse。

`NetworkImp` 只接收 `NormalizedNetworkRequest`，不接触 BridgeRequest 或 H5 callback。它创建 HttpRequest、设置请求选项、通过总计时器约束完整请求、读取纯网络结果，并在 `finally` 中清理 timer 和执行 `destroy()`。

## 可测试边界

参数归一化集中在 `NetworkRequestValidator`。它不执行 HTTP，便于针对空 URL、非法协议、method、timeout、默认值和 allowlist 做独立验证。当前仓库尚未配置 ArkTS 单元测试 runner，因此自动化侧覆盖 Manifest、typed helper、SDK resolve/reject 与脱敏，Validator 场景记录在手工 smoke test。

## 错误映射

HarmonyOS `2300028` 映射为 `NETWORK_TIMEOUT`；其他传输失败映射为 `NETWORK_REQUEST_FAILED`；非字符串 Native body 或非空 JSON 解析失败映射为 `NETWORK_INVALID_RESPONSE`。

HTTP 状态与 Bridge 状态保持正交：拿到 2xx/4xx/5xx 响应都返回 Bridge `SUCCESS`，只通过 `data.ok` 和 `data.statusCode` 表达 HTTP 结果。`ok` 固定由 `statusCode >= 200 && statusCode < 300` 计算。

## 安全边界

- 默认只允许 HTTP/HTTPS，可通过 `NetworkPolicy` 收紧协议和 host。
- 禁用自动重定向，避免初始 host allowlist 被 30x 绕过。
- 拒绝 URL credentials 和包含 CR/LF 的 Header。
- RuntimeLogger 不记录原始 Bridge message。
- 网络日志移除 URL query，只记录 Header 名称和 body 长度。
- H5 DebugPanel 对请求与响应做摘要，只记录 Header 名称和 body 长度。
- 当前实现不是完整生产网络框架，不包含证书绑定、Cookie 系统、重试、下载、上传或 WebSocket。
