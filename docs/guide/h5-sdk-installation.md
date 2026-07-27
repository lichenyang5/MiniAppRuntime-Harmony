# 安装 H5 SDK

你将学会什么：安装 npm 包，选择 ESM 或 IIFE 入口，并理解 `initMyASCF` 与 `createMyASCF` 的区别。

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

ESM 推荐写法：

```ts
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);
```

`initMyASCF()` 会挂载 `window.myascf` 和 `window.__myascf_on_native_response__`。`createMyASCF()` 只创建客户端，不修改全局对象，适合测试或自定义宿主。

IIFE 入口是 `@lcy453/miniapp-runtime-harmony-web-sdk/iife`，构建产物会自动初始化全局对象。普通浏览器可以加载 SDK，但调用 Native API 会 reject `NATIVE_UNAVAILABLE`。

## 下一步阅读

- [Runtime 安装](runtime-installation.md)
- [API 使用](api-usage.md)
