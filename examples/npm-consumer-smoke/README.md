# Local Tarball Consumer Smoke

这篇文档解决什么问题：在真正发布 npm 前，以独立项目安装本地 tgz，验证 scoped 包的 ESM、TypeScript 类型、IIFE 和普通浏览器边界。

```bash
cd h5_sdk
npm pack
cd ../examples/npm-consumer-smoke
npm install
npm test
```

这里只允许使用生成的 tgz。它不证明 registry 安装成功，也不会执行 `npm publish`。发布后的 registry 验证由 `examples/npm-harmony-consumer-demo/web_app` 完成。
