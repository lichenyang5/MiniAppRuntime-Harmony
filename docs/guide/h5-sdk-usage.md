# H5 SDK 使用指南

这篇文档解决什么问题：说明 H5 页面如何接入 `miniapp-runtime-harmony-web-sdk`，并通过 Promise 调用 ArkTS runtime。

当前 SDK 候选版本为 `0.1.0`，通过仓库 dist 文件接入，尚未发布到 npm。`private: true` 用于防止准备阶段误发布。

## 构建与引入

```bash
npm --prefix h5_sdk install
npm run h5:sync
```

同步后，Demo 继续使用原来的脚本路径：

```html
<script src="./js/debug-panel.js"></script>
<script src="./js/myascf.js"></script>
<script src="./js/demo.js"></script>
```

DebugPanel 先加载，SDK 随后注册可选调试钩子，最后由 Demo 发起业务调用。

## send 参数

```ts
window.myascf.send(action, params?, options?)
```

- `action`：Native API 名称，例如 `ui.showToast`。
- `params`：请求参数对象，省略时使用空对象。
- `options.timeout`：等待 Native 响应的毫秒数；省略或小于等于零时使用 5000ms。

调用示例：

```js
const response = await window.myascf.send(
  'ui.showToast',
  { message: 'hello from h5' },
  { timeout: 5000 }
);
```

## Promise 返回值

Native 返回 `code === 0` 时 Promise resolve，其他标准错误响应会 reject：

```js
try {
  const response = await window.myascf.send('system.storage.getItem', {
    key: 'username'
  });
  console.log(response.data.value);
} catch (response) {
  console.error(response.code, response.message);
}
```

## Timeout

```js
await window.myascf.send('ui.showToast', {
  message: 'timeout test'
}, {
  timeout: 1000
});
```

超过等待时间后，SDK 删除 callback、记录 DebugPanel 错误并以 `TIMEOUT` reject。迟到的 Native 响应会进入 `CALLBACK_LOST`，不会再次改变已结束的 Promise。

## 普通浏览器中的行为

`window.MyASCFNative` 由 HarmonyOS ArkWeb 的 JavaScriptProxy 注入。普通浏览器没有该对象，因此 SDK 会以 `NATIVE_UNAVAILABLE` reject，并提示应在 ArkWeb 容器中运行，而不是直接抛出未捕获异常。

## 与 MyASCFNative 的关系

SDK 把 BridgeRequest 序列化后调用：

```js
window.MyASCFNative.postMessage(requestText);
```

ArkTS 处理完成后，通过 `runJavaScript` 调用：

```js
window.__myascf_on_native_response__(responseText);
```

SDK 根据 response 的 requestId 找回 callback，并完成 Promise。

## 与 MyASCFRuntime 的关系

H5 SDK 是调用侧；HAR 中的 `MyASCFRuntime` 是 Native 侧门面。HarmonyOS 页面创建 `MyASCFRuntime` 并把 `getNativeProxy()` 暴露给 ArkWeb，H5 SDK 不负责 HAR 初始化、Dispatcher 注册或平台能力调用。

发布前包内容和检查流程见 [npm publish checklist](../release/npm-publish-checklist.md)。
