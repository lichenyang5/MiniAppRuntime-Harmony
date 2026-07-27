# OHPM 发布就绪报告

这篇文档解决什么问题：记录 `myascf_runtime` 首次 OHPM 发布前已经完成的自动验证、候选产物信息和仍需项目作者处理的发布门槛，避免把“准备完成”写成“已经发布”。

## 候选包

| 项目 | 当前值 |
| --- | --- |
| 包名 | `myascf_runtime` |
| 版本 | `1.0.0` |
| HAR 入口 | `package/Index.ets` |
| artifactType | `original` |
| 文件名 | `myascf_runtime-v1.0.0.har` |
| 文件大小 | 18,097 bytes |
| SHA-256 | `49034406dfe85da3d6b42c850f3bed936ac3073f5f6ee940143da85b3455bafd` |
| 验证日期 | 2026-07-27 |

候选文件由 `scripts/prepare-har-release.ps1` 复制到本地忽略目录 `release-artifacts/`。该目录仅用于发布前复核，不会自动上传文件。

## 已完成的自动验证

- 根目录 `npm install --no-package-lock` 与 `npm run check` 通过。
- H5 SDK `npm install`、`npm run check` 与 `npm run pack:dry-run` 通过，共 24 项测试。
- `scripts/build-har.ps1` 成功生成 HAR，发布内容检查通过。
- `ohpm prepublish` 成功；工具提示 HAR 含源码，公开源码项目接受该提示。
- 仓库 entry HAP 构建成功。
- 独立消费 Demo 使用同一份 HAR 完成 `ohpm install` 与 HAP 构建。
- OHPM 公共仓库查询 `myascf_runtime` 返回未找到；这不能替代账号侧的包名和发布权限确认。

## 当前警告

- Runtime 源码编译存在权限提示、废弃 API 提示和“API 可能抛异常”提示，构建未失败。
- 独立 Demo 会直接编译 original HAR 中的 ArkTS 源码，因此仍会看到 Runtime 源码已有的异常处理和 Toast API 弃用提示；不再出现字节码 HAR 声明中的 `@ts-nocheck` 警告。
- 当前公开构建配置不包含签名材料，因此 HAP 构建会提示未配置签名。发布仓库不应重新提交个人签名凭据。

## 仍需作者完成

1. 轮换或吊销曾进入 Git 历史的旧签名凭据，并决定是否重写历史。
2. 在 OHPM 门户确认账号、发布身份、包名、发布码和私钥；`source_type` 固定为 `open`。
3. 使用最终候选 HAR 在真机回归 Toast、Clipboard、Storage、Network、API List、DebugPanel、超时和错误链路。
4. 确认最终发布 commit 的远程 CI 通过。
5. 复核 Release Notes 后由作者手动执行发布命令。

## 当前结论

**满足条件后可以发布。** 当前自动构建、包内容、`prepublish` 和独立 Demo 编译已经通过；在凭据安全处置、OHPM 账号条件和最终真机回归完成前，不应执行 `ohpm publish`。
