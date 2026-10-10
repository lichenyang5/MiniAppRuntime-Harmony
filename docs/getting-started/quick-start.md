# 从新建工程跑通 Runtime

第一次接入先使用纯 HTML，验证 H5 → npm SDK → ArkWeb JavaScriptProxy → OHPM Runtime → 回调 → Promise。成功后再接[React 页面](react-quick-start.md)。

## 1. 创建工程并检查版本

在 DevEco Studio 创建 **Stage Model 的 Empty Ability** 工程，语言使用 ArkTS。本教程按 `entry` 模块、`EntryAbility` 和 `pages/Index` 命名。

`myascf_runtime@1.0.0` 发布包声明最低兼容 API **23**。工程和测试设备均须支持 API 23 或更高。2026-10-10 实测使用 SDK `6.1.1.125`（API 24）及 API 24 真机。

工程根 `build-profile.json5` 的 `app.products` 中，按已安装 SDK 配置，例如：

```json5
"compatibleSdkVersion": "6.1.0(23)",
"targetSdkVersion": "6.1.1(24)",
"runtimeOS": "HarmonyOS"
```

保留 DevEco 生成的其他配置。遇到最低版本不匹配时调整消费工程；不要修改 `oh_modules` 中发布包的元数据绕过要求。

**已经创建官方 ASCF 工程？** 先看[ASCF 模板迁移和 Windows 验收](../guide/windows-initialization.md)。`AscfUIAbility` 不会自动启动你在 `Index.ets` 中配置的 Web 页面；只安装包和修改 `Index.ets` 不足以完成接入。

## 2. 复制最小示例

在另一个目录克隆仓库，仅用于取得模板文件，运行时仍使用公开 npm/OHPM 包：

```powershell
git clone https://github.com/lichenyang5/MiniAppRuntime-Harmony.git
```

在新建 HarmonyOS 工程根打开 PowerShell，把模板位置替换为自己的目录：

```powershell
$runtimeExample = 'C:\你的目录\MiniAppRuntime-Harmony\examples\minimal-runtime-consumer'
New-Item -ItemType Directory -Force h5, scripts | Out-Null
Copy-Item "$runtimeExample\h5\index.html" h5\index.html
Copy-Item "$runtimeExample\scripts\sync-runtime-web.mjs" scripts\sync-runtime-web.mjs
Copy-Item "$runtimeExample\ets\Index.ets" entry\src\main\ets\pages\Index.ets
Copy-Item "$runtimeExample\ets\EntryAbility.ets" entry\src\main\ets\entryability\EntryAbility.ets
```

上述覆盖操作面向新建空工程。已有业务工程先备份，并将 `windowStage.loadContent('pages/Index')` 合入自己的 `UIAbility` 生命周期。

## 3. 在明确的目录安装两个包

H5 SDK 安装在 **HarmonyOS 工程根**：

```powershell
npm install --save-exact @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

在工程根 `package.json` 增加脚本，保留已有字段：

```json
"scripts": { "sync:runtime-web": "node scripts/sync-runtime-web.mjs" }
```

Runtime 安装在 **entry 模块目录**，让导入它的模块声明依赖：

```powershell
Set-Location entry
ohpm install myascf_runtime@1.0.0
Set-Location ..
```

终端找不到 `ohpm` 时，用 DevEco 自带路径替换安装命令（仍在 `entry` 目录）：

```powershell
& 'C:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\ohpm.bat' install myascf_runtime@1.0.0
```

确认 `entry/oh-package.json5` 的 `dependencies` 含 `"myascf_runtime": "1.0.0"`。不需要复制本地 HAR 或添加框架源码模块。

## 4. 同步页面和 SDK

在 HarmonyOS 工程根执行：

```powershell
npm run sync:runtime-web
```

确认文件位置：

```text
h5/index.html                                      页面源码
scripts/sync-runtime-web.mjs                       同步脚本
entry/src/main/resources/rawfile/web/index.html    应用加载的页面
entry/src/main/resources/rawfile/web/myascf.js     npm SDK 的 IIFE 产物
```

不要将 HTML 直接放到 `entry/src/main/resources/index.html`；resources 根目录要求资源分类目录。修改 H5 或更新 SDK 后，重新同步再构建。

纯 HTML 使用 `<script src="myascf.js"></script>`，然后调用 `window.myascf.send(...)`。不要把 npm ESM 入口直接复制到页面。React/Vite 需要构建和内联脚本，详见[完整 React 示例](../examples/complete-react-app.md)。

## 5. 确认启动页和 Proxy

模板 `EntryAbility.ets` 继承 `UIAbility`，在 `onWindowStageCreate` 中执行 `windowStage.loadContent('pages/Index')`。`entry/src/main/resources/base/profile/main_pages.json` 应包含：

```json
{ "src": ["pages/Index"] }
```

模板 `Index.ets` 加载 `$rawfile('web/index.html')`，开启 JavaScript 并注册 Proxy。完整代码见[最小示例](../../examples/minimal-runtime-consumer/ets/Index.ets)。页面加载结束后，HiLog 按 `MyASCFDemo` 过滤应看到：

```json
{ "sdk": "object", "native": "object", "postMessage": "function", "callback": "function" }
```

## 6. 权限、签名和运行

在 `entry/src/main/module.json5` 的 `module.requestPermissions` 中合入：

```json5
"requestPermissions": [{ "name": "ohos.permission.INTERNET" }]
```

最小页面不读取剪贴板。后续接入读取能力时，按[Clipboard API](../api/clipboard.md)添加权限与运行时授权。

在 DevEco 执行 Sync and Refresh Project，为本机和测试设备配置自动签名，连接并解锁设备，再运行 `entry`。CLI 安装本次构建的 `entry-default-signed.hap`，不要误装旧构建或 unsigned HAP。

## 7. 按顺序验收

| 操作 | 成功结果 |
| --- | --- |
| 启动 | 显示“SDK 与 Native Proxy 已就绪” |
| Toast | 手机显示提示，`code: 0`、`action: ui.showToast` |
| 查看 API | `data.apis` 包含 9 个公开 action |
| 写入存储 | `key: runtime-smoke`、`value: hello-runtime` |
| 读取存储 | 读回同一个 `hello-runtime` |
| 网络 GET | Bridge `code: 0`，检查 `data.statusCode` 与 `data.ok` |

HTTP 404/500 也可能正常 resolve；Bridge 成功不等于 HTTP 成功。普通浏览器没有 Native Proxy，返回 `NATIVE_UNAVAILABLE` 属于预期。

完整回归按[手工冒烟清单](../testing/manual-smoke-test.md)执行，包括 Clipboard、超时、取消和错误恢复。

## 出错时先检查

| 现象 | 检查 |
| --- | --- |
| 装好包仍是旧页面 | Ability 是否执行 `loadContent('pages/Index')`，是否安装本次构建 |
| `minimum compatible version 23` | 工程与设备 API |
| `resources/index.html, not a directory` | HTML 是否放到 `rawfile/web` |
| `NATIVE_UNAVAILABLE` | Proxy 名称、方法、JavaScript 开关与脚本加载 |
| SDK 不存在 | 是否同步 `myascf.js` 到 HTML 同目录 |
| `spawn java ENOENT` | 使用 DevEco 终端，或加入自带 `jbr/bin` 到 PATH |
| 签名或安装失败 | 自动签名、设备授权和 signed HAP |

真实初始化记录与 CLI 命令见[Windows 接入与验收](../guide/windows-initialization.md)。
