# 本地 HAR 使用指南

这篇文档解决什么问题：解释 `myascf_runtime` 是什么、为什么抽成 HAR，以及现有或新建 HarmonyOS 应用如何正确依赖它。

## 为什么使用 HAR

当 runtime 全部放在 `entry` 中时，它只能服务当前 Demo。抽成 HAR 后，示例应用负责 ArkWeb 和页面，框架模块负责通信、分发、注册、Biz/Imp、错误处理和回调执行，其他 Demo 可以复用同一套链路。

## 模块结构

```text
myascf_runtime/
  Index.ets
  oh-package.json5
  src/main/ets/Index.ets
  src/main/ets/MyASCFRuntime.ets
  src/main/ets/bridge/
  src/main/ets/dispatcher/
  src/main/ets/registry/
  src/main/ets/api/
  src/main/ets/biz/
  src/main/ets/imp/
  src/main/ets/error/
  src/main/ets/logger/
  src/main/ets/container/
```

模块根 `Index.ets` 转发 `src/main/ets/Index.ets` 的公共导出。BridgeController、Dispatcher、Registry、Bootstrap、Biz 和 Imp 保持内部实现。

## 当前工程依赖方式

`entry/oh-package.json5`：

```json5
{
  "dependencies": {
    "myascf_runtime": "file:../myascf_runtime"
  }
}
```

根 `build-profile.json5` 的 modules 中需要包含：

```json5
{
  "name": "myascf_runtime",
  "srcPath": "./myascf_runtime"
}
```

## MyASCFRuntime

门面类在内部创建 HandlerRegistry、BridgeDispatcher、BridgeCallbackExecutor、BridgeController 和 JavaScriptProxy，并通过 RuntimeBootstrap 注册 Toast、Clipboard 和 Storage。

```ts
private controller: webview.WebviewController = new webview.WebviewController();
private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));
```

Context 用于创建 Preferences，从而支持 Storage API。对外方法只有：

- `getNativeProxy()`：返回注入 ArkWeb 的对象。
- `getProxyName()`：返回 H5 访问的代理名。
- `getMethodList()`：返回允许 H5 调用的方法列表。

H5 仍统一通过 `window.myascf.send` 调用 Toast、Clipboard 和 Storage，不需要了解 HAR 内部对象。

## 新建 Demo 使用

将 `myascf_runtime` 作为同级模块引用，配置 file dependency 和根 modules，然后导入 `MyASCFRuntime`。完整页面示例见 [新建 Demo 接入 HAR](create-demo-with-har.md)。

## 常见错误

### Cannot find module 'myascf_runtime'

检查 `entry/oh-package.json5` 是否存在 file dependency，执行依赖同步，并确认根 `build-profile.json5` 已注册模块。

### HAR name 与 import 不一致

`myascf_runtime/oh-package.json5` 的 `name` 必须为 `myascf_runtime`，代码也必须从同名包导入。

### Invalid main file 'Index.ets'

确认 `myascf_runtime/oh-package.json5` 的 `main` 指向 `Index.ets`，并确认模块根目录确实存在该文件。

### 导出入口不一致

模块根 `Index.ets` 应转发 `src/main/ets/Index.ets`。公共入口至少需要导出 `MyASCFRuntime` 和接入所需类型。

### 修改依赖后仍无法识别

依次执行依赖安装或同步、Sync Project、Clean Project 和 Rebuild Project。
