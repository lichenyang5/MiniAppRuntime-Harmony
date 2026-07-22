# npm H5 SDK + Local HAR Consumer Demo

这篇文档解决什么问题：提供一个与主 entry 分离的 Demo，验证 npm 发布的 H5 SDK 能与本地 `myascf_runtime` HAR 在 HarmonyOS ArkWeb 中协同工作。

## Boundaries

- `web_app` 的 SDK 依赖固定为 `@lichenyang5/miniapp-runtime-harmony-web-sdk: 0.1.0`。
- `web_app` 不允许使用 file、link、workspace 或仓库源码 import。
- `harmony_app` 只把 ArkTS Runtime 作为本地 HAR 接入。
- 不发布 HAR，不发布 ohpm，不执行 CLI。

## After npm Publish

```bash
cd web_app
npm install
npm run build:harmony-web
```

检查 `package.json` 和新生成的 lockfile，确认 SDK resolved 地址来自 `registry.npmjs.org`。

随后用 DevEco Studio 打开 `harmony_app`，执行 ohpm/Sync Project，然后构建运行 entry。

## Demo Actions

- `ui.showToast`
- `system.clipboard.readText`
- `system.storage.setItem/getItem`
- `runtime.getApiList`
- `network.request`
- H5 Bridge timeline

普通浏览器中按钮会显示 `NATIVE_UNAVAILABLE`；ArkWeb 注入成功后请求进入本地 HAR。

## Current Evidence

发布前已使用本地 tgz 临时安装并完成 TypeScript/Vite 构建，静态产物已同步，独立 HarmonyOS HAP 构建通过。registry 安装与设备 API 行为仍待 publish 后验证，不能提前标为完成。
