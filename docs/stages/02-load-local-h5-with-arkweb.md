# 阶段 02：ArkWeb 加载本地 H5

这篇文档解决的问题：记录如何把默认 ArkUI 页面改造成 ArkWeb 容器页，并加载应用 `rawfile` 目录下的本地 H5 Demo。

## 本阶段目标

- 使用标准 `Web` 组件作为首页主体。
- 使用 `webview.WebviewController` 创建 ArkWeb 控制器。
- 通过 `$rawfile('web/index.html')` 加载本地 H5 页面。
- 页面展示项目标题、说明和按钮。
- 点击按钮时先只输出 H5 console 日志。

## 修改文件

```text
entry/src/main/ets/pages/Index.ets
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/js/myascf.js
entry/src/main/resources/rawfile/web/js/demo.js
entry/src/main/resources/rawfile/web/css/demo.css
```

## 为什么先加载本地 H5

ArkWeb 容器可用是后续 JSBridge 的前置条件。先加载本地 H5 可以避免网络、白名单、安全策略等问题干扰，把第一步验证聚焦在 Web 容器本身。

## H5 Demo 结构

```text
entry/src/main/resources/rawfile/web/
  index.html
  js/
    myascf.js
    demo.js
  css/
    demo.css
```

## 当前实现范围

当前已经完成 ArkWeb 加载本地 H5 页面。这个阶段没有实现 H5 调 ArkTS，也没有实现 Dispatcher / Registry / Biz / Imp。

## 验收标准

- HarmonyOS 应用可以正常启动。
- `Index.ets` 中的 ArkWeb 可以加载 `rawfile/web/index.html`。
- H5 页面可以显示项目标题、说明和按钮。
- 点击按钮时，H5 侧可以输出 console 日志。

## 下一步

接入 JavaScriptProxy，让 H5 可以把 JSON 字符串发送到 ArkTS。
