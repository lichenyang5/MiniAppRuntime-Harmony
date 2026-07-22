# Runtime HAR Placeholder

这篇文档解决什么问题：说明独立消费 Demo 为什么不直接提交构建产物，以及如何放入真实 HAR。

此目录不提交 `myascf_runtime.har`。先在仓库根构建 Runtime，再复制到这里：

```powershell
.\scripts\build-har.ps1
.\scripts\copy-har-to-demo.ps1
```

复制后应得到：

```text
entry/libs/myascf_runtime.har
```

Demo 的 `entry/oh-package.json5` 固定使用 `file:./libs/myascf_runtime.har`，不会跨目录引用框架源码。
