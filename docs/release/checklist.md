# Release Checklist

这篇文档解决什么问题：统一检查 OHPM HAR、GitHub Release 和 npm H5 SDK 的发布门禁。

## 已完成

- [x] H5 SDK `0.1.0` 已发布 npm，包名与 registry 来源已验证。
- [x] HAR 元数据冻结为 `myascf_runtime@1.0.0`。
- [x] HAR README、LICENSE、CHANGELOG、repository、keywords 与公共入口已整理。
- [x] 首版公共 API 已收紧，不导出 Logger、Manifest、请求解析和装配实现。
- [x] 当前公开构建配置中的签名材料已移除，证书/密钥扩展名已加入 `.gitignore`。
- [x] HAR build、内容检查、SHA-256 资产准备和独立 Demo 构建已有自动脚本。

## 每次候选发布必须重跑

- [x] 2026-07-27 执行 `npm install`、`npm run check`。
- [x] 2026-07-27 执行 H5 SDK install、check 和 pack dry-run，24 项测试通过。
- [x] 2026-07-27 执行 `.\scripts\build-har.ps1`。
- [x] 2026-07-27 执行 `ohpm prepublish <HAR_PATH>`。
- [x] 2026-07-27 执行 `.\scripts\prepare-har-release.ps1` 并复核 SHA-256。
- [x] 2026-07-27 将最终 HAR 复制到独立 Demo，完成 OHPM install 与 HAP 构建。
- [ ] 真机回归 Toast、API List、Storage、Clipboard、Network 2xx/非 2xx和错误链路。
- [ ] 确认文档未把 OHPM/GitHub Release 准备状态写成已发布。

## 必须由作者处理

- [ ] 轮换或吊销已进入 Git 历史的旧签名凭据。
- [ ] 决定是否执行 Git 历史重写，并通知已有克隆/分支使用者。
- [ ] 在目标 OHPM registry 确认 `myascf_runtime` 名称可用。
- [ ] 配置发布账号、发布码、公钥/私钥；`source_type` 固定为 `open`。
- [ ] 确认正式公开发布意图和最终 Release Notes。
- [ ] 最终发布 commit 的远端 CI 通过。
- [ ] 手动执行 OHPM publish、创建 Git tag 和 GitHub Release。

任一必选项未完成时，不得声称 HAR 已发布。
