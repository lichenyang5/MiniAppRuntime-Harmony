# 安装 ArkTS Runtime

你将学会什么：从 OHPM 安装公开 HAR、声明宿主权限并从稳定入口导入门面类。

先确认消费工程和测试设备支持 API 23 或更高；`myascf_runtime@1.0.0` 发布包的最低兼容版本是 23。完整新工程接入见[快速开始](../getting-started/quick-start.md)。

在导入 Runtime 的 **entry 模块目录**执行安装：

```bash
cd entry
ohpm install myascf_runtime@1.0.0
cd ..
```

`entry/oh-package.json5`：

```json5
{
  "dependencies": {
    "myascf_runtime": "1.0.0"
  }
}
```

只从包入口导入：

```ets
import { MyASCFRuntime, NetworkPolicy } from 'myascf_runtime';
```

不要导入 Dispatcher、Registry、Biz、Imp 或 Logger。宿主必须声明 `ohos.permission.INTERNET` 才能请求网络；读取剪贴板需要 `ohos.permission.READ_PASTEBOARD` 与运行时授权。

安装后执行 OHPM Sync、Clean、Rebuild。独立 Demo 位于 `examples/npm-har-consumer-demo/harmony`，其 lockfile 应显示 registry 依赖，而不是 `file:` 路径。

## 下一步阅读

- [ArkWeb 接入](arkweb-integration.md)
- [OHPM 安装排障](../troubleshooting/ohpm-installation.md)
