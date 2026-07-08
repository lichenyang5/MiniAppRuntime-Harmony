# ArkWeb 加载本地 H5 Demo

## 本步骤目标

本步骤只验证 HarmonyOS ArkTS 页面可以通过 ArkWeb 加载应用内 `rawfile` 目录下的本地 H5 Demo 页面。

当前阶段目标：

- 使用 `Web` 组件作为应用首页主体。
- 使用 `webview.WebviewController` 创建 ArkWeb 控制器。
- 通过 `$rawfile('web/index.html')` 加载本地 H5 页面。
- 在 H5 页面展示项目标题、阶段说明和一个按钮。
- 点击按钮时只在 H5 console 输出日志。

本步骤不实现 H5 调 ArkTS，也不实现 JSBridge 分发链路。

## 修改文件

```text
entry/src/main/ets/pages/Index.ets
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/js/myascf.js
entry/src/main/resources/rawfile/web/js/demo.js
entry/src/main/resources/rawfile/web/css/demo.css
docs/02-arkweb-local-h5.md
```

## ArkWeb 加载本地 Rawfile H5 的原因

第一阶段需要先确认 Web 容器基础能力可用，再继续接入 JavaScriptProxy 和 JSBridge。

选择 `rawfile` 的原因：

- H5 Demo 随应用一起打包，不依赖远程网络。
- 页面内容稳定，方便验证 ArkWeb 容器是否正常加载。
- 后续可以逐步在同一目录中补充 `myascf.js`、demo 脚本和样式。
- 本地页面适合做最小闭环验证，避免过早引入白名单、远程 URL、安全策略等复杂问题。

当前 ArkTS 加载方式：

```ts
import { webview } from '@kit.ArkWeb';

private controller: webview.WebviewController = new webview.WebviewController();

Web({ src: $rawfile('web/index.html'), controller: this.controller })
```

## H5 Demo 文件结构

```text
entry/src/main/resources/rawfile/web/
  index.html
  js/
    myascf.js
    demo.js
  css/
    demo.css
```

文件职责：

- `index.html`：展示项目标题、当前阶段说明和按钮。
- `js/myascf.js`：暂时只挂载 `window.myascf` 空壳对象，`send` 方法只输出 console 日志。
- `js/demo.js`：绑定按钮点击事件，点击后输出 H5 console 日志并调用空壳 `window.myascf.send`。
- `css/demo.css`：提供基础页面样式。

## 当前实现范围

本次实现范围严格限制在 Web 容器和本地 H5 资源加载：

- `Index.ets` 从默认 Hello World 页面改为 ArkWeb 容器页。
- 创建了本地 H5 demo 页面和静态资源。
- H5 页面按钮可以触发前端日志。
- `window.myascf.send` 只是占位方法，不会调用 ArkTS。

## 当前没有实现 JSBridge 的原因

JSBridge 最小闭环需要同时引入 JavaScriptProxy、请求协议、Dispatcher、Registry、Biz、Imp、错误处理和回调机制。

本步骤先只验证 ArkWeb 可以稳定加载本地页面，原因是：

- Web 容器可用是后续通信链路的前置条件。
- 先把 H5 demo 页面落地，后续可以在同一页面上逐步接入 `window.myascf.send`。
- 避免一次性引入过多运行时模块，方便定位问题。
- 符合当前项目“先做最小可运行闭环，不追求大而全”的阶段原则。

## 验收标准

- HarmonyOS 应用可以正常启动。
- `Index.ets` 中的 ArkWeb 可以加载 `rawfile/web/index.html`。
- H5 页面可以显示项目标题、阶段说明和按钮。
- 点击按钮时，H5 侧可以输出 console 日志。
- 本次不要求 H5 调用 ArkTS。
- 本次不实现 Dispatcher / Registry / Biz / Imp。

## 下一步计划

下一步接入 JavaScriptProxy，实现 H5 调 ArkTS 的最小通信边界：

1. 在 H5 侧将 `window.myascf.send(action, params)` 从空壳改成生成请求对象。
2. 在 ArkTS 侧通过 JavaScriptProxy 暴露接收入口。
3. 定义最小请求格式：`requestId`、`action`、`params`。
4. ArkTS 暂时只接收并打印请求，不做 Dispatcher 分发。
5. 接收边界稳定后，再进入 Dispatcher / Registry / ToastBiz / ToastImp。
