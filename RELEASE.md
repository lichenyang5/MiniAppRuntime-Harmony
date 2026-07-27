# Release Status

## 你将学会什么

了解当前 npm/OHPM 包的真实发布状态、仓库验证范围，以及后续 GitHub Release 和文章发布仍需完成的工作。

## 当前状态

| 产物 | 版本 | 状态 |
| --- | --- | --- |
| H5 SDK | `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` | 已发布 npm，registry 消费验证通过 |
| ArkTS Runtime | `myascf_runtime@1.0.0` | 已发布 OHPM，独立 Demo 安装与编译验证通过 |
| GitHub Release | `v1.0.0` | 本次未创建 |
| 技术文章 | 仓库草稿 | 等作者在对应社区手动发布 |

## 当前验证

- API Manifest、生成文档、SDK 类型和 Runtime 注册关系一致性检查。
- H5 SDK IIFE/ESM 构建、单元测试、package exports 与 npm pack dry-run。
- 独立 React Demo TypeScript 检查与生产构建。
- 独立 HarmonyOS Demo 从 OHPM 安装 `myascf_runtime@1.0.0` 并完成 HAP 编译。
- 既有真机证据覆盖 Toast、API List 与 Storage 的部分链路。

## 仍需人工确认

- Clipboard 读取权限、Network 2xx/4xx/5xx/timeout、取消和错误页的完整真机回归。
- 最终展示截图、文章公开链接与 GitHub Release 资产。
- 曾进入远端历史的旧签名凭据仍应完成轮换或吊销，并由作者决定历史处置方式。

当前文档中的包发布状态以 registry 回读为准。自动检查通过不等于所有 HarmonyOS 设备与系统版本均已验证。

## 发布规则

后续版本必须先更新 Manifest、类型、文档和示例，再运行根检查、SDK 检查、npm pack、HAR prepublish、独立 Demo 编译和真机冒烟。仓库不保存 npm/OHPM 凭据、私钥、签名文件或本机路径。

本次文档整理不执行 `npm publish`、`ohpm publish`，也不创建 tag 或 GitHub Release。

## 下一步

- [v1.0.0 发布说明](docs/release/v1.0.0.md)
- [版本兼容矩阵](docs/version-compatibility.md)
- [手工冒烟测试](docs/testing/manual-smoke-test.md)
