# 从 H5 到 HarmonyOS：我做了一个 npm + OHPM 双端发布的 ArkWeb JSBridge 框架

## 你将学会什么

理解一个 HarmonyOS JSBridge 框架怎样拆分 npm H5 SDK、OHPM Runtime、协议层、能力层和工程验证。

## 摘要

MiniAppRuntime-Harmony 把 H5 SDK 发布到 npm，把 ArkTS Runtime 发布到 OHPM。React、Vue 或普通 H5 可以用同一套 Promise API 调用 HarmonyOS 能力，同时保留 requestId、timeout、取消、统一错误和调试记录。

**适合读者：**正在使用 ArkWeb、希望整理 Web 与 ArkTS 通信边界的前端或 HarmonyOS 开发者。

## 正文目录

1. 通信代码为什么会变乱
2. 最终使用方式
3. 为什么拆成两个包
4. 一次请求怎样走完
5. 当前 API 与普通浏览器边界
6. 工程闭环与已知边界

## 1. 通信代码为什么会变乱

最初的 WebView 通信往往只有一个方法：H5 发字符串，Native 做点事情。加入并发请求后，需要 requestId；加入失败处理后，需要统一错误；加入网络请求后，又需要区分 HTTP 404、连接失败和 callback timeout。

如果这些判断都堆在 Web 组件或一个巨大 switch 里，通信入口会越来越难改。我做这个项目，不是为了制造更多概念，而是为了让每一层只回答一个问题。

## 2. 最终使用方式

安装两个公开包：

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
ohpm install myascf_runtime@1.0.0
```

一个完整的 React 组件可以很短：

```tsx
import { useState } from 'react';
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const api = createTypedApi(initMyASCF());

export default function App() {
  const [result, setResult] = useState('Ready');
  const run = async (): Promise<void> => {
    try {
      const response = await api.ui.showToast({ message: 'Hello HarmonyOS' });
      setResult(JSON.stringify(response, null, 2));
    } catch (error: unknown) {
      setResult(JSON.stringify(error, null, 2));
    }
  };
  return <><button onClick={() => void run()}>Toast</button><pre>{result}</pre></>;
}
```

## 3. 为什么拆成两个包

H5 SDK 是普通 TypeScript，它适合 npm、Vite 和浏览器测试。ArkTS Runtime 是 HAR，需要 ArkWeb、Preferences、pasteboard 和 NetworkKit，因此适合 OHPM 和 DevEco Studio。

两端共享的是协议，不是源码路径。独立 Demo 同时使用 npm `0.1.0` 和 OHPM `1.0.0`，不引用 `file:` HAR。

## 4. 一次请求怎样走完

```mermaid
flowchart LR
  H["React / H5"] --> S["npm SDK"]
  S --> P["MyASCFNative.postMessage"]
  P --> J["JavaScriptProxy"]
  J --> D["Dispatcher / Registry"]
  D --> B["Biz / Imp"]
  B --> O["HarmonyOS Public API"]
  O --> R["runJavaScript callback"]
  R --> C["callback map / Promise"]
```

H5 SDK 创建 requestId 并保存 Promise callback。ArkTS 通过 Registry 找 handler，Biz 校验参数，Imp 调用平台 API。响应通过 `runJavaScript` 回到 H5，SDK 再按 requestId settle 原 Promise。

## 5. 当前 API

当前有 9 个公开 action：运行时列表、Toast、Clipboard 两项、Storage 四项和 Network。`network.abort` 是 SDK 取消流程使用的 internal action。

Network 最容易误判。404/500 表示已经拿到 HTTP 响应，因此 Promise resolve，`data.ok=false`。DNS、连接失败、超时和取消才 reject。

普通浏览器没有 ArkWeb 注入的 `window.MyASCFNative`，SDK 会返回 `NATIVE_UNAVAILABLE`。这让同一个 React 页面可以先在浏览器开发 UI，再到 HarmonyOS 容器验证 Native 能力。

## 6. 工程闭环

项目已经完成 npm SDK、OHPM Runtime、公共包消费 Demo、Manifest 驱动类型和文档、24 项 H5 单元测试、CI、HAR/HAP 构建与调试面板。

项目地址：[MiniAppRuntime-Harmony](https://github.com/lichenyang5/MiniAppRuntime-Harmony)

完整 Demo：`examples/npm-har-consumer-demo/`

## 已知边界

这是基于公开 HarmonyOS 能力的个人开源工程实践，不宣称生产级。设备权限、系统 UI、Network 环境和 ArkWeb 行为仍需要目标设备回归；示例公共 URL 应替换为自己的可控服务。

## 总结

这个项目最重要的结果不是“多了几个 API”，而是把 H5 与 ArkTS 之间的请求生命周期变成了可解释、可测试、可发布的边界。

## 下一步阅读

- [实现原理](juejin-implementation.md)
- [完整 React App](../examples/complete-react-app.md)
