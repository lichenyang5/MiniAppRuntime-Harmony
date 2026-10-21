# Version Compatibility

## 你将学会什么

查看已验证的 H5 SDK、OHPM Runtime、Manifest、HarmonyOS SDK 和独立 Demo 组合，而不对未经回归的未来版本作兼容承诺。

| H5 SDK | OHPM Runtime | API Manifest | Minimum HarmonyOS API | Demo | Verification date |
| --- | --- | --- | --- | --- | --- |
| `0.1.0` | `1.1.1` | 10 built-in actions: 9 public, 1 internal; host app.* supported | API 23 / HarmonyOS 6.1 | React Todo: storage, Toast, native JSON backup/recovery, restart; independent Demo: clean npm/OHPM install, Web sync, unsigned HAP build | 2026-10-21 |
| `0.1.0` | `1.0.0` | 10 actions: 9 public, 1 internal | API 23 / HarmonyOS 6.1 | `examples/npm-har-consumer-demo` | 2026-07-27 |

## 验证边界

- 1.1.1 已从公开 OHPM 下载并在独立 React Todo 真机验证存储、Toast、文件导出/恢复和重启保留；不代表完整 Clipboard/Network/错误页矩阵已经覆盖。
- 已自动验证 SDK build/types/tests、npm pack、生成物一致性和独立 Demo Web/HAP 构建。
- 已有设备证据覆盖 Toast、API List 与 Storage 的部分链路。
- Clipboard、Network 状态矩阵、取消、timeout、callback lost 和错误页仍需按最终包组合完成设备回归。

升级任一侧后，都要重新运行 Manifest consistency、H5 SDK tests、OHPM 安装、独立 Demo build 和手工 smoke test，并更新验证日期。

## 下一步

- [Release v1.0.0](release/v1.0.0.md)
- [完整 React 示例](examples/complete-react-app.md)
- [手工冒烟测试](testing/manual-smoke-test.md)
