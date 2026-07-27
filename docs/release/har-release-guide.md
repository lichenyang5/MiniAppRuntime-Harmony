# HAR GitHub Release Guide

这篇文档解决什么问题：准备可复验的 HAR Release 资产，但不自动创建 tag、GitHub Release 或上传文件。

## 构建、检查与资产生成

```powershell
.\scripts\build-har.ps1
node .\scripts\check-har-release.mjs --har ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
ohpm prepublish ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
.\scripts\prepare-har-release.ps1
```

生成目录被 Git 忽略：

```text
release-artifacts/
├─ myascf_runtime-v1.0.0.har
└─ SHA256SUMS.txt
```

`SHA256SUMS.txt` 只记录小写 SHA-256 和资产文件名，不记录本机路径。正式上传前再次执行：

```powershell
Get-FileHash ".\release-artifacts\myascf_runtime-v1.0.0.har" -Algorithm SHA256
Get-Content ".\release-artifacts\SHA256SUMS.txt"
```

## 全新 Demo 验证

1. 复制最终 HAR 到新工程 `entry/libs/myascf_runtime.har`。
2. 配置 `"myascf_runtime": "file:./libs/myascf_runtime.har"`。
3. 执行 OHPM Sync、Clean、Rebuild。
4. 只使用 `import { MyASCFRuntime } from 'myascf_runtime'`。
5. 配置宿主权限和本机调试签名后 Run。
6. 回归 Toast、API List、Storage、Clipboard、Network 2xx/非 2xx及错误链路。

## Release Notes 必填项

- HAR 包名/版本、H5 SDK 兼容版本、最低 HarmonyOS API。
- 9 个公开 action 和 1 个内部 action 的边界。
- 自动检查、HAR/HAP 构建及真机回归的真实结果。
- 权限要求、已知限制、升级步骤和 SHA-256。
- 明确 HAR 是否已发布 OHPM，不得把“准备中”写成“已发布”。

Git tag 与 Release 必须由作者在历史凭据处置、最终 CI 和真机回归确认后手动创建。本任务不上传资产。
