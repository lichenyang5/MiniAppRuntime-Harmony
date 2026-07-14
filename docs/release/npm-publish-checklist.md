# H5 SDK npm Publish Checklist

这篇文档解决什么问题：列出 H5 SDK 未来发布 npm 前的检查步骤。本清单只适用于 `h5_sdk`，不适用于 ArkTS HAR。

当前没有执行 `npm publish`，包仍设置为 `private: true`。

## Package Metadata

- [ ] 确认 `h5_sdk/package.json` 的 name、version、description 和 license。
- [ ] 确认 `main` 指向 `dist/myascf.js`。
- [ ] 确认 `types` 指向 `dist/myascf.d.ts`。
- [ ] 确认 `files` 只包含 dist、README、LICENSE 和 CHANGELOG。
- [ ] 确认候选包名在 npm 上可用且不会造成品牌混淆。

## Build And Content

- [ ] 执行 `npm --prefix h5_sdk run build`。
- [ ] 执行 `npm --prefix h5_sdk test`。
- [ ] 检查 `dist/myascf.js` 可以注册 `window.myascf`。
- [ ] 检查 `dist/myascf.d.ts` 包含公开协议和 Window 类型。
- [ ] 检查 README、LICENSE 和 CHANGELOG。
- [ ] 执行 `npm pack --dry-run` 预览包内容。
- [ ] 解包候选 tarball 并验证没有源码临时文件、日志或内部信息。

## Publish Decision

- [ ] 更新版本号和 CHANGELOG，提交并创建 Git tag。
- [ ] 移除 `private: true` 或改为 `false`。
- [ ] 再次执行 build、test 和 `npm pack --dry-run`。
- [ ] 明确发布渠道、访问级别和回滚方式。
- [ ] 最后才执行 `npm publish`。

任何一项未确认时都应保持私有准备状态。
