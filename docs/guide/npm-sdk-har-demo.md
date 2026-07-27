# npm SDK + OHPM Runtime Demo

## 你将学会什么

复现 React H5、npm SDK、OHPM Runtime 与 ArkWeb 的独立消费链路。

## 目录

```text
examples/npm-har-consumer-demo/
  web/       React + Vite，SDK 来自 npm
  harmony/   Stage Model，Runtime 来自 OHPM
```

## 构建

```bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
```

`build:harmony` 执行 TypeScript/Vite 构建，再把 JS/CSS 内联到单个页面并同步到 rawfile，避免 `resource://rawfile` 场景的外链模块限制。

在 HarmonyOS Demo 中执行 OHPM Sync、Clean、Rebuild、Run，依次验证 Toast、API List、Clipboard、Storage 全操作、Network GET/POST/非 2xx 与取消。

## HTTP 语义

Bridge 成功不等于 HTTP 2xx。有效 404/500 仍 resolve，`data.ok=false`；DNS、连接失败、非法 URL 和网络 timeout reject。

## 下一步

- [Demo README](../../examples/npm-har-consumer-demo/README.md)
- [完整 React 示例](../examples/complete-react-app.md)
- [Network 排错](../troubleshooting/network-request.md)
