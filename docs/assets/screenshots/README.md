# 截图清单

这篇文档解决什么问题：规定 v0.1.0 GitHub 展示版需要采集的真实截图、稳定文件名和验收重点，避免 README 引用不存在或未经验证的图片。

## 当前状态

当前仓库尚未提交以下运行截图，全部标记为“待真实采集”。请在 DevEco Studio、模拟器/真机或 GitHub Actions 页面中完成实际操作后截图，不使用设计稿、合成图或生成图片代替运行证据。

| 文件名 | 展示内容 | 状态 |
| --- | --- | --- |
| `01-home-page.png` | H5 Demo 首页、操作区域和页面结构 | 待真实采集 |
| `02-toast-api.png` | `ui.showToast` 调用后的系统 Toast | 待真实采集 |
| `03-clipboard-api.png` | Clipboard 写入、读取及 H5 响应 | 待真实采集 |
| `04-storage-api.png` | Storage set/get/remove/clear 的结果 | 待真实采集 |
| `05-runtime-api-list.png` | `runtime.getApiList` 返回的内置 API 列表 | 待真实采集 |
| `06-debug-panel-success.png` | DebugPanel 成功调用记录和 requestId | 待真实采集 |
| `07-debug-panel-error.png` | UNKNOWN_ACTION、PARAM_ERROR 或 TIMEOUT 记录 | 待真实采集 |
| `08-web-load-state.png` | Web 容器 loading/progress/success 状态 | 待真实采集 |
| `09-url-guard-error-page.png` | URL Guard blocked 或加载错误重试页 | 待真实采集 |
| `10-ci-passed.png` | GitHub Actions `CI` workflow 真实成功结果 | 待首次线上 CI 通过后采集 |

## 采集要求

- 使用当前候选 commit，记录设备、HarmonyOS SDK 和 DevEco Studio 版本。
- 截图只保留项目界面和必要调试信息，移除账号、路径、通知和其他隐私内容。
- API 截图应同时展示操作入口与结果，DebugPanel 截图应保留 action、状态和 requestId。
- CI 截图必须来自仓库真实 Actions 页面，不根据本地结果提前制作。
- 图片建议使用 PNG，保持原始比例，不拉伸，不添加会遮挡结果的装饰。

## README 接入

完成采集后，将图片放入本目录并逐项更新状态。根 README 在至少具备首页、成功链路、错误链路和 CI 四类真实截图后，再添加图片预览；当前只链接本清单。
