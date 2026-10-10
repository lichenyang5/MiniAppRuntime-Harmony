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

复制以上文件只是接入的第一步。按照快速开始，在消费工程根安装 npm SDK 并配置 `package.json`，在 `entry` 安装 OHPM Runtime，再回到工程根执行 `npm run sync:runtime-web`。该命令将 `h5/index.html` 和已安装 SDK 的 `dist/myascf.js` 复制到 `entry/src/main/resources/rawfile/web`，之后完成权限、启动页、签名和构建运行。

以后修改 `h5/index.html` 后，按 **同步 → Rebuild Project → Run entry → 设备验收** 操作。同步生成的 `rawfile/web/index.html` 会被覆盖；同步本身不会编译或部署应用。新增页面引用的图片、CSS 或其他 JS 文件时，需要扩展同步脚本复制这些资源。

Network URL 仅作一次接入演示，长期回归应替换为自己的可控服务。本示例未覆盖 Clipboard 权限、网络取消和全部错误矩阵。
