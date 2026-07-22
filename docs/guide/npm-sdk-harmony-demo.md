# npm SDK 与本地 HAR 接入指南

这篇文档解决什么问题：说明新建 HarmonyOS Demo 时，如何组合 npm registry 中的 H5 SDK 与预先构建的本地 HAR，避免跨工程源码导入。

## 推荐边界

```text
Web 工程：从 npm registry 安装 @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
ArkTS 工程：从 entry/libs/myascf_runtime.har 安装 Runtime
```

独立 Demo 不注册框架仓库的源码模块，也不使用绝对路径或跨工程相对导入。

## 构建 HAR

在框架项目根目录运行：

```bash
hvigorw --mode module \
  -p product=default \
  -p module=myascf_runtime@default \
  -p buildMode=debug \
  assembleHar --no-daemon
```

构建成功后，从 `myascf_runtime/build/<target>/outputs/<target>/` 获取真实 `.har`，复制到消费工程的 `entry/libs/myascf_runtime.har`。

消费工程的 `entry/oh-package.json5`：

```json5
{
  "dependencies": {
    "myascf_runtime": "file:./libs/myascf_runtime.har"
  }
}
```

根 `build-profile.json5` 只注册消费工程自身模块。

## Web 工程

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

```ts
import {
  createTypedApi,
  initMyASCF
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);
```

Vite 使用 `base: './'`。但部分 ArkWeb 版本从 `resource://rawfile` 加载 HTML 时，会把页面视为 `origin null`，进而以 CORS 规则拒绝外链 `type="module"` 和 stylesheet。实际 HiLog 会出现 `blocked by CORS policy`，页面表现为只有空 React root 的白屏。

当前独立 Demo 在 Vite 构建后将 JavaScript 和 CSS 内联进单个 `dist/index.html`，并把内联模块脚本放在 `</body>` 前，再同步到 `entry/src/main/resources/rawfile/web`。脚本必须晚于 React root 执行，否则会出现 React `#299` 并继续白屏。这不是 Bridge 问题：最初的白屏日志中 Native Proxy 已经存在，只是 npm SDK bundle 没有执行。

## ArkWeb 注册

```ts
import { webview } from '@kit.ArkWeb';
import { MyASCFRuntime } from 'myascf_runtime';

private controller: webview.WebviewController = new webview.WebviewController();
private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));
```

```ts
.javaScriptProxy({
  object: this.runtime.getNativeProxy(),
  name: this.runtime.getProxyName(),
  methodList: this.runtime.getMethodList(),
  controller: this.controller
})
```

## 诊断顺序

页面加载后检查：

```text
typeof window.myascf
typeof window.MyASCFNative
typeof window.MyASCFNative?.postMessage
typeof window.__myascf_on_native_response__
```

ArkWeb 中预期依次为 `object`、`object`、`function`、`function`。普通浏览器没有 Native Proxy，调用返回 `NATIVE_UNAVAILABLE` 属于预期边界。

## 独立 Demo 验证记录

独立 React 工程已从 npm registry 安装 `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`，TypeScript 和 Vite 构建通过，lockfile 不含 `file/link/workspace` SDK 依赖。

独立 HarmonyOS Demo 已完成：

- `myascf_runtime.har` 构建并复制到 `entry/libs`。
- ohpm 从 HAR 安装依赖。
- 包名导入 `MyASCFRuntime` 编译通过。
- ArkTS 编译、HAP 打包和调试签名通过。
- 原跨模块源码导入、undefined module 与 OhmUrl 错误未再出现。
- 签名 HAP 已在测试机安装并正常启动。
- `window.myascf`、Native Proxy、`postMessage` 和 H5 response callback 均已就绪。
- Toast 真机调用已 resolve，页面与 Bridge timeline 正常显示结果。

当前已完成页面渲染、Bridge 全局对象和 Toast 链路的真机验证。API List、Storage、Network 仍按各自验收记录确认，不能由本次白屏修复的构建结果替代。

## HAR 更新

每次 Runtime 变化后重新执行 `assembleHar`、覆盖消费工程中的 HAR、运行 `ohpm install --all`，再 Clean/Rebuild。不要复制 Runtime 源码目录。
