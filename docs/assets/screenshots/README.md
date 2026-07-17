# Screenshot Evidence

这篇文档解决什么问题：记录 v0.1.0 展示版已有的真实截图、仍需补拍的场景，以及不适合用静态图片证明的能力。

## 已完成

| File | What it proves | Note |
| --- | --- | --- |
| [01-home-page.jpeg](01-home-page.jpeg) | ArkWeb 已加载本地 H5 首页，页面包含容器、Toast 与 Clipboard 操作区域 | 画面顶部含开发调试触摸信息，发布展示时可考虑重拍更干净版本 |
| [02-toast-api.jpeg](02-toast-api.jpeg) | `ui.showToast` 触发了系统 Toast | 同时可见 H5 Demo 操作区 |
| [04-storage-api.jpeg](04-storage-api.jpeg) | `system.storage.setItem` Promise resolve，并显示 requestId、action 与 data | 只直接证明 setItem 场景 |
| [05-runtime-api-list.jpeg](05-runtime-api-list.jpeg) | DebugPanel 展示成功调用记录 | 画面可见 Toast、Clipboard、Storage 的 resolve 记录 |
| [06-debug-panel-success.jpeg](06-debug-panel-success.jpeg) | `runtime.getApiList` 返回 API Manifest 摘要 | 文件名保留稳定，实际画面重点是 API 列表响应内容 |
| [07-debug-panel-error.jpeg](07-debug-panel-error.jpeg) | DebugPanel 展示 PARAM_ERROR 与 UNKNOWN_ACTION 等 reject 记录 | 可见错误 code 和 action |
| [10-ci-passed.png](10-ci-passed.png) | GitHub 页面显示 commit `f957db3` 的 1/1 检查通过 | 属于历史候选 commit 截图且含公开账号名；完成最终隐私复核前不嵌入根 README |

## 待补充

| Recommended name | Scene | Acceptance point |
| --- | --- | --- |
| `03-clipboard-api.png` | Clipboard write/read 独立结果 | 同屏显示写入文本、读取结果和 Promise 状态 |
| `08-web-load-state.png` | Web loading/progress 状态 | 清楚显示非瞬时加载进度或受控测试状态 |
| `09-url-guard-error-page.png` | URL Guard blocked 与错误页重试 | 显示拦截 URL、状态文案和重试入口 |

补拍后先检查通知、账号、设备标识、本机路径和其他隐私信息，再加入 README。已有图片也必须执行同样的最终复核。

## 不适合截图

- callback map 是否删除：应由单元测试和源码说明证明。
- timeout timer 是否清理：应由 H5 SDK 测试证明。
- Manifest 与注册关系是否一致：应由 `npm run check:api` 证明。
- package exports 和 npm 包白名单：应由 package 检查与 `npm pack --dry-run` 证明。
- “所有设备都兼容”或“生产可用”：当前没有足够证据，也不应通过单张截图声称。

## 命名规则

已有 `.jpeg` 文件保持稳定，不为统一扩展名而制造无意义历史变更。新截图使用上表中的固定 `.png` 名称；README 只引用仓库中真实存在的图片。
