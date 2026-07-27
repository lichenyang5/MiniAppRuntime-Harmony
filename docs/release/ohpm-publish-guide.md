# OHPM Publish Guide

这篇文档解决什么问题：给出 `myascf_runtime` 正式发布 OHPM 前的真实检查、认证、发布和安装验证步骤。

## 当前状态

- 包名：`myascf_runtime`，是否可用仍需连接目标仓库确认。
- 版本：`1.0.0`。
- 本机验证 CLI：`ohpm 6.1.1.830`。
- H5 SDK 已发布 npm；HAR 尚未发布 OHPM 或 GitHub Release。

## CLI 与仓库检查

```powershell
ohpm --version
ohpm config list
ohpm ping
ohpm info myascf_runtime
```

`ohpm info` 查不到包只能说明当前 registry 未返回该包，不能替代最终发布时的名称占用校验。

当前 `ohpm 6.1.1.830` 不提供 `ohpm login` 子命令。根据 OHPM publish 规则，需要在仓库网页完成账号/发布身份配置，生成发布码并上传公钥，然后准备对应私钥。不要把发布码、私钥或 `.ohpmrc` 提交到仓库。

## 构建与本地预检

```powershell
.\scripts\build-har.ps1
node .\scripts\check-har-release.mjs --har ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
ohpm prepublish ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
.\scripts\prepare-har-release.ps1
```

检查内容包括包名、版本、README、LICENSE、CHANGELOG、声明入口、兼容字段、公共导出、缓存路径、证书扩展名、凭据字段和绝对用户路径。

## 发布前人工确认

1. 旧签名凭据已轮换或吊销，Git 历史处置方案已确认。
2. `myascf_runtime` 名称在目标 registry 可用。
3. 发布账号、发布码、公钥和私钥已经配置。
4. 确认候选 HAR 的 `artifactType` 为 `original`，并使用 `--source_type open`。本项目采用 MIT License 和公开源码，不发布 `obfuscation` 闭源产物。
5. 独立 Demo 已使用最终 HAR 完成编译；真机能力回归结果已记录。
6. `release-artifacts/SHA256SUMS.txt` 与最终 HAR 一致。

## 最终发布命令

仅在以上阻塞项全部清除后，由项目作者手动执行：

```powershell
ohpm publish ".\release-artifacts\myascf_runtime-v1.0.0.har" `
  --publish_id "<PUBLISH_ID>" `
  --key_path "<PRIVATE_KEY_PATH>" `
  --source_type open `
  --disallow_nested_package `
  --ensure_dependency_include
```

本仓库不会保存占位符的真实值，也不会自动执行该命令。

## 发布后验证

在全新 HarmonyOS 工程的 `entry` 目录执行：

```powershell
ohpm install myascf_runtime@1.0.0
ohpm list
```

然后仅从包入口导入 `MyASCFRuntime`，完成 Sync、Clean、Rebuild 和真机 API 回归。发布成功、审核通过和全新项目安装均需要分别留存真实证据。
