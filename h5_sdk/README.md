# miniapp-runtime-harmony-web-sdk

这篇文档解决什么问题：说明 H5 SDK 的职责、构建方式、Demo 同步流程和当前边界。

`miniapp-runtime-harmony-web-sdk` 是 MiniAppRuntime-Harmony 的浏览器侧 JSBridge SDK。它把 `window.myascf.send`、requestId、callback map、timeout 和 Native 回调处理从 H5 Demo 中抽离出来，与 ArkTS 侧 `myascf_runtime` HAR 共同组成通信两端。

本目录服务于个人开源学习与工程实践项目，不包含具体 Toast、Clipboard 或 Storage 业务实现。

## 与 ArkTS HAR 的关系

```text
H5 application
-> miniapp-runtime-harmony-web-sdk
-> window.MyASCFNative.postMessage
-> myascf_runtime HAR
-> window.__myascf_on_native_response__
-> web SDK callback map
-> Promise resolve / reject
```

H5 SDK 管理浏览器侧请求生命周期，HAR 管理 ArkTS 侧解析、分发、注册、Biz/Imp 和平台调用。两者共享现有 BridgeRequest / BridgeResponse 协议，但不互相包含。

## 安装与构建

在仓库根目录执行：

```bash
npm --prefix h5_sdk install
npm run h5:build
```

构建产物：

```text
dist/myascf.js
dist/myascf.d.ts
```

项目只使用 TypeScript 编译器，不引入 Vite、Webpack 或 Rollup。

## Package Status

- Candidate version: `0.1.0`。
- Package name: `miniapp-runtime-harmony-web-sdk`，发布前仍需确认 npm 可用性。
- `private: true`：当前用于阻止误执行 npm publish。
- 候选包文件：dist、README、LICENSE 和 CHANGELOG。
- 当前没有发布到 npm；本地使用不依赖 npm registry。

## 同步到 Demo

```bash
npm run h5:sync
```

该命令先构建 SDK，再把 `dist/myascf.js` 复制到：

```text
entry/src/main/resources/rawfile/web/js/myascf.js
```

rawfile 中的文件是同步产物，不应独立维护 Bridge 逻辑。

## H5 调用

```js
const response = await window.myascf.send('system.storage.getItem', {
  key: 'username'
}, {
  timeout: 5000
});

console.log(response.data.value);
```

## 核心能力

- 生成唯一 requestId。
- 维护并发请求 callback map。
- 通过 `window.MyASCFNative.postMessage` 发送请求。
- 通过 `window.__myascf_on_native_response__` 接收响应。
- 根据 `code` resolve 或 reject Promise。
- 处理 TIMEOUT、CALLBACK_LOST、NATIVE_UNAVAILABLE 和 INVALID_RESPONSE。
- 容错调用 DebugPanel 生命周期钩子。
- 提供 BridgeRequest、BridgeResponse、ApiSummary 和 `window.myascf` 类型声明。

## 错误处理

| Code | Name | 说明 |
| --- | --- | --- |
| `1004` | CALLBACK_LOST | 响应返回时 callback 已不存在，只记录告警，不抛未捕获异常 |
| `1005` | TIMEOUT | 超时后删除 callback 并 reject |
| `1006` | NATIVE_UNAVAILABLE | 当前页面没有 ArkWeb 注入的 Native 代理 |
| `1007` | INVALID_RESPONSE | Native 响应无法解析或结构不符合协议 |

## 当前限制

- SDK 当前通过仓库内复制脚本接入 HarmonyOS rawfile，尚未发布到 npm。
- API action 与参数仍使用基础接口，不提供逐 action 的泛型推导。
- 类型尚未从 API Manifest 自动生成。
- SDK 不替代容器白名单、安全策略或 Native 参数校验。

## 后续方向

后续先执行 `npm pack --dry-run` 检查候选包内容，再根据包名、类型、测试和文档状态决定是否发布。完整流程维护在仓库的 `docs/release/npm-publish-checklist.md`。
