# MyASCF / ArkMiniRuntime 文档

这篇文档解决的问题：作为 docs 首页，帮助读者按正确顺序理解这个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。

## 文档目录

- `overview/`：项目定位、当前状态和 Roadmap。
- `architecture/`：运行时结构、JSBridge 链路、HAR 模块、API 注册和 Biz/Imp 分层设计。
- `stages/`：按阶段记录每一步为什么做、改了什么、如何验收。
- `api/`：当前已接入 API 和错误码说明。
- `debug/`：DebugPanel、RuntimeLogger 和常见问题排查。
- `assets/`：架构图文本、截图占位和后续展示素材。

## 推荐阅读顺序

1. `overview/project-introduction.md`
2. `overview/roadmap.md`
3. `architecture/runtime-architecture.md`
4. `architecture/jsbridge-architecture.md`
5. `architecture/har-module-design.md`
6. `stages/02-load-local-h5-with-arkweb.md`
7. `stages/03-h5-to-arkts-javascript-proxy.md`
8. `stages/04-dispatcher-and-registry.md`
9. `stages/05-toast-biz-imp.md`
10. `stages/06-runjavascript-callback.md`
11. `stages/07-clipboard-api.md`
12. `stages/08-debug-panel.md`
13. `stages/09-extract-runtime-to-har.md`
14. `stages/10-github-showcase.md`
15. `stages/11-myascf-runtime-facade.md`

## 阶段文档解决什么问题

- 阶段 01：项目初始化、目录规划和第一阶段架构目标。
- 阶段 02：让 ArkWeb 成功加载本地 H5。
- 阶段 03：打通 H5 到 ArkTS 的 JavaScriptProxy 通信边界。
- 阶段 04：引入 Dispatcher / Registry，让 action 分发可扩展。
- 阶段 05：用 ToastBiz / ToastImp 接入第一个真实 API。
- 阶段 06：抽出 BridgeCallbackExecutor，并处理 timeout / callback lost。
- 阶段 07：接入 Clipboard API，验证第二个真实 API 的扩展方式。
- 阶段 08：用 H5 DebugPanel 可视化 JSBridge 调用链路。
- 阶段 09：把 runtime 抽取为 `myascf_runtime` HAR 模块。
- 阶段 10：整理 GitHub README、架构图和项目展示文档。
- 阶段 11：用 `MyASCFRuntime` 封装 HAR 对外入口。

## 如何理解整个框架

可以按三层看：

1. `entry` 是示例应用，负责启动、ArkWeb 页面和 H5 Demo。
2. `myascf_runtime` 是框架核心，负责 JSBridge、分发、注册、Biz/Imp、错误码和回调。
3. `docs` 记录每个阶段的设计取舍，方便复盘和面试讲解。

核心链路是：

```text
H5 send
-> JavaScriptProxy
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> Biz
-> Imp
-> BridgeCallbackExecutor
-> H5 Promise
```

## 面试讲解推荐路径

1. 先讲项目目标：HarmonyOS Web 容器与 JSBridge 框架。
2. 讲为什么不是普通 WebView Demo：它有 requestId、callback map、Dispatcher、Registry、Biz/Imp、CallbackExecutor。
3. 讲 ArkWeb 加载本地 H5 和 JavaScriptProxy 通信边界。
4. 讲 `ui.showToast` 如何从 H5 走到 ArkTS 系统能力。
5. 讲 Clipboard 证明 API 扩展不是硬编码。
6. 讲 timeout、callback lost 和标准错误码。
7. 讲 DebugPanel 如何把链路变成可观察的 Demo。
8. 讲 HAR 模块化如何让 `entry` 和 runtime 解耦。
9. 讲 `MyASCFRuntime` 如何降低 Demo 接入成本，并隐藏内部组装细节。

## 当前状态

当前已完成 ArkWeb 本地 H5、JSBridge 双向通信、Dispatcher / Registry、Toast、Clipboard、错误链路、DebugPanel 和 runtime HAR 模块化。

Storage / Network / 白名单与错误页仍是后续计划。
## Storage API

第三组真实 API 已完成，参见 [Storage API](api/storage.md) 和 [Stage 12](stages/12-storage-api.md)。
## Web 容器

容器增强设计参见 [Web Container Design](architecture/web-container-design.md) 和 [Stage 13](stages/13-web-container-guard-error-page.md)。
