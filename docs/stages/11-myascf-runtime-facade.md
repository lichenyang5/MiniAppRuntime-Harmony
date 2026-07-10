# 阶段 11：MyASCFRuntime 门面类

这篇文档解决的问题：记录如何在 HAR 模块内封装统一对外入口 `MyASCFRuntime`，让 entry 示例应用不再直接组装 JSBridge 内部对象。

## 本步骤目标

在 `myascf_runtime` HAR 内新增 `MyASCFRuntime` 门面类。外部应用只需要传入 `webview.WebviewController`，即可拿到 ArkWeb `javaScriptProxy` 所需的对象、名称和方法列表。

## 为什么需要门面类

HAR 抽取后，如果 entry 仍然直接创建：

```text
BridgeController
BridgeDispatcher
HandlerRegistry
RuntimeBootstrap
JavaScriptProxy
```

那么 runtime 的内部结构仍然暴露给示例应用。后续如果调整 Dispatcher、Registry 或 Bootstrap，entry 也要跟着改。

`MyASCFRuntime` 把这些组装逻辑收回 HAR 内部，让外部接入更稳定。

## 当前接入方式

entry 侧只需要：

```ts
import { webview } from '@kit.ArkWeb';
import { MyASCFRuntime } from 'myascf_runtime';

private controller: webview.WebviewController = new webview.WebviewController();
private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller);
```

注册到 ArkWeb：

```ts
Web({ src: $rawfile('web/index.html'), controller: this.controller })
  .javaScriptProxy({
    object: this.runtime.getNativeProxy(),
    name: this.runtime.getProxyName(),
    methodList: this.runtime.getMethodList(),
    controller: this.controller
  })
```

## MyASCFRuntime 内部完成什么

- HandlerRegistry 创建。
- RuntimeBootstrap 注册内置 API。
- BridgeDispatcher 创建。
- BridgeCallbackExecutor 创建。
- BridgeController 创建。
- JavaScriptProxy 创建。

## 对外方法

```ts
getNativeProxy()
getProxyName()
getMethodList()
```

当前 proxy 名称仍然是：

```text
MyASCFNative
```

当前 methodList 仍然是：

```text
postMessage
```

## 当前实现范围

本阶段只封装 HAR 对外入口：

- 不新增业务 API。
- 不修改 H5 协议。
- 不修改 Toast / Clipboard 行为。
- 不修改 DebugPanel 行为。

## 验收标准

- `entry` 只从 `myascf_runtime` 导入 `MyASCFRuntime`。
- `entry` 不再直接创建 BridgeController、JavaScriptProxy、BridgeDispatcher、HandlerRegistry 或 RuntimeBootstrap。
- `myascf_runtime/src/main/ets/Index.ets` 只导出 `MyASCFRuntime` 和必要类型。
- `getNativeProxy()` 的公开返回类型是 `MyASCFNativeProxy`，不泄漏内部 `JavaScriptProxy` 类。
- H5 仍然通过 `window.MyASCFNative.postMessage` 调用 ArkTS。
- Toast、Clipboard、TIMEOUT、CALLBACK_LOST、DebugPanel 链路不变。
