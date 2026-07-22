# Demo Screenshot Checklist

这篇文档解决什么问题：记录 npm + HAR 独立 Demo 需要补充的真实证据，不使用生成或模拟截图替代运行结果。

| File | Evidence | Status |
| --- | --- | --- |
| `01-npm-install.png` | npm registry 安装与包版本 | Pending capture |
| `02-browser-native-unavailable.png` | 普通浏览器 NATIVE_UNAVAILABLE | Pending capture |
| `03-har-build.png` | HAR build path、size、time | Pending capture |
| `04-har-copy.png` | HAR source/target/size | Pending capture |
| `05-deveco-import.png` | DevEco Sync 与 HAR 依赖 | Pending capture |
| `06-arkweb-demo.png` | ArkWeb 页面与四个全局对象 | Existing device evidence is outside this folder; curate before commit |
| `07-toast-success.png` | Toast resolve、requestId、code | Existing device evidence is outside this folder; curate before commit |
| `08-api-list.png` | runtime.getApiList | Existing repository screenshot can be curated |
| `09-storage-success.png` | Storage set/get | Existing repository screenshot can be curated |
| `10-network-request.png` | 2xx 与非 2xx HTTP 语义 | Pending device capture |

截图前应隐藏账号、设备标识、绝对路径、token、Authorization、Cookie 和签名信息。
