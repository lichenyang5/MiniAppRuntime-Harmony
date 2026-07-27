# OHPM Publish Guide

## 你将学会什么

了解 `myascf_runtime` 已发布版本的验证方式，以及未来版本在不泄露凭据的前提下完成 prepublish、publish 和消费回归的流程。

## 当前状态

- 包名：`myascf_runtime`
- 当前版本：`1.0.0`
- Registry：OHPM
- 状态：已发布，`ohpm info` 与独立 Demo 安装验证通过
- 源码类型：`open`

## 消费验证

```bash
ohpm info myascf_runtime@1.0.0
ohpm install myascf_runtime@1.0.0
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

## 人工发布边界

发布码、私钥、`.ohpmrc`、签名和证书不得进入仓库。未来版本只能由作者在完成版本升级、CI、独立 Demo 编译和真机 smoke test 后手动发布。本轮文档整理不执行 `ohpm publish`。

## 下一步

- [Runtime 安装](../guide/runtime-installation.md)
- [版本兼容矩阵](../version-compatibility.md)
- [v1.0.0 发布说明](v1.0.0.md)
