# H5 SDK npm Publish Checklist

这篇文档解决什么问题：记录 H5 SDK 首次公开发布前必须逐项确认的包、身份、安全和消费验证门槛。

## Package

- [x] 包名为 `@lichenyang5/miniapp-runtime-harmony-web-sdk`。
- [x] 版本为 `0.1.0`。
- [x] registry 查询该具体名称返回 E404，尚未存在同名版本。
- [x] `private` 为 `false`。
- [x] `publishConfig.access` 为 `public`。
- [x] `main/module/browser/default` 指向无副作用 ESM。
- [x] `./iife` 指向自动挂载 `window.myascf` 的 IIFE。
- [x] 所有 exports 路径真实存在。
- [x] 未声明不存在的 CJS/require 入口。

## Build And Tarball

- [x] 根 `npm run check` 通过。
- [x] H5 SDK 24 个单元测试通过。
- [x] `npm pack --dry-run` 通过。
- [x] 真实 tgz 已生成并解包检查。
- [x] tgz 共 20 个文件，约 13.1 kB，解包约 60.4 kB。
- [x] tgz 包含 ESM、IIFE、类型、README、LICENSE、CHANGELOG。
- [x] tgz 不包含 src、tests、scripts、node_modules、token、证书或绝对路径。

## Consumer

- [x] `examples/npm-consumer-smoke` 从本地 tgz 安装。
- [x] ESM import 与 TypeScript typecheck 通过。
- [x] IIFE script 挂载验证通过。
- [x] 普通浏览器边界返回 `NATIVE_UNAVAILABLE`。
- [x] 新 HarmonyOS Demo 使用临时 tgz 构建 Web，并成功组装 HAP。
- [ ] 发布后删除临时安装，按 registry `0.1.0` 全新安装。
- [ ] 发布后确认 package.json、lockfile 均不含 file/link/workspace。
- [ ] 发布后在 ArkWeb 真机或模拟器验证 Toast、Clipboard、Storage、API List、Network 和 DebugPanel。

## Identity And Security

- [ ] 项目作者执行 `npm login`。
- [ ] `npm whoami` 返回有权发布 `@lichenyang5` scope 的账号。
- [x] registry 为 `https://registry.npmjs.org/`。
- [x] npm token 未写入仓库或 tarball。
- [ ] 已暴露的 HarmonyOS 签名凭据完成轮换/吊销，并评估 Git 历史清理。
- [ ] 最终 Git 状态、commit 和 CI 结果已确认。

## Manual Publish

只有项目作者确认以上阻塞项后才执行：

```bash
cd h5_sdk
npm login
npm whoami
npm publish --access public
```

Codex 不自动处理 OTP，不自动写 token，不在本阶段执行 publish。
