# JSBridge Runtime Skill

专注实现 HarmonyOS ArkWeb 与 H5 的双向通信。

必须实现：
- requestId
- action
- params
- callback
- timeout
- resolve / reject
- UNKNOWN_ACTION
- PARAM_ERROR
- INTERNAL_ERROR
- CALLBACK_LOST

协议格式：

H5 -> ArkTS:

{
"requestId": "string",
"action": "ui.showToast",
"params": {}
}

ArkTS -> H5:

{
"requestId": "string",
"code": 0,
"message": "success",
"data": {}
}

设计要求：
- H5 侧暴露 window.myascf.send
- ArkTS 侧通过 JavaScriptProxy 接收消息
- ArkTS 侧通过 runJavaScript 回调 H5
- 所有 action 必须走 BridgeDispatcher
- 禁止在 Web 组件里直接写业务逻辑

每次实现后必须生成：
docs/01-jsbridge.md