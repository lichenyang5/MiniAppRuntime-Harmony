# 发布维护指南

## 你将学会什么

分别维护 npm H5 SDK 与 OHPM ArkTS Runtime 的版本、构建、验证和文档边界。

## 当前版本

| 包 | 版本 | Registry |
| --- | --- | --- |
| H5 SDK | `0.1.0` | npm，已发布 |
| ArkTS Runtime | `1.0.0` | OHPM，已发布 |

两个包服务不同生态，版本号不要求一致，但兼容组合必须记录在 `docs/version-compatibility.md`。

## 未来版本流程

1. 更新真实能力与 CHANGELOG。
2. 更新 Manifest、Runtime 注册、SDK 类型、API 文档和 Demo。
3. 运行 `npm run generate`、根检查和 SDK 检查。
4. 执行 npm pack、HAR build 与 `ohpm prepublish`。
5. 在独立 Demo 中从候选包完成 Web/HAP 构建和真机 smoke test。
6. 作者确认 registry 凭据后分别手动发布。
7. 回读 registry，再更新发布说明和兼容矩阵。

不要把 npm SDK 与 OHPM HAR 合并为一个包，也不要在仓库保存 token、发布码、私钥、证书或签名。

本轮文档整理不执行发布命令，不创建 tag 或 GitHub Release。

## 下一步

- [npm 与 OHPM 边界](../concepts/npm-and-ohpm-boundaries.md)
- [OHPM 发布维护](../release/ohpm-publish-guide.md)
- [发布回归清单](../testing/release-regression-checklist.md)
