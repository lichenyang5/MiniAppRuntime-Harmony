# Article Publish Checklist

这篇文档解决什么问题：在文章对外发布前后逐项检查技术准确性、公开合规、截图来源和链接回填，避免把草稿状态写成已发布。

## Before Publish

- [x] 标题清楚，并与仓库归档标题一致。
- [x] 项目地址指向 `https://github.com/lichenyang5/MiniAppRuntime-Harmony`。
- [x] 合规说明存在，只描述本仓库代码与公开 HarmonyOS 能力。
- [x] H5 SDK、ArkTS Runtime 和双向调用链已讲清楚。
- [x] 不包含非公开源码、接口、文档或业务信息。
- [x] 不夸大为生产可用或完整小程序平台。
- [ ] 如使用图片，仅选用通过最终隐私复核的真实截图。
- [x] README 中项目状态与文章草稿一致。
- [ ] 已轮换或吊销远端历史中的签名凭据，并完成当前文件与历史清理。
- [ ] 发布前最后复核文章中的项目版本、CI 与手工验证状态。

## Publish Manually

1. 打开 [文章草稿](juejin-h5-sdk-runtime-framework-design.md)。
2. 在掘金编辑器中粘贴正文，检查标题层级、代码块和链接。
3. 只上传已完成隐私复核的真实截图。
4. 预览后由项目作者手动发布，记录最终 URL 和发布日期。

Codex 不自动登录平台，也不自动发布文章。

## After Publish

- [ ] 将掘金文章真实链接回填根 README 的 Articles 小节。
- [ ] 将文章链接加入 `docs/articles/README.md`，并把状态改为 Published。
- [ ] 将文章链接加入 `docs/showcase/project-showcase.md`。
- [ ] 在 `docs/release/v0.1.0-publish-record.md` 记录发布日期和链接。
- [ ] 如发布到其他开发者社区，记录平台名称和真实链接。
- [ ] 检查所有入口没有遗留“草稿整理中”或假链接。
