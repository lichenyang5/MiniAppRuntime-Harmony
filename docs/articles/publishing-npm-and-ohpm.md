# 同一个跨端框架为什么要分别发布 npm 与 OHPM

## 你将学会什么

区分 npm 与 OHPM 包边界，并用独立消费 Demo 验证两个公开包的真实组合。

## 摘要

本文记录 MiniAppRuntime-Harmony 把 H5 SDK 发布到 npm、把 ArkTS HAR 发布到 OHPM，并用全新 Demo 验证两个公共包的过程。

**适合读者：**维护 TypeScript + HarmonyOS 跨端库、准备公开发布的人。

## 正文目录

1. 两个运行环境，两种包
2. npm 发布检查
3. OHPM HAR 检查
4. 独立 Demo 验证
5. 版本与安全边界

## 1. 为什么拆开

H5 SDK 面向浏览器工具链，产物是 ESM/IIFE 和 `.d.ts`。Runtime 面向 ArkTS，产物是 HAR。分别使用 npm 与 OHPM，消费者不需要本地源码、复制脚本或绝对路径。

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
ohpm install myascf_runtime@1.0.0
```

## 2. npm 发布检查

```bash
npm --prefix h5_sdk install
npm --prefix h5_sdk run check
npm --prefix h5_sdk run pack:dry-run
```

检查 TypeScript、IIFE/ESM、24 项单元测试、exports、files 白名单和 tarball 内容。README 必须写清初始化、普通浏览器边界和 Runtime 版本。

## 3. OHPM HAR 检查

```powershell
.\scripts\build-har.ps1
ohpm prepublish ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
.\scripts\prepare-har-release.ps1
```

开源包使用 `artifactType: original` 与 `source_type open`。`prepublish` 会提示 HAR 包含源码；对 MIT 开源项目，这是知情且符合发布模型的结果。

发布前还要检查 README、LICENSE、CHANGELOG、公共入口、兼容 SDK、证书/私钥、绝对路径和认证字段。真实发布码与私钥只存在于发布环境，不能进入仓库或文章。

## 4. 独立 Demo

验证不能停在“publish 命令成功”。全新 Demo 应只包含：

```json5
{
  "dependencies": {
    "myascf_runtime": "1.0.0"
  }
}
```

Web 端只从 npm 安装 SDK。随后执行 TypeScript build、rawfile 同步、OHPM install、HAP build 和目标设备冒烟，确认没有回退到 `file:` 或本机缓存。

## 5. 版本兼容和审核修复

当前组合是 SDK `0.1.0` + Runtime `1.0.0`。Manifest action、typed API、文档和 Demo 通过自动检查保持一致。

发布审核或预检被打回时，应修正包元数据、公开入口、源码类型或敏感内容，再从新产物重新验证 hash。不要直接改压缩包里的元数据，也不要把失败归因于包管理器。

项目地址：[MiniAppRuntime-Harmony](https://github.com/lichenyang5/MiniAppRuntime-Harmony)

## 已知边界

registry 发布成功不等于目标设备行为全部通过。权限、ArkWeb、系统 API 和网络环境仍要做手工回归；本项目不包含自动发布凭据和生产发布承诺。

## 总结

双端发布的价值是让边界可验证：npm 负责 H5，OHPM 负责 ArkTS，独立 Demo 负责证明两者真的能在没有源码路径的情况下协作。

## 下一步阅读

- [版本兼容](../version-compatibility.md)
- [Release v1.0.0](../release/v1.0.0.md)
