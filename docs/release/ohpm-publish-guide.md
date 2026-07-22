# ohpm Publish Preparation

这篇文档解决什么问题：说明 HAR 的 ohpm 发布准备、人工确认点和当前未完成事项。

## 为什么不是 npm

H5 JavaScript SDK 属于 JavaScript/Node 生态，使用 npm。HAR 是 HarmonyOS 静态共享包，通过 `oh-package.json5` 管理依赖。技术上可以把 HAR 当普通文件放入 npm 包，但消费方仍需手动复制，不符合正常 HarmonyOS 包消费方式，因此不推荐作为正式分发方案。

当前 HAR 使用本地文件或 GitHub Release；正式包仓库方向是 ohpm。

## 发布前元数据

```bash
node scripts/check-har-release.mjs
```

检查 `name`、`version`、`description`、`main`、`license`、`repository`、`keywords`、`dependencies`、README、CHANGELOG、LICENSE、HAR 文件和敏感内容。

## 人工确认

真正发布前必须由项目作者确认：

- ohpm 账号与登录状态。
- 包名 `myascf_runtime` 是否可用，是否需要账号 scope。
- Runtime metadata 版本与兼容矩阵。
- 公开发布意图与 Release Notes。
- 签名风险已经完成轮换/吊销和历史清理。

确认后才执行：

```bash
ohpm login
ohpm publish <HAR_PATH>
```

本仓库的 CI 只运行 `--metadata-only` 静态检查，不伪造 HarmonyOS HAR 构建或 ohpm 发布成功。本次不会执行 `ohpm publish`。

