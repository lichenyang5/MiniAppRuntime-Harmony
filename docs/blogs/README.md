# MiniAppRuntime-Harmony 博客系列

这篇文档解决什么问题：说明博客系列的主题、发布顺序、每篇文章的核心问题和公开写作边界。

## 推荐发布顺序

1. [总览：从 ArkWeb 到轻量运行时](01-overview-harmony-mini-runtime.md)
2. [ArkWeb 加载本地 H5](02-arkweb-load-local-h5.md)
3. [JSBridge Promise 与 requestId](03-jsbridge-promise-requestid.md)
4. [Dispatcher、Registry 与 Biz/Imp](04-dispatcher-registry-biz-imp.md)
5. [Timeout 与 Callback Lost](05-timeout-callback-lost.md)
6. [从 Demo 到本地 HAR](06-local-har-runtime-and-facade.md)
7. [Storage 与 Web 容器增强](07-storage-and-web-container.md)
8. [项目总结、简历与面试](08-project-summary-resume-interview.md)

## 掘金标题建议

- 从 ArkWeb 容器到 JSBridge 运行时：一个 HarmonyOS 跨端项目的完整链路
- HarmonyOS ArkWeb 如何稳定加载本地 H5
- 用 requestId 和 Promise 设计 H5 到 ArkTS 的 JSBridge
- 告别 Controller 里的 if else：Dispatcher、Registry 与 Biz/Imp
- JSBridge 的异步治理：Timeout、Callback Lost 与统一回调
- 从 Demo 到本地 HAR 包：把 HarmonyOS JSBridge 运行时做成可复用框架
- 不只是调 API：给 HarmonyOS Web 容器补上 Storage、加载状态和错误页
- 如何把一个 HarmonyOS JSBridge 项目讲成有价值的框架项目

## 当前项目状态

代码已经完成本地 H5、Promise JSBridge、Dispatcher/Registry、Biz/Imp、Toast/Clipboard/Storage、DebugPanel、本地 HAR、MyASCFRuntime 门面，以及加载进度、URL Guard 和错误状态。截图和文章正式发布仍待完成。

## 公开边界

文章只讲当前仓库自行实现的代码和公开 HarmonyOS 能力，不引用非公开材料，不把学习项目描述为完整平台或生产级 SDK。
