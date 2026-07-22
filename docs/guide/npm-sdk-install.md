# Install The H5 SDK From npm

这篇文档解决什么问题：说明 H5 项目在包发布后如何从 npm registry 安装 SDK，并验证没有使用本地依赖替代真实发布包。

## Install

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

`package.json` 应为：

```json
{
  "dependencies": {
    "@lcy453/miniapp-runtime-harmony-web-sdk": "0.1.0"
  }
}
```

不得出现 `file:`、`link:`、`workspace:` 或本地绝对路径。

## ESM

```ts
import {
  initMyASCF,
  createTypedApi
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);
```

普通浏览器没有 ArkWeb 注入的 `window.MyASCFNative`，调用 API 会 reject `NATIVE_UNAVAILABLE`。页面不应崩溃。

## IIFE

IIFE 位于包内 `dist/myascf.js`，也可通过 `@lcy453/miniapp-runtime-harmony-web-sdk/iife` 子路径解析。它具有自动挂载 `window.myascf` 的副作用。

## Registry Verification

首次发布后执行：

```bash
npm view @lcy453/miniapp-runtime-harmony-web-sdk version
npm view @lcy453/miniapp-runtime-harmony-web-sdk dist
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
npm run build
```

当前文档记录的是发布后流程；在首次 publish 完成前，registry 安装尚未验证。
