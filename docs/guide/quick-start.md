# Quick Start

这篇文档解决什么问题：用最短路径跑通 npm H5 SDK、本地 HAR Runtime 和 ArkWeb Demo。

## 项目是什么

MiniAppRuntime-Harmony 是一个基于 HarmonyOS、ArkTS 和 ArkWeb 公开能力实现的轻量级 Web 容器与 JSBridge 框架，适合学习跨端通信、API 分发和 HAR 模块接入。

## 三种模式

| 模式 | 依赖 | 适用场景 |
| --- | --- | --- |
| 仓库内源码联调 | `entry -> file:../myascf_runtime` | 修改 Runtime 后立即联调 |
| 外部 HarmonyOS 工程 | `entry/libs/myascf_runtime.har -> file:./libs/myascf_runtime.har` | 应用消费已构建 HAR |
| H5 工程 | `npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` | React、Vue 或 Vanilla H5 |

## 五分钟启动独立 Demo

在仓库根执行：

```powershell
.\scripts\build-har.ps1
.\scripts\copy-har-to-demo.ps1
```

构建并同步 Web：

```bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
```

随后用 DevEco Studio 打开 `examples/npm-har-consumer-demo/harmony`：

1. 执行 Sync and Refresh Project。
2. 为本地 Demo 配置自己的调试签名，不提交签名材料。
3. Clean、Rebuild、Run `entry`。
4. 首次读取剪贴板时确认权限请求。
5. 点击 Show Toast，页面应显示 `RESOLVED`、requestId、code、message、data 和 duration。

## H5 安装

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

```ts
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);
await api.ui.showToast({ message: 'hello' });
```

完整步骤见 [npm + HAR Demo](npm-sdk-har-demo.md)，错误处理见 [故障排查](../troubleshooting.md)。

