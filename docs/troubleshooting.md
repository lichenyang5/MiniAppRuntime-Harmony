# Troubleshooting

这篇文档解决什么问题：按症状定位 npm SDK、HAR、ArkWeb、Bridge 和 Network 常见问题。

| 症状 | 原因 | 处理 |
| --- | --- | --- |
| `NATIVE_UNAVAILABLE` | 普通浏览器或 JavaScriptProxy 未注入 | 浏览器中属于预期；ArkWeb 中检查 proxy 名称与注册时机 |
| `Cannot find module 'myascf_runtime'` | HAR 缺失或 ohpm 未同步 | 复制到 `entry/libs`，执行 Sync/Clean/Rebuild |
| `HAR not found` | 尚未运行构建/复制脚本 | 运行 `build-har.ps1` 和 `copy-har-to-demo.ps1` |
| `Failed to resolve OhmUrl` | 依赖路径或缓存仍指向旧模块 | 确认 `file:./libs/myascf_runtime.har`，清理缓存后同步 |
| `undefined module` | HAR 入口或依赖未解析 | 检查 `main: Index.ets` 与包名 `myascf_runtime` |
| `Cannot import files outside current module` | 跨工程源码 import | 只使用 `import { MyASCFRuntime } from 'myascf_runtime'` |
| Vite assets 404 / ArkWeb 白屏 | rawfile 相对资源或 origin-null CORS | 使用 Demo 的单文件内联构建并重新同步 rawfile |
| `TIMEOUT` | H5 未在时限内收到 callback | 区分 SDK timeout 与 Native network timeout，检查 HiLog 链路 |
| `CALLBACK_LOST` | callback 已清理或 requestId 不匹配 | 检查超时、取消和重复响应 |
| `UNKNOWN_ACTION` | SDK action 与 HAR 不匹配 | 对比 `runtime.getApiList` 与生成 Manifest |
| HTTP 404/500 | 服务端返回有效非 2xx | Promise 默认 resolve，检查 `data.ok=false` 与 `statusCode` |
| Network reject | DNS、连接、协议、URL 或 Native timeout | 查看 Network 错误码，勿把它与 HTTP 非 2xx 混淆 |
| Network 无权限 | Demo 未声明 Internet 权限 | 在 `module.json5` 声明 `ohos.permission.INTERNET` |
| Clipboard Read 失败 | 未授权读取剪贴板 | 声明并由用户授权 `ohos.permission.READ_PASTEBOARD` |

日志建议依次过滤 `[ArkWeb]`、`[JavaScriptProxy]`、`[BridgeController]`、`[Dispatcher]`、`[CallbackExecutor]`。

