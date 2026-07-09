# 阶段 08：DebugPanel 可视化调用链路

这篇文档解决的问题：记录如何在 H5 Demo 页面内实现轻量级 JSBridge DebugPanel，让每次 action 调用都能被直观看到。

## 本步骤目标

本阶段只实现轻量 DebugPanel，不做复杂原生调试 UI。

DebugPanel 用来回答：

- H5 调用了哪个 action？
- requestId 是什么？
- params 是什么？
- 最终是 resolve、reject、timeout 还是 callback_lost？
- code / message 是什么？
- 耗时多久？

## 修改文件

```text
entry/src/main/resources/rawfile/web/js/debug-panel.js
entry/src/main/resources/rawfile/web/js/myascf.js
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/css/demo.css
entry/src/main/ets/runtime/logger/RuntimeLogger.ets
docs/stages/08-debug-panel.md
docs/debug/debug-guide.md
docs/debug/common-problems.md
docs/architecture/jsbridge-architecture.md
docs/overview/roadmap.md
```

## 为什么需要 DebugPanel

console 和 HiLog 可以排查问题，但不适合截图、博客讲解和快速演示。

DebugPanel 把调用链路中的关键信息直接展示在页面上，让 Demo 更容易说明：

```text
request-start
-> request-end
-> resolve / reject / timeout / callback_lost
```

## 记录字段

每条记录包含：

```js
{
  requestId: "string",
  action: "string",
  status: "pending | resolve | reject | timeout | callback_lost",
  code: 0,
  message: "string",
  params: {},
  response: {},
  startTime: 0,
  endTime: 0,
  duration: 0
}
```

页面最多保留最近 20 条记录。

## 与 console / RuntimeLogger 的区别

- console：适合前端临时排查。
- RuntimeLogger：适合 ArkTS / HiLog 侧排查。
- DebugPanel：适合 Demo 页面可视化展示和截图讲解。

三者互补，不互相替代。

## 记录时机

- `recordStart`：H5 生成 requestId 后。
- `recordEnd`：H5 收到 ArkTS response 后。
- `recordError`：H5 timeout 或发送失败。
- `recordLost`：H5 收到迟到 response，但 callback 已经不存在。

## 验证方式

- 正常调用：点击 `ui.showToast`，状态为 `resolve`。
- 参数错误：点击参数错误按钮，状态为 `reject`。
- 未知 action：点击未知 action，状态为 `reject`。
- timeout：点击 Timeout 测试，状态为 `timeout`。
- callback lost：timeout 后如果迟到 response 到达，会追加 `callback_lost`。

## 当前实现范围

已实现：

- 原生 HTML / CSS / JS DebugPanel。
- 最近 20 条记录。
- 展开查看 params / response。
- 清空按钮。
- 导出 JSON。
- RuntimeLogger 增加结构化 bridge 日志方法。

未实现：

- 原生 ArkUI DebugPanel。
- 复杂筛选和搜索。
- 调用链图谱。

## 下一步计划

下一步可以继续扩展 Storage API，或者将 runtime 抽取成 HAR 模块。
