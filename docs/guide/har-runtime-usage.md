# HAR Runtime Usage

## 你将学会什么

区分公开 OHPM 消费和仓库内源码联调两种 Runtime 使用方式。

## 外部应用

```bash
ohpm install myascf_runtime@1.0.0
```

```ts
import { MyASCFRuntime } from 'myascf_runtime';
```

外部应用只依赖包入口，不复制 HAR，也不从内部目录导入 Dispatcher、Registry、Biz 或 Imp。

## 仓库内源码联调

根 `entry` 可以使用 `file:../myascf_runtime`，便于修改 Runtime 后立即编译。这个依赖只服务单仓开发，不是公开接入教程。

需要检查候选 HAR 时可运行：

```powershell
.\scripts\build-har.ps1
node .\scripts\check-har-release.mjs --har ".\myascf_runtime\build\default\outputs\default\myascf_runtime.har"
```

## ArkWeb 注册

创建 `MyASCFRuntime(controller, context, policy?)`，把 `getNativeProxy()`、`getProxyName()` 和 `getMethodList()` 交给 `javaScriptProxy`。Context 用于 Storage，NetworkPolicy 用于网络白名单等宿主策略。

## 下一步

- [Runtime 安装](runtime-installation.md)
- [ArkWeb 接入](arkweb-integration.md)
- [OHPM 排错](../troubleshooting/ohpm-installation.md)
