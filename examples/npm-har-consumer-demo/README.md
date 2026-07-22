# npm H5 SDK + Local HAR Consumer Demo

这篇文档解决什么问题：提供一个不引用框架源码的独立 HarmonyOS Demo，验证 npm H5 SDK 与本地 HAR Runtime 的真实接入。

## 边界

- `web` 固定依赖 npm registry 的 `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`。
- 禁止 `file/link/workspace/tgz` SDK 依赖。
- `harmony` 只消费 `entry/libs/myascf_runtime.har`。
- 示例不提交 HAR、签名、证书、缓存、构建目录和本机绝对路径。

## 结构

```text
npm-har-consumer-demo/
  web/                         React + Vite
  harmony/                     HarmonyOS Stage Model
    entry/libs/README.md       HAR 复制说明
    entry/src/main/resources/rawfile/web/
```

## 构建

在仓库根执行：

```powershell
.\scripts\build-har.ps1
.\scripts\copy-har-to-demo.ps1
```

```bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
```

然后用 DevEco Studio 打开 `harmony`，执行 Sync、Clean、Rebuild、Run。签名只在本机配置，不提交。

## Demo Actions

- `ui.showToast`
- `runtime.getApiList`
- `system.storage.setItem/getItem`
- `system.clipboard.writeText/readText`
- `network.request` GET 2xx
- `network.request` 非 2xx

页面显示 Bridge 环境、action、requestId、code、message、data、duration、HTTP status、HTTP ok 和错误类别。HTTP 404/500 默认 resolve 且 `data.ok=false`；网络连接、URL 和 timeout 错误 reject。

## 当前证据

- npm registry SDK、Web build、rawfile 单文件同步：已验证。
- HAR build、复制、HarmonyOS 编译和 HAP 打包：已验证；公开示例未提交签名配置，因此安装到设备前需配置自己的调试签名。
- Toast：已有真机 resolve 证据。
- API List、Storage：仓库已有真实运行截图。
- Clipboard、Network 2xx/非 2xx：待本次独立 Demo 真机回归，不提前标记完成。

完整教程见 `docs/guide/npm-sdk-har-demo.md`。
