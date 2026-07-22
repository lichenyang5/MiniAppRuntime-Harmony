# Changelog

这份文件记录 `@lichenyang5/miniapp-runtime-harmony-web-sdk` 的公开变化。

## [0.1.0] - Unreleased

### Added

- `window.myascf.send(action, params, options?)` Promise API。
- BridgeRequest / BridgeResponse TypeScript 类型。
- requestId、callback map、timeout 与 Native response 处理。
- TIMEOUT、CALLBACK_LOST、NATIVE_UNAVAILABLE 与 INVALID_RESPONSE。
- DebugPanel 生命周期钩子。
- `dist/myascf.js` IIFE 产物，自动挂载全局 SDK。
- `dist/index.esm.js` ESM 产物，导出 `createMyASCF` 与 `initMyASCF`。
- `dist/index.d.ts` 与 `dist/myascf.d.ts` 类型入口。
- Manifest 生成的 `ApiAction`、Params Map、Response Map 与 typed helper。
- `sendTyped` 和 `createTypedApi` 类型化调用入口。
- npm pack 本地预检与 ESM consumer 验证。

### Notes

- 当前包已调整为 `@lichenyang5/miniapp-runtime-harmony-web-sdk@0.1.0` 公开发布候选，尚未执行 npm publish。
- action 类型尚未从 API Manifest 自动生成。
