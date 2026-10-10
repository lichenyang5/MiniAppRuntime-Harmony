# 从新建工程跑通 Runtime

第一次接入先使用纯 HTML，验证 H5 → npm SDK → ArkWeb JavaScriptProxy → OHPM Runtime → 回调 → Promise。成功后再接[React 页面](react-quick-start.md)。

首次操作顺序：**创建工程 → 复制模板 → 安装两个包 → 配置同步脚本 → 同步资源 → 检查启动页与权限 → 签名并运行 → 点击验收**。复制模板成功后还要完成后续步骤，页面才会出现在设备上。

本教程中的“工程根”指你新建的 HarmonyOS 应用目录（包含 `entry` 和 `build-profile.json5`），不是 Runtime 仓库目录。

| 操作 | PowerShell 当前目录 |
| --- | --- |
| 复制模板、`npm install`、`npm run sync:runtime-web` | 新建 HarmonyOS 工程根 |
| `ohpm install myascf_runtime@1.0.0` | 新建工程的 `entry` 目录 |
| 修改 `package.json` | 新建工程根的文件 |
| 修改 `oh-package.json5` 中 Runtime 依赖 | 新建工程的 `entry/oh-package.json5` |

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

工程根 `package.json` 的最小完整内容如下。已有文件时合并这两个字段，保留其他依赖和脚本：

```json
{
  "dependencies": {
    "@lcy453/miniapp-runtime-harmony-web-sdk": "0.1.0"
  },
  "scripts": {
    "sync:runtime-web": "node scripts/sync-runtime-web.mjs"
  }
}
```

`scripts` 与 `dependencies` 是同级字段。不要把 `scripts` 放进 `dependencies`，否则 npm 会把它当成依赖，且无法找到同步命令。

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

这个命令执行 `node scripts/sync-runtime-web.mjs`，创建 `rawfile/web` 目录，并复制以下两个文件：

| 来源 | 同步到 |
| --- | --- |
| `h5/index.html` | `entry/src/main/resources/rawfile/web/index.html` |
| `node_modules/@lcy453/miniapp-runtime-harmony-web-sdk/dist/myascf.js` | `entry/src/main/resources/rawfile/web/myascf.js` |

成功时终端输出 `H5 页面和公开 npm SDK 已同步到 entry/src/main/resources/rawfile/web`。这一步只复制文件，不安装依赖、不编译 HAP，也不会更新设备上的应用；还要在 DevEco 重新构建并运行。

确认文件位置：

```text
h5/index.html                                      页面源码
scripts/sync-runtime-web.mjs                       同步脚本
entry/src/main/resources/rawfile/web/index.html    应用加载的页面
entry/src/main/resources/rawfile/web/myascf.js     npm SDK 的 IIFE 产物
```

日常修改 `h5/index.html`，将 `rawfile/web` 视为同步生成的打包资源。直接修改 `rawfile/web/index.html` 会在下次同步时被源码覆盖。

不要将 HTML 直接放到 `entry/src/main/resources/index.html` 或 `entry/src/main/resources/web/index.html`；resources 根目录要求资源分类目录。修改 H5 或更新 SDK 后，重新同步再构建。当前脚本只复制 HTML 和 SDK；新增图片、CSS 或其他 JS 文件时，需要扩展脚本，把这些资源一起复制到 `rawfile/web`，并保持 HTML 引用路径一致。

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

在 DevEco 执行 Sync and Refresh Project，然后在 Project Structure → Signing Configs 配置自动签名，连接并解锁设备，选择该设备并运行 `entry`。构建成功后还要确认应用已安装并在设备上启动；只有 unsigned HAP 时，需先完成签名。CLI 安装本次构建的 `entry-default-signed.hap`，不要误装旧构建或 unsigned HAP。

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

## 下次继续开发：修改 → 同步 → 构建 → 运行

已完成接入后，不需要每次重建工程或重新安装两个包。修改 `h5/index.html` 后，在消费工程根执行：

```powershell
Set-Location 'C:\你的目录\MyApplication'
npm run sync:runtime-web
```

然后在 DevEco 执行 Rebuild Project，再 Run `entry` 到设备，检查页面变化与“SDK 与 Native Proxy 已就绪”。仅修改 ArkTS 时按正常流程重新构建运行；更新 npm SDK 后要再次同步 `myascf.js`。

重新克隆或清理依赖后，先在工程根执行 `npm install`，再进入 `entry` 执行 `ohpm install`，返回工程根同步资源，然后构建运行。

## 出错时先检查

| 现象 | 检查 |
| --- | --- |
| 装好包仍是旧页面 | Ability 是否执行 `loadContent('pages/Index')`，是否安装本次构建 |
| 复制模板后页面没出现 | 是否安装两个包、执行同步、配置启动页，并重新构建运行 |
| `Missing script: sync:runtime-web` | 当前目录是否为消费工程根，`package.json` 的 `scripts` 是否与 `dependencies` 同级 |
| 同步时报找不到 HTML 或 SDK | 是否复制 `h5/index.html`，是否在消费工程根执行过 `npm install` |
| 修改 HTML 后手机页面没变 | 是否修改 `h5/index.html`，执行同步后重新构建并运行到当前设备 |
| `minimum compatible version 23` | 工程与设备 API |
| resources 目录或资源类型报错 | HTML 是否误放到 `resources/index.html` 或 `resources/web`，应使用 `resources/rawfile/web` |
| `NATIVE_UNAVAILABLE` | Proxy 名称、方法、JavaScript 开关与脚本加载 |
| SDK 不存在 | 是否同步 `myascf.js` 到 HTML 同目录 |
| `spawn java ENOENT` | 使用 DevEco 终端，或加入自带 `jbr/bin` 到 PATH |
| 签名或安装失败 | 自动签名、设备授权和 signed HAP |

真实初始化记录与 CLI 命令见[Windows 接入与验收](../guide/windows-initialization.md)。
