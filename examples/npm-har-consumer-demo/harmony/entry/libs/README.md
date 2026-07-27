# Legacy Local HAR Placeholder

这篇文档解决什么问题：说明公开包消费 Demo 为什么不再需要本地 HAR，以及本地调试的边界。

独立 Demo 已从 OHPM 安装 `myascf_runtime@1.0.0`，正常运行不需要在此目录放置 HAR：

```json5
{
  "dependencies": {
    "myascf_runtime": "1.0.0"
  }
}
```

只有调试尚未发布的 Runtime 版本时才临时使用本地 HAR。不要提交 HAR、签名配置、证书或本机路径。
