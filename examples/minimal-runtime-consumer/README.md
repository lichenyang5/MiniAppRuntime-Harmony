# 纯 HTML 最小消费示例

这些文件用于接入新建的 HarmonyOS Stage Model 工程，不是完整的独立构建工程。完整步骤见[快速开始](../../docs/getting-started/quick-start.md)。

| 文件 | 复制到消费工程的位置 |
| --- | --- |
| `h5/index.html` | `h5/index.html` |
| `scripts/sync-runtime-web.mjs` | `scripts/sync-runtime-web.mjs` |
| `ets/Index.ets` | `entry/src/main/ets/pages/Index.ets` |
| `ets/EntryAbility.ets` | `entry/src/main/ets/entryability/EntryAbility.ets` |
| `ets/AbilityStage.ets` | `entry/src/main/ets/abilitystage/AbilityStage.ets`（已有声明时） |
| `hvigorfile.ts` | 工程根 `hvigorfile.ts`（ASCF 模板迁移时） |

页面包含 Toast、API List、Storage Set/Get 和 Network GET，以普通 script 加载公开 npm SDK 的 IIFE 产物。没有 React、Vite 和 ES module 的额外构建步骤。

Network URL 仅作一次接入演示，长期回归应替换为自己的可控服务。本示例未覆盖 Clipboard 权限、网络取消和全部错误矩阵。
