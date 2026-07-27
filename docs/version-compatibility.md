# Version Compatibility

这篇文档解决什么问题：记录已验证的 H5 SDK、HAR Runtime、Manifest、HarmonyOS SDK 和独立 Demo 组合，不承诺未经回归的未来兼容性。

| H5 SDK | HAR Runtime | API Manifest | Minimum HarmonyOS API | Demo | Verification date |
| --- | --- | --- | --- | --- | --- |
| `0.1.0` | `1.0.0` | 未单独版本化，当前快照为 10 个 action（9 公开、1 内部） | API 23 / HarmonyOS 6.1 | `examples/npm-har-consumer-demo` | 2026-07-27 |

## 验证边界

- 已自动验证：H5 SDK build/types、24 个单元测试、npm pack dry-run、HAR release build、HAR 内容检查、独立 Demo ArkTS/HAP 构建。
- 已有设备证据：Toast；API List 和 Storage 有既有展示证据，但本次最终 HAR 仍需重新人工回归。
- 本次未真机验证：Clipboard write/read、Network 2xx、Network 非 2xx、UNKNOWN_ACTION、参数错误、Native timeout 和 callback lost。
- 普通浏览器 `NATIVE_UNAVAILABLE` 有 H5 SDK 自动测试覆盖，不等于 HarmonyOS 真机验证。

当前 Hvigor 对 HAR `0.1.0` 给出会影响安装/发布判断的版本警告，因此 Runtime 元数据冻结为 `1.0.0`。这不表示 HAR 已发布到 OHPM，也不表示所有未来 `0.1.x` H5 SDK 自动兼容所有 `1.0.x` Runtime。

升级任一侧后，必须重新运行 Manifest consistency、H5 SDK tests、HAR build、`ohpm prepublish` 和独立 Demo smoke test，并更新验证日期。
