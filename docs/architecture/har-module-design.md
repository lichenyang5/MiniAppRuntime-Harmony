# HAR 模块设计

这篇文档解决的问题：说明为什么要把 runtime 抽取为 `myascf_runtime` HAR 模块，以及 entry 示例应用如何依赖这个可复用库。

## 目标

抽取前，runtime 位于 `entry/src/main/ets/runtime`。这适合快速验证 Demo，但不适合长期复用。

抽取后：

```text
entry 示例应用
  -> 负责 ArkWeb 页面和 H5 Demo

myascf_runtime HAR
  -> 负责 JSBridge runtime 核心
```

## 模块结构

```text
myascf_runtime/
  build-profile.json5
  hvigorfile.ts
  Index.ets
  oh-package.json5
  src/main/module.json5
  src/main/ets/Index.ets
  src/main/ets/bridge/
  src/main/ets/dispatcher/
  src/main/ets/registry/
  src/main/ets/api/
  src/main/ets/biz/
  src/main/ets/imp/
  src/main/ets/error/
  src/main/ets/logger/
```

## 为什么是 HAR

HAR 是 HarmonyOS ArkTS 代码复用的一种常见模块形式。当前项目把 JSBridge runtime 放进 HAR，可以让 `entry` 更像示例应用，也让 runtime 后续具备被其他模块依赖的基础。

## entry 如何依赖

`entry/oh-package.json5`：

```json
{
  "dependencies": {
    "myascf_runtime": "file:../myascf_runtime"
  }
}
```

`Index.ets`：

```ts
import { MyASCFRuntime } from 'myascf_runtime';
```

entry 侧只需要创建 WebviewController 和 runtime 门面：

```ts
private controller: webview.WebviewController = new webview.WebviewController();
private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));
```

注册 JavaScriptProxy 时不再手动写 proxy 名称和方法列表：

```ts
Web({ src: $rawfile('web/index.html'), controller: this.controller })
  .javaScriptProxy({
    object: this.runtime.getNativeProxy(),
    name: this.runtime.getProxyName(),
    methodList: this.runtime.getMethodList(),
    controller: this.controller
  })
```

## 对外导出

`myascf_runtime/oh-package.json5` 的 `main` 指向模块根目录下的 `Index.ets`。根 `Index.ets` 只做包入口转发，实际导出清单放在 `myascf_runtime/src/main/ets/Index.ets`。

`myascf_runtime/src/main/ets/Index.ets` 当前导出：

- `MyASCFRuntime`
- `MyASCFNativeProxy`
- Bridge 请求/响应类型
- `BridgeErrorCode`

BridgeController、JavaScriptProxy、BridgeDispatcher、HandlerRegistry、RuntimeBootstrap、Biz 和 Imp 当前都保持为 HAR 内部实现，不建议 entry 直接依赖。

## MyASCFRuntime 门面职责

`MyASCFRuntime` 构造时接收 `webview.WebviewController`，并在 HAR 内部完成：

- 创建 HandlerRegistry。
- 通过 RuntimeBootstrap 注册内置 API。
- 创建 BridgeDispatcher。
- 创建 BridgeCallbackExecutor。
- 创建 BridgeController。
- 创建 JavaScriptProxy。

对外只暴露：

```ts
getNativeProxy()
getProxyName()
getMethodList()
```

## 职责边界

`entry`：

- Ability。
- ArkWeb 页面。
- rawfile H5 Demo。
- H5 DebugPanel。
- Demo 按钮和验收入口。

`myascf_runtime`：

- MyASCFRuntime 门面。
- JavaScriptProxy。
- BridgeController。
- Dispatcher / Registry。
- Biz / Imp。
- Error / Logger。
- runJavaScript 回调封装。

## 当前状态

HAR 模块结构已经建立，runtime 核心代码已经移动到 `myascf_runtime/src/main/ets`。当前环境没有可直接执行的 hvigor 命令，最终编译与真机回归需要在 DevEco Studio 中完成。

## 后续计划

- 在 DevEco Studio 中验证 HAR 编译。
- 为更多 API 增加文档和示例。
- 如果后续发布为独立库，再补充版本、依赖和发布说明。
## Context 与 Storage

这篇文档解决什么问题：说明需要 Context 的 Native 能力如何接入 HAR。

Storage 使用 Preferences，因此 Demo 创建门面时传入 `getContext(this)`：

```ts
private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));
```

门面将 Context 交给 RuntimeBootstrap 和 StorageImp。外部仍只注册 `runtime.getNativeProxy()`，无需创建 StorageBiz、StorageImp 或手动注册 action。
