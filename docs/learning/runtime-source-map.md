# Runtime Source Map

这篇文档解决什么问题：用面试复习视角说明 ArkTS HAR 核心文件的输入、输出、职责边界，以及每个文件不应该承担什么。

| File | Role | Input | Output | What I should understand | Should not do |
| --- | --- | --- | --- | --- | --- |
| `MyASCFRuntime.ets` | HAR 门面与对象组装 | WebviewController、Context | Native proxy、代理名、方法列表 | 构造 Registry、Dispatcher、CallbackExecutor、Controller、Proxy，并注册内置 API | 不处理具体 action，不暴露内部组装细节 |
| `Index.ets` | HAR 公共导出入口 | 模块导入请求 | 门面类与必要公共类型 | 外部应用只依赖稳定入口 | 不导出所有内部实现类 |
| `JavaScriptProxy.ets` | ArkWeb 注入边界 | raw message 字符串 | 转交 Controller | JavaScriptProxy 是 H5 到 ArkTS 的入口 | 不解析 JSON，不做业务分发 |
| `BridgeController.ets` | 协议入口控制层 | raw message | 交给 Dispatcher，并触发响应回调 | 解析请求、统一日志、处理 parse/dispatch 异常 | 不直接调用 Toast、Clipboard、Storage |
| `BridgeCallbackExecutor.ets` | H5 响应出口 | BridgeResponse | `runJavaScript` callback | 双重 JSON 序列化保护字符串边界，集中记录回调结果 | 不决定业务 code，不管理 H5 callback map |
| `BridgeDispatcher.ets` | action 分发 | BridgeRequest | BridgeResponse | 根据 action 找 handler，统一 UNKNOWN_ACTION 与 handler 异常 | 不注册 handler，不写参数校验 |
| `HandlerRegistry.ets` | handler 注册表 | action、handler | handler 或 undefined | 保存 action 到 BridgeHandler 的映射 | 不创建业务对象，不执行系统 API |
| `RuntimeBootstrap.ets` | 内置 API 装配 | Context | 已注册的 HandlerRegistry | 在启动阶段创建 Biz/Imp 并注册 8 个 action | 不参与每次请求的协议解析 |
| `ToastBiz.ets` | Toast 协议业务层 | BridgeRequest | BridgeResponse | 校验 message，决定成功或参数错误响应 | 不直接调用 ArkUI API |
| `ToastImp.ets` | Toast 平台实现 | message | Promise<void> | 调用公开 `promptAction.showToast` | 不理解 requestId 或错误协议 |
| `ClipboardBiz.ets` | Clipboard 业务层 | BridgeRequest | BridgeResponse | 校验写入文本，组织读写响应 | 不处理系统剪贴板对象 |
| `ClipboardImp.ets` | Clipboard 平台实现 | text 或无参数 | 写入完成或读取文本 | 封装公开 pasteboard 能力 | 不生成 BridgeResponse |
| `StorageBiz.ets` | Storage 业务层 | BridgeRequest | BridgeResponse | 校验 key/value，组织 set/get/remove/clear 语义 | 不直接创建 Preferences |
| `StorageImp.ets` | Storage 平台实现 | Context、key/value | 存储操作结果 | Context 用于获取 Preferences，写操作 flush | 不处理 JSBridge action |
| `RuntimeInfoBiz.ets` | runtime 自省 | BridgeRequest | API 摘要列表 | 从 `BUILTIN_API_MANIFEST` 映射 H5 可展示信息 | 不调用系统 Kit，因此不需要 Imp |
| `ApiManifest.ets` | HAR 能力元数据 | 静态声明 | ApiManifestItem[] | 描述 action、参数、响应、错误与实现状态 | 不代替 RuntimeBootstrap 的真实注册 |

## 一条需要记住的边界

Controller 负责“这是不是一个可处理的 Bridge 请求”，Dispatcher 负责“这个 action 交给谁”，Biz 负责“参数和响应语义是否正确”，Imp 负责“公开 HarmonyOS 能力怎么调用”。
