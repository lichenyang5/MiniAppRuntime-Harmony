# Version Compatibility

这篇文档解决什么问题：记录已验证的 H5 SDK、HAR Runtime、Manifest 和 HarmonyOS API 组合。

| H5 SDK | HAR Runtime metadata | API Manifest | Minimum HarmonyOS API | Independent Demo |
| --- | --- | --- | --- | --- |
| `0.1.x` | `1.0.x` | current generated Manifest | API 23 / HarmonyOS 6.1 | Web, HAR and HAP build verified; Toast device evidence exists; Clipboard/Network regression pending |

当前 Hvigor 对 HAR `0.1.0` 给出会影响 ohpm 安装与发布的版本警告，因此保留真实、无该警告的 Runtime metadata `1.0.0`。这不表示 HAR 已发布到 ohpm，也不承诺所有未来 `0.1.x` SDK 自动兼容所有 Runtime 版本。

升级任一侧后，应重新运行 Manifest consistency、H5 SDK tests、HAR build 和独立 Demo smoke test。
