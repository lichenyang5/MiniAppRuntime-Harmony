# OHPM 安装问题

你将学会什么：确认 registry、版本、lockfile 和 DevEco 同步状态。

```bash
ohpm info myascf_runtime@1.0.0
ohpm install myascf_runtime@1.0.0
ohpm list
```

`entry/oh-package.json5` 应使用版本 `1.0.0`，不是本机路径。若 lockfile 仍是 `registryType: local`，删除过期本地依赖配置后重新执行 install 和 Sync。

出现 `Cannot find module 'myascf_runtime'` 时，确认 OHPM install 成功、工程 modules 配置正确，并执行 Sync、Clean、Rebuild。只从包入口导入 `MyASCFRuntime`。

## 下一步阅读

- [Runtime 安装](../guide/runtime-installation.md)
- [Quick Start](../getting-started/quick-start.md)
