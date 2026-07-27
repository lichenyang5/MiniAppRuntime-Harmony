# Biz 与 Imp

你将学会什么：参数校验、业务规则、平台调用和错误转换分别放在哪里。

Biz 处理协议语义：Toast 拒绝空 message，Storage 只接受非空 key 和字符串 value，Network 校验 URL、method、headers、timeout 与 responseType。

Imp 只处理平台能力：Preferences、pasteboard、`HttpRequest`、timeout 和 destroy。这样平台 API 变化不会污染 BridgeController。

## 下一步阅读

- [Dispatcher 与 Registry](dispatcher-and-registry.md)
- [扩展新 API](../guide/extending-api.md)
