# Runtime API

这篇文档解决什么问题：说明 `runtime.getApiList` 如何让 H5 动态读取 HAR 内置 API Manifest，以及它为什么属于运行时自省而不是系统能力。

## runtime.getApiList

该 action 读取 `BUILTIN_API_MANIFEST`，由 RuntimeInfoBiz 转换为适合 H5 展示的精简 `ApiSummary[]`。它不调用 HarmonyOS Kit，因此没有 Imp 层。

```js
const response = await window.myascf.send('runtime.getApiList', {});
console.log(response.data.apis);
```

## 成功响应

```json
{
  "requestId": "req_xxx",
  "code": 0,
  "message": "get api list success",
  "data": {
    "echoAction": "runtime.getApiList",
    "apis": [
      {
        "action": "ui.showToast",
        "category": "ui",
        "title": "显示 Toast",
        "description": "从 H5 侧触发 HarmonyOS Toast 提示。",
        "implemented": true,
        "paramsText": "message: string"
      }
    ]
  }
}
```

请求不要求参数，多余参数会被忽略。Manifest 读取或转换异常由 Dispatcher 转换为 `INTERNAL_ERROR`；TIMEOUT 和 CALLBACK_LOST 继续由既有 H5 机制处理。

## 调用链

```text
H5 -> JavaScriptProxy -> BridgeController -> BridgeDispatcher
-> HandlerRegistry -> RuntimeInfoBiz -> BUILTIN_API_MANIFEST
-> BridgeResponse.data.apis -> BridgeCallbackExecutor -> H5 Promise
```

当前只返回 action、category、title、description、implemented 和 paramsText，不向 H5 暴露 Biz、Imp、错误详情或 example。后续可以基于同一 Manifest 生成 API 文档。
