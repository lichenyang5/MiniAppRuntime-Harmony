# Web Container Design

这篇文档解决什么问题：说明 MyASCF 如何在 JSBridge 之外建立轻量 Web 容器状态、安全边界和失败恢复能力。

## 组件职责

- `WebContainerConfig` 描述首页、scheme、host、调试开关和 Guard 开关，不依赖 ArkWeb UI。
- `WebUrlGuard` 只判断 URL 和返回拦截原因，不操作页面。
- `WebLoadState` 描述 `idle/loading/success/error/blocked` 状态。
- entry 绑定 ArkWeb 事件，展示进度、错误覆盖层并执行重试。
- `RuntimeLogger` 记录开始、进度、结束、失败和拦截事件。

## 状态流转

正常加载为 `idle -> loading -> success`；主文档加载失败为 `loading -> error`；主文档 URL 未通过 Guard 为 `loading/success -> blocked`。重试按钮重新加载本地首页并回到 `loading`。

## 白名单规则

`resource://rawfile/` 和 `rawfile/` 默认允许，其他 `resource://` 地址拒绝。其他 URL 必须有可识别 scheme；scheme 必须在 `allowedSchemes` 内。`http/https` 还必须命中 `allowedHosts`。`file` 默认不配置，因此被拒绝；空 URL 和无法解析的 URL 被拒绝。

当前 Demo 配置 `resource`、`https` scheme，但 host 白名单为空，因此外部 HTTPS 页面会被拦截。该实现是可演示的轻量边界，不是生产级安全沙箱。

## ArkWeb 事件

当前 SDK 已确认支持 `onPageBegin`、`onProgressChange`、`onPageEnd`、`onErrorReceive` 和 `onLoadIntercept`。错误处理只将主框架请求升级为整页错误，避免图片或样式失败导致页面被覆盖。

entry 负责 ArkWeb、rawfile Resource 和 UI；HAR 负责可复用配置、判断、状态类型和日志。Bridge 协议及 Toast、Clipboard、Storage 链路不受影响。
