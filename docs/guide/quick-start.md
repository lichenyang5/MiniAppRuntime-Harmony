# Quick Start

## 你将学会什么

用公开 npm H5 SDK、OHPM Runtime 和 ArkWeb 跑通第一个 Bridge 调用。

## 安装

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
ohpm install myascf_runtime@1.0.0
```

仓库贡献者可以让根 `entry` 通过 `file:../myascf_runtime` 联调源码；新建外部应用应优先安装 OHPM 包，不需要复制 HAR。

## H5

```ts
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const api = createTypedApi(initMyASCF());
await api.ui.showToast({ message: 'hello' });
```

## HarmonyOS

创建 `WebviewController` 和 `MyASCFRuntime`，再把 runtime 返回的 object、name 与 methodList 交给 ArkWeb `javaScriptProxy`。完整代码见独立 Demo。

## 运行独立 Demo

```bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
```

用 DevEco Studio 打开相邻的 `harmony` 目录，Sync、配置自己的调试签名、Clean、Rebuild、Run。

## 下一步

- [详细 Quick Start](../getting-started/quick-start.md)
- [ArkWeb 接入](arkweb-integration.md)
- [完整 React 示例](../examples/complete-react-app.md)
