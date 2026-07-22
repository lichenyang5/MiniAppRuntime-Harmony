# npm SDK With Local HAR Demo

这篇文档解决什么问题：说明全新 Demo 如何组合 npm registry 中的 H5 SDK 与仓库内本地 `myascf_runtime` HAR。

## Structure

```text
examples/npm-harmony-consumer-demo/
  web_app/       Vite + TypeScript, SDK dependency is exactly 0.1.0
  harmony_app/   independent HarmonyOS Stage Model project
```

H5 SDK 来自 npm；ArkTS Runtime 来自本地 HAR。两者使用现有 BridgeRequest/BridgeResponse 协议，不复制 SDK 源码。

## Web

发布后在 `web_app` 执行：

```bash
npm install
npm run build:harmony-web
```

脚本只复制 `dist` 静态产物到 `harmony_app/entry/src/main/resources/rawfile/web`，不会复制 node_modules。

## HarmonyOS

`harmony_app/entry/oh-package.json5` 使用相对路径接入本地 HAR：

```json5
{
  "dependencies": {
    "myascf_runtime": "file:../../../../myascf_runtime"
  }
}
```

`Index.ets` 只创建 `WebviewController` 和 `MyASCFRuntime`，并注册 JavaScriptProxy。Web 页面可验证 Toast、Clipboard、Storage、`runtime.getApiList`、`network.request` 和 DebugPanel。

## Evidence Boundary

发布前已经用本地 tgz 临时安装构建相同 Web 源码，并成功组装独立 HAP。这证明源码和本地 HAR 可集成，但不等于 registry 安装已通过。

发布后必须清理临时 node_modules，再从 registry 安装，检查 lockfile 不含 file/link/workspace，重新构建和进行 ArkWeb 真机或模拟器 smoke test。
