# API Manifest 设计

这篇文档解决的问题：解释为什么运行时注册之外还需要能力元信息，以及 Manifest 如何帮助源码、文档和 DebugPanel 保持一致。

## 为什么需要 Manifest

API 信息原本分散在 ActionNames、RuntimeBootstrap、Biz/Imp、H5 按钮、README 和 API 文档。新增能力时容易出现代码已注册但文档遗漏，或展示列表与真实参数不一致。ApiManifest 为每个已实现 action 提供结构化说明。

## Manifest 描述什么

每项包含 action、category、title、description、params、response、errors、implemented、biz、imp 和 example。它不执行 API，不解析请求，也不调用 ArkWeb、Preferences 或 runJavaScript。

## 各模块区别

```text
ActionNames       稳定 action 常量
ApiManifest       action 元信息与能力清单
RuntimeBootstrap  action 到 handler 的运行时注册
Biz / Imp         参数语义与平台能力实现
```

Manifest 和 RuntimeBootstrap 仍保持职责分离。`runtime.getApiList` 只读取元信息，不根据 Manifest 自动创建 handler。

## 如何服务展示与维护

- README 根据 Manifest 维度维护当前 API 表格。
- `docs/api/index.md` 提供可点击的能力总览。
- RuntimeInfoBiz 把 Manifest 转换为精简 ApiSummary，DebugPanel 动态展示。
- 新增 API 指南要求所有位置同步更新。

## 后续演进

当前已经提供 `runtime.getApiList` 用于运行时动态展示。下一步可以编写只读生成脚本，从 Manifest 生成 Markdown 表格和类型声明，并为 ApiSummary 增加版本字段。
