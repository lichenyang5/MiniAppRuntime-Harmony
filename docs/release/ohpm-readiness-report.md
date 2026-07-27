# OHPM 首次发布验证记录

## 你将学会什么

回顾 `myascf_runtime@1.0.0` 首次发布前完成的检查，以及发布后新增的 registry 消费证据。

## 包信息

| 项目 | 值 |
| --- | --- |
| 包名 | `myascf_runtime` |
| 版本 | `1.0.0` |
| artifactType | `original` |
| source type | `open` |
| 首次验证日期 | 2026-07-27 |
| 当前状态 | 已发布 OHPM |

## 发布前已完成

- 根检查、H5 SDK 检查与单元测试。
- HAR release build、内容扫描和 `ohpm prepublish`。
- 仓库 entry 与独立消费 Demo 的 HAP 编译。
- README、LICENSE、公共入口、版本和敏感信息检查。

## 发布后证据

- `ohpm info myascf_runtime@1.0.0` 返回公开包元信息。
- 独立 Demo 的依赖改为 `"myascf_runtime": "1.0.0"`。
- 在不复制本地 HAR 的情况下完成 OHPM 安装和 ArkTS 编译验证。

## 保留边界

公开包可安装不等于所有设备链路都已覆盖。签名由消费应用自行配置；Clipboard 权限、Network 状态矩阵、取消和 ArkWeb 错误恢复仍应按手工清单验证。历史凭据若曾进入远端历史，仍需轮换或吊销。

## 下一步

- [OHPM 发布维护指南](ohpm-publish-guide.md)
- [独立消费 Demo](../../examples/npm-har-consumer-demo/README.md)
- [手工冒烟测试](../testing/manual-smoke-test.md)
