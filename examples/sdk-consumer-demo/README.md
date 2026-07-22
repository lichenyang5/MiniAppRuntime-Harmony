# SDK ESM Consumer Demo

这篇文档解决什么问题：验证 H5 SDK 的本地 npm tarball 可以被仓库外形态的 TypeScript 前端工程通过 ESM 入口消费。

示例直接从 `@lichenyang5/miniapp-runtime-harmony-web-sdk` 导入 `initMyASCF`、`createTypedApi` 和类型，不复制 IIFE 文件，也不依赖预先存在的 `window.myascf`。

## 准备 tarball

```bash
cd h5_sdk
npm run pack:local
```

tarball 仅用于本地验证，不提交到 Git，也不执行 `npm publish`。

## 安装与验证

```bash
cd examples/sdk-consumer-demo
npm install
npm test
```

测试会验证：

- tarball 同时包含 IIFE、ESM 和 TypeScript 类型入口。
- TypeScript 可以解析包的 `exports` 与声明文件。
- `createMyASCF()` 只创建 client，不自动挂载全局对象。
- `initMyASCF()` 挂载 `window.myascf` 并注册 Native 响应回调。
- generated helper 能以 `api.ui.showToast()`、`api.system.storage.*()` 形式调用现有 action。
- 错误 action 或缺失必填参数会在 TypeScript 检查阶段失败。
- 普通浏览器缺少 `window.MyASCFNative` 时返回 `NATIVE_UNAVAILABLE`。

## 浏览器查看

执行 `npm run build` 后，用本地静态服务器打开本目录。`js/demo.js` 是由 esbuild 从 ESM 包入口打包出的浏览器模块。

普通浏览器没有 ArkWeb 注入的 `window.MyASCFNative`，点击按钮后 Promise reject 是预期行为。只有运行在 HarmonyOS ArkWeb 容器并完成 JavaScriptProxy 注入后，请求才会进入 Native runtime。
