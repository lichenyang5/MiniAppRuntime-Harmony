# HAR GitHub Release Guide

这篇文档解决什么问题：准备可复验的 HAR Release 资产，但不自动创建 GitHub Release。

## 构建与检查

```powershell
.\scripts\build-har.ps1
node .\scripts\check-har-release.mjs
```

复制并命名候选资产：

```text
myascf_runtime-v1.0.0.har
SHA256SUMS.txt
```

使用 PowerShell 计算摘要：

```powershell
Get-FileHash .\myascf_runtime-v1.0.0.har -Algorithm SHA256
```

`SHA256SUMS.txt` 只记录哈希和资产文件名，不记录本机绝对路径。

## 全新 Demo 验证

1. 从 Release 下载 HAR。
2. 复制到新工程 `entry/libs/myascf_runtime.har`。
3. 配置 `file:./libs/myascf_runtime.har`。
4. Sync、Clean、Rebuild、Run。
5. 回归 Toast、API List、Storage、Clipboard、Network 2xx/非 2xx。

## Release Notes

说明版本、公开 API、SDK 兼容范围、最低 API、已完成测试、已知限制、SHA-256 和升级步骤。不得包含签名材料、账号、设备标识或绝对路径。

Git tag 与 Release 必须由项目作者在签名风险完成轮换和历史清理后手动创建。本次不上传资产。

