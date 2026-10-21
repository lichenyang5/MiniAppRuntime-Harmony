# 宿主扩展与内置 API 开发

Runtime 1.1.0 起提供 `runtime.registerCustomApi(action, handler, metadata?)`。宿主可以从 HAR 公共入口导入 handler 契约，直接注册自己的鸿蒙能力，继续使用 Runtime 原有解析、分发和 SDK 回调。

**使用已发布的 `myascf_runtime@1.1.1`。** 该版本包含宿主注册入口和参数日志脱敏修复；1.0.0 不含注册入口。消费项目直接安装公开 OHPM 包，无需本地 HAR。npm SDK `0.1.0` 的通用 `send` 可以调用自定义 action。

## 注册宿主能力

1. 实现公开 `BridgeHandler` 契约。handler 的 `handle` 接收 `BridgeRequest`，异步返回 `BridgeResponse`。
2. 在页面调用前，从宿主 ArkTS 代码注册 `app.*` action。
3. H5 使用同一个 SDK 实例的 `send` 调用该 action。

框架 Demo 的[HostEchoHandler](../../entry/src/main/ets/custom/HostEchoHandler.ets)是实际参加 HAP 编译的示例：

```ets
import { BridgeHandler, BridgeRequest, BridgeResponse, BridgeErrorCode } from 'myascf_runtime';

export class HostEchoHandler implements BridgeHandler {
  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    const text: string | undefined = request.params?.text;
    if (typeof text !== 'string' || text.length > 120) {
      return { requestId: request.requestId, code: BridgeErrorCode.PARAM_ERROR,
        message: 'text must be a string up to 120 characters' };
    }
    return { requestId: request.requestId, code: BridgeErrorCode.SUCCESS,
      message: 'host echo success', data: { text: text } };
  }
}
```

在已有 `runtime` 实例上注册：

```ets
runtime.registerCustomApi('app.echo', new HostEchoHandler(), {
  title: 'Host Echo',
  description: 'Echo implemented by this host',
  paramsText: 'text: string'
});
```

ArkWeb 仍绑定 `runtime.getNativeProxy()`，并沿用原有 proxy 名称与 methodList。无需额外解析请求或自行执行 SDK 的 callback。

H5 调用：

```js
const response = await window.myascf.send('app.echo', { text: 'Hello HarmonyOS' });
console.log(response.data.text);
```

React 中保留一个 `initMyASCF()` 创建的 client；内置能力使用 `createTypedApi(client)`，自定义能力使用 `client.send`。不要再初始化第二个 client 覆盖页面回调。

## 名称、元数据与能力列表

- action 必须使用 `app.*`，每段以英文字母开头，后续可含英文字母、数字和下划线，总长不超过 128。例：`app.backup.saveFile`。
- 同一 Runtime 实例只注册一次；重复注册报错，不替换原 handler。注册应在调用发生之前完成，宿主自行避免生命周期重复注册。
- 内置 `ui.*`、`system.*`、`network.*`、`runtime.*` 名称不能通过公开入口覆盖。
- 可选 metadata 包含 `title`、`description`、`paramsText`；传入时三者必须为字符串，title 不能为空。未传时列表使用 action 名与宿主自定义提示。
- `runtime.getApiList` 实时追加已注册的宿主能力，category 为 `app`，implemented 为 true。未注册时仍返回 9 个内置公开 API，内部 `network.abort` 仍不展示。
- 宿主 action 不写入内置 Manifest，也不会自动生成 typed helper。若需要严格类型，在消费项目给参数、响应和 client.send 封装自己的类型。
- 公共请求/响应类型可通过继承增加宿主字段；参数和响应结构由 handler 与消费端共同校验。

注册是信任宿主代码的扩展入口。注册后，当前绑定的 Web 页面可以调用该能力；宿主仍负责页面来源、权限、文件选择范围和每次调用的业务校验。注册名称不会代替用户授权。

## 响应与异步边界

返回原请求的 requestId；code = 0 表示成功，其他 code 会让 SDK Promise reject。handler 抛出的异常仍由 Dispatcher 转为关联原 requestId 的 INTERNAL_ERROR。应把可预期的业务失败转换成清晰的响应，不返回其他请求的 ID。

SDK AbortSignal 和 timeout 只停止页面等待，不能自动撤销已经开始的原生工作。文件选择器或写文件等长操作仍需宿主处理忙碌、取消和最终结果。Runtime 没有为自定义 action 自动增加 rollback 或 network.abort 协议。

## 本地验证与迁移

```powershell
npm run test:runtime
npm run check
./scripts/build-har.ps1
```

`test:runtime` 在 Node 中执行从实际 ArkTS 源码转译的 Registry、Dispatcher 和能力列表逻辑，仅替换平台 logger；它不代替 DevEco ArkTS 类型检查或真机验收。

框架 Demo 在页面首次出现时注册 `app.echo`，H5 底部“测试 app.echo”按钮可验收完整调用。普通公开包消费项目仍使用已发布版本，源码 Demo 与本地 HAR 用于开发验证。

React Todo 的文件备份代理迁移可在新版 Runtime 正式发布后进行：把 save/open 业务实现成 handler，再注册两个 action；保留原文件选择、大小限制、取消和预览逻辑。当前 Todo 的公开依赖保持可安装。

## 为框架增加内置 API

新增全体宿主共用的内置 API 时，继续维护 ActionNames、ApiManifest、tools/api-manifest.json 与 RuntimeBootstrap，运行 `npm run generate` 同步文档和 typed helper，再增加测试与手工验收。公共导出仍不开放 Dispatcher、Registry、Biz、Imp 和 Logger。

继续阅读：[API Manifest](../concepts/api-manifest.md)、[Biz 与 Imp](../concepts/biz-and-imp.md)。

## 本轮验收记录

2026-10-14：npm run check、5 项 Registry/Dispatcher/能力列表回归、HAR 公开导出与归档检查、公开类型消费 Demo 的签名 HAP 编译通过。真机点击“测试 app.echo”，SDK Promise resolve，返回 code 0、host echo success 和 Host extension works；runtime.getApiList 的页面列表同时显示 app.echo、APP · IMPLEMENTED 和 Host Echo；验证使用的是本地源码 Runtime，不代表 OHPM 发布版已包含该入口。
