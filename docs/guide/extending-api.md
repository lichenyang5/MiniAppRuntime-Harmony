# 扩展一个新 API

你将学会什么：沿现有注册链路设计 `device.getInfo`，而不是把业务写进 BridgeController。本文只讲步骤，不向 Runtime 新增该 API。

1. 在 `ActionNames.ets` 定义 action。
2. 在 `ApiManifest.ets` 与 `tools/api-manifest.json` 描述参数、响应和错误。
3. 声明 Params/Response 类型。
4. 创建 Biz，完成参数校验和稳定错误转换。
5. 创建 Imp，只调用公开 HarmonyOS API。
6. 在 `RuntimeBootstrap` 注册 handler。
7. 运行 `npm run generate` 生成 typed helper 与 API 文档。
8. 增加 H5 单元测试、ArkTS 测试、Demo 和手工验收项。
9. 运行 `npm run check`，确认 ActionNames、Manifest、注册和生成物一致。

`BridgeController` 只解析协议和启动分发；不要在这里判断 `device.getInfo`，也不要让 H5 直接依赖 Imp。

## 下一步阅读

- [API Manifest](../concepts/api-manifest.md)
- [Biz 与 Imp](../concepts/biz-and-imp.md)
