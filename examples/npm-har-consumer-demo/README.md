# npm H5 SDK + OHPM Runtime Consumer Demo

## 你将学会什么

在不引用仓库 Runtime 源码、不复制本地 HAR 的前提下，验证 npm H5 SDK 与 OHPM Runtime 的真实接入。

## 依赖边界

- Web：`@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`
- HarmonyOS：`myascf_runtime@1.1.1`
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

上面的 `build:harmony` 只构建并同步 Web 资源，不编译 HAP，也不会安装设备应用。接着进入 `harmony` 安装公开 Runtime：

```powershell
Set-Location ../harmony
& 'C:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\ohpm.bat' install
```

用 DevEco Studio 打开 `harmony` 目录，执行 Sync、Clean、Rebuild 和 Run。安装到设备前配置自己的调试签名，并确认 default product 关联该签名；仓库不提供签名材料。

## Demo Actions

- Toast 与动态 API List
- Clipboard write/read
- Storage set/get/remove/clear
- Network GET、POST、非 2xx 与 AbortController 取消

页面区分 Bridge resolve/reject 和 HTTP status/ok。HTTP 404/500 默认 resolve 且 `data.ok=false`；连接失败、非法 URL、Native timeout 和网络 timeout reject。

## 验证边界

npm/OHPM 安装、Web 类型检查与构建、rawfile 同步和 HarmonyOS 编译可以自动验证。Clipboard 权限、真实网络环境、取消时序和不同设备上的 ArkWeb 行为仍需手工回归。

## 2026-10-21 干净目录验证

仅复制本示例的 Git 跟踪文件到全新目录，不复制 node_modules、oh_modules、本地配置、签名或已有构建产物。公开 npm SDK 0.1.0 安装、React 类型检查/构建、内联资源同步、公开 OHPM Runtime 1.1.1 安装和 API 23 宿主 unsigned HAP 编译通过。此记录不代表本示例完成真机部署或全部权限/网络矩阵；1.1.1 的存储、Toast、原生文件备份与重启设备证据来自独立 React Todo，见[版本矩阵](../../docs/version-compatibility.md)。

## 下一步

- [完整 React 示例源码](../../docs/examples/complete-react-app.md)
- [ArkWeb 接入](../../docs/guide/arkweb-integration.md)
- [手工冒烟测试](../../docs/testing/manual-smoke-test.md)
