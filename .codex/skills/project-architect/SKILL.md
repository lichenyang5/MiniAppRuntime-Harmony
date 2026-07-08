# Project Architect Skill

你正在协助实现 ArkMiniRuntime / MyASCF。

项目定位：
基于 HarmonyOS / ArkTS / ArkWeb 实现轻量级小程序运行时框架。

核心原则：
- 不复制任何闭源 ASCF 源码
- 不使用公司内部类名、接口名、文档内容
- 只实现公开 HarmonyOS 能力下的个人开源框架
- 每一步代码实现后，必须同步补充 docs 文档

架构目标：
H5 页面
→ window.myascf.send(action, params)
→ JavaScriptProxy
→ BridgeController
→ BridgeDispatcher
→ HandlerRegistry
→ Biz
→ Imp
→ HarmonyOS System API / NAPI
→ BridgeResponse
→ runJavaScript
→ H5 Promise resolve/reject

每次任务输出：
1. 当前要改哪些文件
2. 为什么这样设计
3. 代码实现
4. 对应 docs 文档
5. README 是否需要更新