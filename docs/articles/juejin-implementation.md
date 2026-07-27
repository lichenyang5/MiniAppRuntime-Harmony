# 一个 JSBridge 请求是怎样完成的：requestId、Dispatcher、Biz/Imp 与 Promise 回调

## 你将学会什么

沿真实调用链理解 requestId、callback map、分发注册、Biz/Imp、回调、超时和取消如何协作。

## 摘要

本文沿一行 `api.ui.showToast()` 真实回读 MiniAppRuntime-Harmony 源码，解释 requestId、callback map、JavaScriptProxy、Dispatcher、Biz/Imp、BridgeResponse、timeout 和 AbortController 怎样协作。

**适合读者：**希望理解 JSBridge 请求生命周期，而不只会调用接口的开发者。

## 正文目录

1. 一行调用背后
2. H5 requestId 与 callback map
3. JavaScriptProxy 到 Dispatcher
4. Biz/Imp 与 BridgeResponse
5. runJavaScript 回调
6. timeout、取消与 Manifest

## 1. 一行调用背后

```ts
const api = createTypedApi(initMyASCF());
await api.ui.showToast({ message: 'Hello' });
```

typed helper 最终仍调用 `client.sendTyped` 和 `send`。SDK 构造：

```ts
const request = {
  requestId: createRequestId(),
  action: 'ui.showToast',
  params: { message: 'Hello' }
};
```

## 2. requestId 与 callback map

action 不能区分并发请求。SDK 用 `Map<string, CallbackRecord>` 保存 resolve、reject、timer、action、params 和创建时间。Native 响应回来后，`take(requestId)` 同时读取和删除 callback，避免重复 settle。

NativeAdapter 的完整边界只有一次 JSON 调用：

```ts
class NativeAdapter {
  constructor(private readonly targetWindow: Window) {}
  postMessage(request: BridgeRequest): void {
    const nativeBridge = this.targetWindow.MyASCFNative;
    if (!nativeBridge || typeof nativeBridge.postMessage !== 'function') {
      throw new Error('Native bridge is unavailable.');
    }
    nativeBridge.postMessage(JSON.stringify(request));
  }
}
```

## 3. JavaScriptProxy 到 Dispatcher

ArkWeb 注入 `MyASCFNative`，methodList 是 `['postMessage']`。Runtime 门面内部创建 Registry、Dispatcher、CallbackExecutor、Controller 和 JavaScriptProxy。

```ets
postMessage(message: string): void {
  this.bridgeController.handleMessage(message);
}
```

BridgeController 解析 JSON，Dispatcher 从 Registry 查 handler。未知 action 返回 `1001 UNKNOWN_ACTION`，不需要在 Controller 增加 switch。

## 4. Biz/Imp 与 BridgeResponse

ToastBiz 检查 message 是非空字符串，再调用 ToastImp：

```ets
promptAction.showToast({ message: message, duration: 2000 });
```

响应保持统一：

```json
{
  "requestId": "myascf_...",
  "code": 0,
  "message": "showToast success",
  "data": { "echoAction": "ui.showToast" }
}
```

Network 额外返回 statusCode、ok、headers、body 和 Native duration。Bridge code 0 不等于 HTTP 2xx。

## 5. runJavaScript 回调

BridgeCallbackExecutor 先 `JSON.stringify(response)`，再把整个字符串作为 JavaScript 参数二次 stringify，避免引号破坏脚本：

```ets
const responseText: string = JSON.stringify(response);
const responseArg: string = JSON.stringify(responseText);
await controller.runJavaScript(
  `if (window.__myascf_on_native_response__) { ` +
  `window.__myascf_on_native_response__(${responseArg}); }`
);
```

SDK 全局 callback 解析响应、按 requestId 取 callback、清理资源，再按 code resolve/reject。

## 6. timeout、取消与 Manifest

H5 callback 默认 timeout 5000ms；Network Native 默认 10000ms。Network 调用应把 H5 timeout 配得更长。

AbortSignal 触发后，SDK 清理 callback、timer、listener，并发送 internal `network.abort`。Runtime 从 NetworkRequestRegistry 找到活动请求并调用 destroy。晚到响应只记录，不二次回调。

Manifest 同时驱动 9 个公开 typed API、`runtime.getApiList`、README 表和一致性检查，internal `network.abort` 不对业务暴露。

项目地址：[MiniAppRuntime-Harmony](https://github.com/lichenyang5/MiniAppRuntime-Harmony)

安装：

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
ohpm install myascf_runtime@1.0.0
```

## 已知边界

本文代码来自当前 `0.1.0 / 1.0.0`。项目不宣称生产级；权限、设备和网络环境需要独立验证。

## 总结

稳定 JSBridge 的关键不是某个 Proxy API，而是请求从创建、注册、分发、执行到清理都拥有明确边界。

## 下一步阅读

- [请求生命周期](../architecture/request-lifecycle.md)
- [扩展新 API](../guide/extending-api.md)
