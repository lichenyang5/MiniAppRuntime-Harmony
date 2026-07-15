# H5 SDK Source Map

这篇文档解决什么问题：说明 H5 SDK 如何管理一次跨端请求，以及它与 Demo、ArkTS HAR runtime 的边界。

| File | Role | Key Logic |
| --- | --- | --- |
| `client.ts` | SDK 核心客户端 | `send` 创建请求、登记 callback/timeout；`handleNativeResponse` 校验响应并结算 Promise |
| `index.ts` | ESM 公共入口 | 导出类型、工厂和 typed API；`initMyASCF` 挂载全局对象与 response callback |
| `auto-init.ts` | IIFE 自动入口 | 重导出 SDK，并在脚本加载时执行 `initMyASCF()` |
| `request-id.ts` | requestId 生成器 | 时间戳加进程内递增序号，使并发请求可关联和追踪 |
| `callback-store.ts` | callback 生命周期容器 | `set` 保存 Promise 处理器；`take` 读取后删除，防止重复结算；`delete` 供 timeout 清理 |
| `native-adapter.ts` | Native 注入适配 | 检查 `window.MyASCFNative.postMessage`，序列化请求；代理不存在时返回 NATIVE_UNAVAILABLE |
| `bridge-types.ts` | H5 协议类型 | 定义 request、response、callback、debug 和 Window 扩展 |
| `debug-adapter.ts` | 可选调试钩子 | 安全调用 DebugPanel，调试面板异常不影响主流程 |
| `generated/api-types.ts` | 生成的 typed 类型 | action union、参数映射、响应映射和 send 参数约束 |
| `generated/api-client.ts` | 生成的 typed facade | nested API 最终调用 `client.sendTyped()` |

## send 做了什么

1. 生成 requestId 和 BridgeRequest。
2. 记录 DebugPanel pending 状态。
3. 启动 H5 侧 timeout timer。
4. 把 resolve、reject、timer、action 和时间存入 callback store。
5. 通过 NativeAdapter 调用 ArkWeb 注入对象。
6. Native response 返回后按 requestId `take` callback，清理 timer，按 code 结算 Promise。

## 三个必须分清的对象

- H5 SDK 不是 Native 能力，它是 H5 侧 JSBridge 客户端。
- Demo 只是 SDK 的使用者，负责按钮、状态和结果展示。
- ArkTS HAR runtime 才负责 action 分发、参数业务校验和 HarmonyOS 能力调用。

## timeout 与 callback lost

timeout 表示 H5 在规定时间内没有拿到响应，因此主动删除 callback 并 reject。CALLBACK_LOST 表示后来收到响应时已经找不到 callback，常见原因是响应晚于 timeout。二者是同一生命周期中的不同观察点。
