# 从 Demo 到本地 HAR 包：把 HarmonyOS JSBridge 运行时做成可复用框架

这篇文档解决什么问题：说明 runtime 为什么要离开 entry、HAR 如何被新 Demo 依赖，以及 MyASCFRuntime 门面解决了什么。

## runtime 放在 entry 的问题

最小闭环阶段把 BridgeController、Dispatcher、Registry、Biz/Imp 都放在 entry，开发速度快，但其他应用无法直接复用；Demo 页面与框架代码也容易混在一起。

## 抽成 myascf_runtime

```text
entry/                 ArkWeb、H5 Demo、容器状态和演示按钮
myascf_runtime/        Bridge、Dispatcher、Registry、Biz/Imp、Error、Logger
```

entry 通过 `file:../myascf_runtime` 依赖 HAR，根 `build-profile.json5` 注册模块。模块根 `Index.ets` 与 `src/main/ets/Index.ets` 共同构成公共导出入口。

## 为什么还需要门面类

仅仅移动文件还不够。如果外部仍要手动创建 Registry、Dispatcher、CallbackExecutor、Controller 和 Proxy，接入成本依然很高。`MyASCFRuntime` 在内部完成这些组装，外部只使用：

```ts
private runtime: MyASCFRuntime =
  new MyASCFRuntime(this.controller, getContext(this));
```

然后把 `getNativeProxy()`、`getProxyName()`、`getMethodList()` 交给 `.javaScriptProxy(...)`。Context 用于 Storage Preferences。

## 新建 Demo 如何依赖

1. 把 `myascf_runtime` 放到工程根目录。
2. 配置 entry file dependency。
3. 在根 build-profile 注册模块。
4. 导入 MyASCFRuntime 并注册 JavaScriptProxy。
5. 同步依赖、Clean、Rebuild。

## 常见报错

`Cannot find module 'myascf_runtime'` 通常来自 package name、file dependency、modules 注册或导出入口不一致。`Invalid main file 'Index.ets'` 则需要检查 HAR 根入口是否真实存在。

HAR 让 entry 成为示例，让 runtime 具备被其他应用依赖的基础。这并不代表已经完成独立发布、版本治理和兼容性承诺，但项目已经从应用内代码走向可复用模块雏形。
