# Stage 13: Web Container Guard And Error Page

这篇文档解决什么问题：记录加载进度、URL 白名单和错误恢复如何接入现有 ArkWeb Demo。

## 目标

让框架不仅能够注入 JSBridge，也能描述加载状态、阻止未授权导航，并在主页面失败时避免白屏。

## 实现链路

entry 创建 `WebContainerConfig` 和 `WebUrlGuard`，ArkWeb 开始加载时进入 loading，进度事件更新百分比，结束后进入 success。`onLoadIntercept` 校验每个请求；主文档被拒绝时进入 blocked。`onErrorReceive` 捕获主文档失败并进入 error。error/blocked 都显示原因、当前 URL 和重试首页按钮。

RuntimeLogger 记录容器事件；H5 增加当前 URL 和外链拦截测试按钮。JSBridge 协议、RuntimeBootstrap 和已有 Native API 没有修改。

## 验收

- 本地 H5 正常加载，进度从 loading 到 success。
- 点击白名单测试按钮后外链被拦截并显示错误状态。
- 主页面加载错误时显示错误覆盖层而不是白屏。
- 重试首页可恢复本地 H5。
- Toast、Clipboard、Storage、Timeout 和 DebugPanel 保持可用。

当前不提供生产级沙箱、远程首页配置管理或证书策略。下一步可选择 Network API、API 文档生成或 H5 SDK npm 化。
