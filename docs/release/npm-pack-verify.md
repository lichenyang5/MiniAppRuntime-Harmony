# H5 SDK npm Pack 验证

这篇文档解决什么问题：说明如何在不发布 npm 的情况下检查 IIFE、ESM 和类型入口，并用外部示例消费本地 tarball。

## 为什么使用 npm pack

`npm pack` 按真实包规则生成 `.tgz`，可以提前发现 `main`、`module`、`types`、`exports` 路径错误或文件遗漏。它不会把包上传到 registry，本阶段不执行 `npm publish`。

## Dry Run

```bash
cd h5_sdk
npm run pack:check
```

`prepack` 会先重新构建并执行 SDK 测试，然后 dry-run 展示候选文件、包大小和元数据。

## 生成本地 tarball

```bash
npm run pack:local
```

候选文件名为 `miniapp-runtime-harmony-web-sdk-0.1.0.tgz`，已由 Git 忽略。

## 必查入口

```text
package/package.json
package/dist/myascf.js
package/dist/index.esm.js
package/dist/index.d.ts
package/dist/myascf.d.ts
package/README.md
package/LICENSE
package/CHANGELOG.md
```

同时确认声明入口引用的 `.d.ts` 文件存在，并确认 `src`、`tests`、`scripts`、`tsconfig` 与 `node_modules` 不在 tarball 中。

## 外部 ESM 消费

```bash
cd examples/sdk-consumer-demo
npm install
npm test
```

示例通过以下代码真实消费 package exports：

```ts
import { initMyASCF } from 'miniapp-runtime-harmony-web-sdk';
```

它会验证 TypeScript 类型解析、ESM bundle、`createMyASCF`/`initMyASCF` 语义和普通浏览器中的 `NATIVE_UNAVAILABLE`。

## ArkWeb IIFE 回归

```bash
cd h5_sdk
npm run build:demo
```

该命令只把 `dist/myascf.js` 同步到 rawfile。页面继续使用 `<script>`，并继续调用 `window.myascf.send()`。

## 当前结果

2026-07-14 双产物改造后的本地验证结果：

- SDK 的 IIFE、ESM 与 typed API 共 10 项测试全部通过。
- `main/module/types/exports` 均指向实际文件。
- tarball 包大小约 9.7 kB，解包约 40.8 kB，共 18 个公开文件。
- tarball 同时包含 `myascf.js`、`index.esm.js`、类型入口及其声明依赖。
- 外部 consumer 从本地 tarball 完成 ESM import、typed helper、TypeScript 检查和 4 项测试。
- rawfile 继续使用 IIFE，Hvigor `assembleHap` 构建通过。
- npm publish 未执行。

以上数据来自本次 `npm pack --dry-run`，不沿用旧单产物结果。
