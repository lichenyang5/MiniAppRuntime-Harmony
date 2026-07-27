# npm H5 SDK + OHPM Runtime Consumer Demo

## 你将学会什么

在不引用仓库 Runtime 源码、不复制本地 HAR 的前提下，验证 npm H5 SDK 与 OHPM Runtime 的真实接入。

## 依赖边界

- Web：`@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`
- HarmonyOS：`myascf_runtime@1.0.0`
- 禁止 `file`、`link`、`workspace` 或本地 tgz 包替代公开依赖
- 不提交签名、证书、缓存、构建目录和本机路径

## 结构

```text
npm-har-consumer-demo/
  web/       React + TypeScript + Vite
  harmony/   HarmonyOS Stage Model + ArkWeb
```

## 构建

```bash
cd web
npm ci
npm run build:harmony
```

在 `harmony` 目录同步 OHPM 依赖后，用 DevEco Studio 执行 Sync、Clean、Rebuild 和 Run。安装到设备前需要配置自己的调试签名。

## Demo Actions

- Toast 与动态 API List
- Clipboard write/read
- Storage set/get/remove/clear
- Network GET、POST、非 2xx 与 AbortController 取消

页面区分 Bridge resolve/reject 和 HTTP status/ok。HTTP 404/500 默认 resolve 且 `data.ok=false`；连接失败、非法 URL、Native timeout 和网络 timeout reject。

## 验证边界

npm/OHPM 安装、Web 类型检查与构建、rawfile 同步和 HarmonyOS 编译可以自动验证。Clipboard 权限、真实网络环境、取消时序和不同设备上的 ArkWeb 行为仍需手工回归。

## 下一步

- [完整 React 示例源码](../../docs/examples/complete-react-app.md)
- [ArkWeb 接入](../../docs/guide/arkweb-integration.md)
- [手工冒烟测试](../../docs/testing/manual-smoke-test.md)
