# Changelog

这份文件记录 `miniapp-runtime-harmony-web-sdk` 的公开变化。

## [0.1.0] - Unreleased

### Added

- `window.myascf.send(action, params, options)` Promise API。
- BridgeRequest / BridgeResponse TypeScript 类型声明。
- requestId 生成和并发 callback store。
- Native adapter 与 `window.MyASCFNative.postMessage` 接入。
- `window.__myascf_on_native_response__` 回调处理。
- TIMEOUT、CALLBACK_LOST、NATIVE_UNAVAILABLE 和 INVALID_RESPONSE。
- DebugPanel 生命周期钩子容错集成。
- 单文件 `dist/myascf.js`、`dist/myascf.d.ts` 和 Demo 同步脚本。

### Notes

- 当前包保持 `private: true`，没有发布到 npm。
- 当前类型为基础协议类型，尚未从 API Manifest 生成逐 action 类型。
