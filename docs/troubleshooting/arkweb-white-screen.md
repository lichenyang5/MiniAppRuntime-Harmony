# ArkWeb 白屏

你将学会什么：从 rawfile、Vite base、资源同步和 Web 事件四层定位本地页面白屏。

先确认入口真实存在：

```text
entry/src/main/resources/rawfile/web/index.html
```

ArkTS 使用 `$rawfile('web/index.html')`。Vite 必须配置 `base: './'`，否则构建 HTML 可能引用 `/assets/...`。重新执行 H5 build 和 rawfile 同步，再 Clean/Rebuild。

通过 ArkWeb `onPageBegin`、`onPageEnd`、`onErrorReceive` 查看 URL 与错误。若 HTML 显示但按钮无效，问题已经从“页面加载”转为“SDK 或 Proxy 注入”，继续检查四个全局对象。

## 下一步阅读

- [Quick Start](../getting-started/quick-start.md)
- [调试](../guide/debugging.md)
