# HarmonyOS ArkWeb 加载本地 H5

这篇文档解决什么问题：说明为什么第一步选择 rawfile 本地页面，以及如何建立稳定、可重复验证的 Web 容器起点。

JSBridge 的第一步不是分发器，而是确认容器能稳定展示页面。使用 `$rawfile('web/index.html')` 可以避免网络、证书、服务可用性和远程缓存干扰，让问题集中在 ArkWeb、资源路径和页面脚本。

```ts
private controller: webview.WebviewController = new webview.WebviewController();

Web({ src: $rawfile('web/index.html'), controller: this.controller })
```

H5 按 HTML、CSS、JS 分开组织。最初按钮只打印 console，用来确认页面与脚本都被加载；随后再加入 `window.myascf.send`。

WebviewController 后续还承担 `runJavaScript` 回调和重试首页。提前建立稳定的 Controller 生命周期，可以避免 Bridge 阶段重新改页面结构。

当前容器已经加入 `onPageBegin`、`onProgressChange`、`onPageEnd`、`onErrorReceive` 和 `onLoadIntercept`，维护 loading/success/error/blocked 状态。本地 rawfile 默认允许，外部 URL 经过轻量 Guard 判断。

这一步的经验是：先完成本地资源闭环，再接通信协议；先确认页面生命周期，再加入 Native 能力。
