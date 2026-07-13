# 不只是调 API：给 HarmonyOS Web 容器补上 Storage、加载状态和错误页

这篇文档解决什么问题：说明为什么在 Toast 和 Clipboard 之后选择 Storage，以及 JSBridge 与 Web 容器能力如何并行演进。

## 为什么选择 Storage

Toast 是一次性 UI 调用，Clipboard 是系统数据能力，Storage 则带有持久状态。它不依赖网络，适合验证参数校验、返回值、幂等删除、清空和异常转换。

```text
system.storage.setItem/getItem/removeItem/clear
-> HandlerRegistry
-> StorageBiz
-> StorageImp
-> Preferences
```

StorageBiz 校验非空 key 和字符串 value，并组织 BridgeResponse；StorageImp 只调用 Preferences。Preferences 需要 Context，因此 MyASCFRuntime 在构造时接收 Context，再由内部 Bootstrap 完成注册。BridgeController、Dispatcher 和 CallbackExecutor 不需要修改。

## Web 容器为什么还要增强

能调用 Native API 不代表容器已经完整。页面加载时需要进度，失败时不能白屏，导航前需要最基本的 URL 边界。

当前 entry 使用 ArkWeb 的 page begin、progress、page end、error 和 load intercept 事件维护 WebLoadState。WebUrlGuard 允许本地 rawfile，对远程 HTTP(S) 同时检查 scheme 和 host；被拦截或主页面加载失败时显示原因、URL 和重试首页按钮。

## Web 容器与 JSBridge 的关系

JSBridge 管理 H5 与 ArkTS 的能力调用；WebContainer 管理 H5 页面能否加载、加载到什么状态。两者共享 ArkWeb 和 RuntimeLogger，但不把 action 业务写进容器页面，也不把错误页逻辑写进 BridgeController。

当前 Guard 是轻量演示边界，不包含证书、下载、资源完整性或完整远程内容治理。它证明项目开始同时关注通信能力和运行环境，而不仅是增加 API 数量。
