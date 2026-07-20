# Demo Walkthrough

这篇文档解决什么问题：提供一条可重复的现场演示路径，每一步都说明操作、预期结果和失败时的排查入口。

## 演示前准备

```bash
npm --prefix h5_sdk install
npm run h5:sync
npm run check
```

随后在 DevEco Studio 中 Sync、Clean、Rebuild `entry`，使用模拟器或真机运行。Clipboard 权限行为以目标 SDK 和设备为准。

当前截图证据及缺口见 [Screenshot Evidence](../assets/screenshots/README.md)。缺少截图的步骤仍应现场操作，不把源码存在当作运行通过。

## 1. 启动 entry Demo

**操作：**运行 `entry` 模块。

**预期结果：**应用进入 ArkWeb 容器页，没有 ArkTS 编译错误或启动崩溃。

**失败排查：**检查本地 HAR 依赖、根 `build-profile.json5`、`entry/oh-package.json5` 和 [HAR 接入指南](../guide/har-usage.md)。

## 2. 查看 H5 首页

**操作：**等待本地 `rawfile/web/index.html` 加载完成。

**预期结果：**显示 Demo 标题、API 操作区域和 DebugPanel，容器状态从 loading 进入 success。

**失败排查：**检查 rawfile 路径、H5 SDK 同步产物、ArkWeb console 和 RuntimeLogger。

## 3. 调用 Toast

**操作：**触发 `ui.showToast`。

**预期结果：**系统显示 Toast，H5 Promise resolve，DebugPanel 出现成功记录。

**失败排查：**查看参数是否包含非空 `message`，再沿 Dispatcher、ToastBiz、ToastImp 和回调日志排查。

## 4. 测试 Clipboard

**操作：**先写入测试文本，再读取剪贴板。

**预期结果：**write/read Promise 正常结束，读取结果与设备实际剪贴板一致。

**失败排查：**优先检查权限、系统限制和设备差异，再查看 ClipboardBiz/Imp 日志。

## 5. 测试 Storage

**操作：**依次执行 set、get、remove、clear。

**预期结果：**get 返回刚写入值，remove 后不再得到旧值，clear 清除测试数据。

**失败排查：**检查 key/value 参数、Context 注入、Preferences 初始化与 StorageBiz/Imp 日志。

## 6. 加载 API 列表

**操作：**调用 `runtime.getApiList`。

**预期结果：**返回当前 9 个内置 action，DebugPanel 能以 Manifest 数据展示能力列表。

**失败排查：**运行 `npm run check:api`，检查 RuntimeBootstrap 注册和 API Manifest 是否对齐。

## 7. 测试 Network Request

**操作：**先使用默认 GET 示例观察 200；再切换 POST，确认 Demo 将示例路径从 `/todos/1` 调整为 `/todos`，检查可编辑 Headers 和 Body 后发送。

**预期结果：**200/201 resolve 且 `ok=true`。如果目标服务返回 404/500，Promise 仍 resolve，但 `ok=false` 并保留真实 `statusCode`。404 通常表示服务端没有对应 Method 路由，不代表 Bridge 失败。

**失败排查：**先区分 DebugPanel 中的 Bridge 与 HTTP 状态。只有非法协议、DNS、连接失败或 timeout 才应 reject；第三方示例服务仅用于临时验证，不是项目强依赖。

## 8. 查看 DebugPanel

**操作：**连续调用多个 API，展开最近调用记录。

**预期结果：**普通记录包含 requestId、action、状态和耗时；Network 记录额外区分 Bridge RESOLVED/REJECTED、HTTP、OK、Duration 和 Error Code。清空/导出不影响 JSBridge 主流程。

**失败排查：**检查 `window.MyASCFDebugPanel` 生命周期方法和浏览器 console。DebugPanel 异常应被 SDK 隔离。

## 9. 测试错误场景

**操作：**发送未知 action、缺少必填参数，并在可控环境中模拟超时或晚到响应。

**预期结果：**分别观察 UNKNOWN_ACTION、PARAM_ERROR、TIMEOUT 和 CALLBACK_LOST；应用不崩溃，Promise 不被重复结算。

**失败排查：**查看 H5 callback map、BridgeErrorCode、Dispatcher 和 CallbackExecutor 日志，不在 Web 页面临时增加 action 分支。

## 10. 查看 Web 容器状态

**操作：**观察首次加载进度，尝试不允许的 URL，并验证错误页重试。

**预期结果：**loading/progress/success 可见；URL Guard 将不允许目标标记为 blocked；加载失败后可重试。

**失败排查：**检查 `WebLoadState`、`WebUrlGuard`、ArkWeb 事件和 [Web 容器设计](../architecture/web-container-design.md)。

## 演示收尾

展示 [架构图](../assets/diagrams/runtime-architecture.md)、[API 总览](../api/index.md) 与 [测试边界](../testing/README.md)，明确 CI 通过不替代设备验证。

最后打开 [v0.1.0 自检报告](../release/v0.1.0-self-check-report.md)，主动说明已验证项、待补截图和发布边界。
