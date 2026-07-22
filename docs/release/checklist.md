# Release Checklist

这篇文档解决什么问题：为 npm SDK 与 HAR Release 提供统一发布前检查清单。

- [ ] 确认 Git tag 与 Release 版本。
- [ ] 更新根 CHANGELOG、H5 SDK CHANGELOG、HAR CHANGELOG。
- [ ] 确认 npm SDK 版本与 registry 状态。
- [ ] 确认 HAR `oh-package.json5` 版本和公共入口。
- [ ] 运行 API Manifest、生成文档与类型一致性检查。
- [ ] 运行 H5 SDK build、tests、npm pack dry-run。
- [ ] 运行 HAR metadata check 和本地 HAR build。
- [ ] 在全新 npm + HAR Demo 执行 Sync、Build、Run。
- [ ] 回归 Toast、API List、Storage、Clipboard、Network 2xx/非 2xx。
- [ ] 移除公开示例中的签名、证书、密码、token 和绝对路径。
- [ ] 完成已进入历史的签名凭据轮换/吊销与历史清理。
- [ ] 计算 HAR SHA-256 并生成 `SHA256SUMS.txt`。
- [ ] 准备 Release Notes 和真实截图。
- [ ] 由作者确认公开发布意图后创建 tag 和 GitHub Release。

