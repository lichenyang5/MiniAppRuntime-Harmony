# Windows 初始化与真机验收记录

## 实测环境和结果

2026-10-10，在 Windows 上将已有官方 ASCF 模板工程迁移为 MiniAppRuntime 消费工程。该工程此前已安装两个公开包，但启动入口仍继承 `AscfUIAbility`，`Index.ets` 引用的 `rawfile/web/index.html` 不存在，最低 API 为 12。

| 项目 | 本次验证 |
| --- | --- |
| SDK | DevEco 自带 `6.1.1.125`，API 24 |
| 设备 | 系统 `OpenHarmony-6.1.1.120`，API 24 真机 |
| npm SDK | `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` |
| OHPM Runtime | `myascf_runtime@1.0.0`，公开 registry |
| 工程最低/目标 API | `6.1.0(23)` / `6.1.1(24)` |
| 构建 | ArkTS、资源编译、HAP 打包和签名通过 |
| 真机 | 签名 HAP 安装与 `EntryAbility` 启动通过 |
| Bridge | SDK/Native 为 object，postMessage/callback 为 function |
| Toast | `code: 0`，`showToast success` |
| API List | 返回 9 个公开 action |
| Storage | 写入后读回 `runtime-smoke = hello-runtime` |
| Network | HTTPS GET 返回 `statusCode: 200`、`ok: true` |

此次为更新已有工程后的接入验证，未通过卸载清空应用数据。未验证 Clipboard、取消、网络错误矩阵和跨设备兼容性；已有成功结果不能替代[完整手工回归](../testing/manual-smoke-test.md)。构建仍提示 Runtime 内的剪贴板权限、部分异常处理和废弃 API 警告。

## 从官方 ASCF 模板迁移

如果目的是继续开发官方 ASCF 元服务，请保留该模板的启动与构建机制。本节适用于明确改用自己的 `myascf_runtime` 和 ArkWeb 页面。

先备份将修改的文件，包括 Ability、Index、模块配置、Hvigor 配置和本机构建配置。保留签名材料在本机；不要上传备份目录或 `build-profile.json5`。

1. 根 `hvigorfile.ts` 使用 `appTasks` 与 `plugins: []`，移除该启动路径上的 `ascfPlugin()` 和 `signByBuildModePlugin()`；[模板文件](../../examples/minimal-runtime-consumer/hvigorfile.ts)可供新空工程复制。
2. `EntryAbility.ets` 改为 `UIAbility`，在 `onWindowStageCreate` 加载 `pages/Index`；[完整源码](../../examples/minimal-runtime-consumer/ets/EntryAbility.ets)。
3. 如果 `module.json5` 声明了 `srcEntry: ./ets/abilitystage/AbilityStage.ets`，将该类从 `AscfAbilityStage` 改为普通 `AbilityStage`；[完整源码](../../examples/minimal-runtime-consumer/ets/AbilityStage.ets)。
4. 从 `module.dependencies` 中移除本路径已不使用的 `com.huawei.hms.ascfruntime` 运行时依赖；保留其他业务依赖。
5. 按[快速开始](../getting-started/quick-start.md)声明 `entry` 的 `myascf_runtime`、调整最低 API、复制页面并同步 SDK。
6. 将误放在 `resources` 根目录的 HTML 移入备份，实际加载文件放在 `rawfile/web`。原 `ascf/ascf_src` 可暂时保留作参考，当前页面不再由它生成。

本次没有更换工程的 bundleName、bundleType 和本机签名配置；`UIAbility`/ArkWeb 通路也已在原 atomicService 工程中构建并运行。

## Windows CLI 构建

优先使用 DevEco Studio 的 Sync、Rebuild 和 Run。以下命令用于终端复现，路径按实际安装位置修改；在消费工程根运行：

```powershell
$devecoDir = 'C:\Program Files\Huawei\DevEco Studio'
$env:DEVECO_SDK_HOME = "$devecoDir\sdk"
$env:JAVA_HOME = "$devecoDir\jbr"
$env:Path = "$devecoDir\jbr\bin;$devecoDir\tools\node;$devecoDir\tools\ohpm\bin;" + $env:Path

npm run sync:runtime-web
& "$devecoDir\tools\ohpm\bin\ohpm.bat" install --all
& "$devecoDir\tools\hvigor\bin\hvigorw.bat" --mode module -p product=default -p module=entry@default -p buildMode=debug assembleHap --no-daemon
```

`JAVA_HOME` 已设置但未将 `jbr/bin` 加入 PATH，仍可能出现 `spawn java ENOENT`。本次补齐 PATH 后完成打包和签名。

成功输出应包含 `CompileArkTS`、`PackageHap`、`PackingCheck`、`SignHap` 和 `BUILD SUCCESSFUL`。已有产物可能被显示为 `UP-TO-DATE`；检查最终命令退出成功并使用本次输出。

## 真机安装和诊断

在 DevEco 配好设备调试签名，连接解锁设备并确认 USB 调试授权。在消费工程根执行：

```powershell
$hdc = "$devecoDir\sdk\default\openharmony\toolchains\hdc.exe"
& $hdc list targets
& $hdc shell param get const.ohos.apiversion
& $hdc install entry\build\default\outputs\default\entry-default-signed.hap
& $hdc shell aa start -a EntryAbility -b '<AppScope/app.json5 中的 bundleName>'
& $hdc shell hilog -x -T MyASCFDemo
```

多个设备连接时，为每个命令加 `-t <设备ID>`。不要照抄其他工程的 bundleName 或签名路径。

页面显示“SDK 与 Native Proxy 已就绪”后，按 Toast → API List → Storage Set → Storage Get → Network GET 验收。记录实际 BridgeResponse；`requestId`、`action` 和 `code` 比“页面能打开”更能证明完整回调链路。

## 再次上手的最短步骤

1. 在 DevEco 打开消费工程，同步 npm/OHPM 依赖。
2. 编辑 `h5/index.html`，运行 `npm run sync:runtime-web`。
3. Rebuild，确认签名成功，再 Run。
4. 查看 `MyASCFDemo` 日志和页面结果。
5. 需要 React 时使用完整 React 消费示例的构建与内联流程，避免 rawfile 的外链 module/CORS 白屏。
