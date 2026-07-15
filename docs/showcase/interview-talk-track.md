# Interview Talk Track

这篇文档解决什么问题：提供 1 分钟、3 分钟和 5 分钟的真实项目讲解路径，并准备常见设计追问的回答。

## 1 分钟版本

这个项目是一个 HarmonyOS Web 容器与 JSBridge 运行时实践。我把 ArkTS 侧抽成了本地 HAR runtime，把 H5 侧抽成了 SDK，通过 requestId、callback map、Dispatcher、Registry、Biz/Imp 和 CallbackExecutor 实现 H5 调 ArkTS 的完整链路，并补充了 API Manifest、类型化 SDK、DebugPanel、测试和 CI。当前实现 Toast、Clipboard、Storage 与运行时 API 查询，重点是架构和工程边界，不把它描述为完整或生产级小程序平台。

## 3 分钟版本

1. **为什么做：**ArkWeb 注入一个 Native 方法容易，但并发请求、Promise 回调、action 扩展、参数错误、超时和调试需要完整治理。
2. **整体架构：**entry 负责 Web 容器；`myascf_runtime` HAR 负责 ArkTS 主链路；`h5_sdk` 负责浏览器侧请求生命周期。
3. **核心链路：**H5 `send` 生成 requestId，通过 JavaScriptProxy 进入 Controller，再经过 Dispatcher/Registry、Biz/Imp；响应由 CallbackExecutor 调用 `runJavaScript` 回到 callback map。
4. **当前 API：**Toast、Clipboard、Storage 和 `runtime.getApiList`，共 8 个 action。
5. **模块化：**`MyASCFRuntime` 在 HAR 内组装组件，entry 不直接了解 Dispatcher、Registry 和 Bootstrap。
6. **工程化：**Manifest 生成文档和 typed API，Node 测试覆盖 H5 协议，CI 检查生成物、注册关系、build/test 和 pack；设备能力由 smoke test 补充。

## 5 分钟版本

### 从 send 到 callback

H5 SDK 的 `send(action, params, options)` 生成唯一 requestId，把 resolve/reject 和 timeout timer 放入 callback map，再把 BridgeRequest JSON 发给 `window.MyASCFNative.postMessage`。JavaScriptProxy 将字符串交给 BridgeController 解析。Controller 不写具体 API 判断，而是交给 BridgeDispatcher；Dispatcher 从 HandlerRegistry 获取对应 handler。Biz 校验参数并定义响应语义，Imp 调用公开 HarmonyOS Kit。结果进入 BridgeCallbackExecutor，经过 `runJavaScript` 调用 H5 全局响应函数，SDK 按 requestId 取出 callback，清理 timer 后 resolve 或 reject。

### 为什么拆 Dispatcher / Registry

Controller 是协议边界，不应随着 API 数量增长。Dispatcher 负责统一未知 action 和异常处理，Registry 负责 action 到 handler 的映射，RuntimeBootstrap 负责内置能力注册。扩展 action 时修改集中在 action、Biz/Imp、Manifest 和注册处。

### 为什么拆 Biz / Imp

Biz 面向 JSBridge 协议，处理 params、错误码和响应 data；Imp 面向 HarmonyOS 能力。这样参数规则可以独立测试，系统 API 更换或权限差异不会污染协议入口。

### 为什么要 CallbackExecutor

所有 action 最终都要安全地序列化 BridgeResponse 并执行 `runJavaScript`。集中出口可以统一字符串转义、日志和回调错误，避免每个 API 自己拼 JavaScript。

### Manifest、SDK 与工程化

API Manifest 让 action、参数、响应、错误和实现状态可查询。`runtime.getApiList` 用它做运行时自省，工具脚本用 JSON 镜像生成 Markdown 与 H5 typed API。H5 SDK 同时提供 IIFE 和 ESM，兼顾 rawfile Demo 与现代前端工程。测试覆盖 requestId、成功/错误、timeout、callback lost、IIFE/ESM 和 DebugPanel 容错；CI 自动运行静态一致性、build、test 和 pack dry-run。ArkWeb 与设备权限仍做手工 smoke test。

## 高频面试问题

### 1. 为什么不用简单 if/else 判断 action？

少量原型可以，但 action 增长后 Controller 会同时承担协议、业务和平台逻辑。Registry 让扩展点显式，Dispatcher 可以统一错误和日志，也更容易检查注册是否与 Manifest 对齐。

### 2. requestId 解决什么问题？

它把异步响应关联到原请求。多个 H5 调用可以并发返回，不能依赖调用顺序；requestId 也是 timeout、DebugPanel 和 callback lost 定位的共同标识。

### 3. timeout 是谁判断的？

当前由 H5 SDK 在发送时启动 timer。到期后从 callback map 删除请求并 reject `TIMEOUT`。Native 晚到响应不会重新结算 Promise。

### 4. CALLBACK_LOST 是什么？

Native 响应带有 requestId，但 H5 callback map 已找不到对应项，常见于超时后的晚到响应或生命周期结束。SDK 记录 lost 状态，不抛未捕获异常。

### 5. Biz 和 Imp 为什么分开？

Biz 管 JSBridge 参数与响应语义，Imp 管 HarmonyOS API。分开后协议不依赖具体 Kit 调用细节，也便于替换实现和处理平台差异。

### 6. HAR 包解决了什么？

它把 runtime 主链路从 entry Demo 抽出。`MyASCFRuntime` 作为门面完成内部组装，新的 Demo 只需要 WebviewController、Context 和 JavaScriptProxy 配置。

### 7. H5 SDK 解决了什么？

它集中管理 requestId、callback map、timeout、Native 适配、响应校验和 DebugPanel 钩子，让业务页面不重复编写 Bridge 生命周期代码。

### 8. API Manifest 有什么意义？

它统一描述能力元信息，支持 `runtime.getApiList`、DebugPanel、文档生成和一致性检查。当前 ArkTS Manifest 与 JSON 仍是镜像，尚未完全统一成单一源。

### 9. typed API 怎么生成？

工具读取 `tools/api-manifest.json`，生成 action union、参数/响应映射和 nested helper。typed helper 最终仍调用现有 `send`，没有增加第二套协议。

### 10. CI 覆盖什么，不覆盖什么？

CI 覆盖 generated 文件、API 注册关系、H5 build/test、pack 和 package 入口；不覆盖 HAP、JavaScriptProxy 真机通信、权限和系统 UI，这些进入 manual smoke test。

### 11. 和生产级框架还有什么差距？

还缺更系统的安全模型、远程内容治理、兼容性矩阵、设备自动化、性能指标、版本兼容策略、发布渠道和长期维护验证。项目实现并解释了当前架构链路与工程方法，但设备兼容性、安全和长期运行仍需更完整验证。

## 自测版问题

下面的问题用于脱稿练习。先独立回答，再对照标准回答；能够说出职责边界比背文件名更重要。

### 1. 不看文档，能不能画出完整调用链？

标准回答：`window.myascf.send` 创建 requestId 和 callback，经 `MyASCFNative.postMessage` 进入 JavaScriptProxy，再到 Controller、Dispatcher、Registry、Biz、Imp。BridgeResponse 由 CallbackExecutor 通过 `runJavaScript` 返回 H5，全局 callback 按 requestId 找回 Promise 并 resolve/reject。

### 2. 能不能说明 SDK 和 HAR 的区别？

标准回答：H5 SDK 是浏览器侧 JSBridge 客户端，管理请求生命周期；HAR 是 ArkTS runtime，管理分发、业务校验和 HarmonyOS 能力。Demo 只是把两者接起来并展示结果。

### 3. 能不能说明 JavaScriptProxy 和 runJavaScript 的方向？

标准回答：JavaScriptProxy 是 H5 到 ArkTS 的入口；`runJavaScript` 是 ArkTS 到 H5 的响应出口。前者接收请求字符串，后者调用 H5 全局 response callback。

### 4. 能不能说明 requestId 为什么必要？

标准回答：跨端请求可能并发和乱序返回，不能依赖调用顺序。requestId 把 response 与 callback map 中的 Promise、timer、action 和调试记录关联起来。

### 5. 能不能说明 timeout 和 CALLBACK_LOST 的区别？

标准回答：timeout 是 H5 在等待期限到达时主动删除 callback 并 reject；CALLBACK_LOST 是 response 到达时 callback 已不存在，常见于 timeout 后的晚到响应。前者是等待超时，后者是响应无法关联。

### 6. 能不能说明 RuntimeBootstrap 和 HandlerRegistry 的区别？

标准回答：RuntimeBootstrap 负责启动时创建 Biz/Imp 和注册内置 action；HandlerRegistry 只是保存 action 到 handler 的映射并提供查询。一个负责装配，一个负责存储关系。

### 7. 能不能说明 Biz 和 Imp 为什么分层？

标准回答：Biz 管参数规则、错误码和 BridgeResponse 语义；Imp 管公开 HarmonyOS Kit 调用。这样协议变化不会污染系统实现，平台差异也不会进入 Controller。

### 8. 能不能说明 ApiManifest 和 RuntimeBootstrap 的关系？

标准回答：ApiManifest 描述“应该有哪些能力及其元数据”，RuntimeBootstrap 决定“运行时实际注册哪些 handler”。二者必须一致，但 Manifest 本身不会自动完成注册。

### 9. 能不能说明 typed API 是怎么从 Manifest 生成的？

标准回答：Node 工具读取 `tools/api-manifest.json`，生成 action union、参数/响应映射和 nested `createTypedApi`。生成 helper 最终调用 `sendTyped`，`sendTyped` 再复用原有 `send`，没有第二套协议。

### 10. 能不能说明 CI 覆盖什么、不覆盖什么？

标准回答：CI 覆盖生成物、Manifest/注册关系、H5 build/test、package exports 和 npm pack dry-run；不覆盖 HAP、ArkWeb 真机通信、系统权限、Toast UI 与设备兼容，这些属于 DevEco Studio 手工冒烟。

## 演练合格标准

- 3 分钟内画出双向调用链，并能指出 H5/ArkTS 边界。
- 任意抽一个文件，能说明输入、输出和“不应该做什么”。
- 能主动说明当前未发布 npm、HAR 仍是本地包、截图和设备回归仍有缺口。
