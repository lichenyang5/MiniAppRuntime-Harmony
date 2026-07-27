# npm 与 OHPM 的边界

你将学会什么：为什么同一套跨端框架需要两个包管理渠道。

H5 SDK 是浏览器 JavaScript/TypeScript 包，使用 npm 发布。ArkTS Runtime 是 HAR，依赖 ArkWeb、AbilityKit、ArkData 和 NetworkKit，应通过 OHPM 安装。

两个包通过 JSON 协议配合：SDK `0.1.0` 对应 Runtime `1.0.0`。独立 Demo 同时从 npm 与 OHPM registry 安装，用于验证公共包边界。

## 下一步阅读

- [H5 SDK 安装](../guide/h5-sdk-installation.md)
- [Runtime 安装](../guide/runtime-installation.md)
- [双端发布实践](../articles/publishing-npm-and-ohpm.md)
