# OHPM Publish Guide

## 你将学会什么

了解 `myascf_runtime` 已发布版本的验证方式，以及未来版本在不泄露凭据的前提下完成 prepublish、publish 和消费回归的流程。

## 当前状态

- 包名：`myascf_runtime`
- 已发布版本：`1.1.1`
- 补丁内容：隐去 Bridge 参数正文日志，兼容原有 SDK 和调用协议
- Registry：OHPM
- 状态：已发布，`ohpm info` 与独立 Demo 安装验证通过
- 源码类型：`open`

## 消费验证

```bash
ohpm info myascf_runtime@1.1.1
ohpm install myascf_runtime@1.1.1
ohpm list
```

随后只从包入口导入 `MyASCFRuntime`，完成 Sync、Clean、Rebuild 和真机 API 回归。

## 未来版本预检

```powershell
.\scripts\build-har.ps1
node .\scripts\check-har-release.mjs --har ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
ohpm prepublish ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
.\scripts\prepare-har-release.ps1
```

预检必须核对包名、版本、入口、README、LICENSE、公开导出、源码类型、依赖、凭据字段、本机路径和最终 SHA-256。

## 1.1.1 发布步骤记录

1.1.1 已发布并可从公开 OHPM 下载，不要重复发布同一版本。以下保留本次发布流程；下次发布必须先升级版本号，再构建和预检：

```powershell
.\scripts\build-har.ps1
.\scripts\prepare-har-release.ps1
$ohpmCli = 'C:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\ohpm.bat'
& $ohpmCli prepublish '.\release-artifacts\myascf_runtime-v1.1.1.har'
```

预检通过后，由作者手动发布：

```powershell
& $ohpmCli publish '.\release-artifacts\myascf_runtime-v1.1.1.har' `
  --source_type open `
  --publish_registry 'https://ohpm.openharmony.cn/ohpm'
```

私钥口令只在终端提示时输入，不要粘贴到聊天或提交到仓库。沿用现有 OHPM 账号、发布码和私钥配置即可。源码包含提示符合本项目开源 HAR 的发布方式。

显示发布成功或等待审核后，等待仓库可查询：

```powershell
& $ohpmCli info myascf_runtime@1.1.1
```

可查询后再将 Todo 的宿主依赖升级到 1.1.1，执行 `npm run setup:harmony`、`npm run check:all` 和 `npm run build:harmony`，重新安装并验收文件导出、导入与重启恢复。GitHub 合并本身不会上传 OHPM 包。

## 人工发布边界

发布码、私钥、`.ohpmrc`、签名和证书不得进入仓库。未来版本只能由作者在完成版本升级、CI、独立 Demo 编译和真机 smoke test 后手动发布。本轮文档整理不执行 `ohpm publish`。

## 下一步

- [Runtime 安装](../guide/runtime-installation.md)
- [版本兼容矩阵](../version-compatibility.md)
- [v1.0.0 发布说明](v1.0.0.md)
