# Changelog

## 1.1.1

- 隐去非网络 Bridge 参数正文，避免宿主备份、存储和剪贴板内容写入公共日志。
- 保留请求 ID、action、响应码及网络请求脱敏摘要，调用协议与 1.1.0 兼容。
- 补齐 OHPM author 联系 URL，并在发布检查中校验源包与 HAR 作者信息。

## 1.1.0

- 新增 MyASCFRuntime.registerCustomApi 宿主能力注册入口。
- 公开 BridgeHandler、BridgeRequest、BridgeRequestParams 和 CustomApiMetadata。
- runtime.getApiList 支持发现宿主注册的 app.* 能力。
- 增加重复注册保护、回归测试和接入示例。

## 1.0.0

- 提供 `MyASCFRuntime` 统一入口。
- 提供 JavaScriptProxy、Dispatcher、HandlerRegistry、Biz/Imp 和回调执行链路。
- 提供 Toast、Clipboard、Storage、Runtime API List 和 Network Request 能力。
- 提供 API Manifest、错误模型和 Web 容器公共模型。
- 冻结首版公共入口，仅保留门面、必要响应/错误、网络配置与 Web 容器类型。
- 补充宿主权限、OHPM 发布边界和 HAR 内容校验说明。
