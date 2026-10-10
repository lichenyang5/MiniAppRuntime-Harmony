# 从零跑通 React + ArkWeb

建议先完成[纯 HTML 最小接入](quick-start.md)。当前 Runtime 发布包最低兼容 API 为 23，启动 Ability 必须加载 `pages/Index`。

你将学会什么：创建 React H5、安装两个公开包、把页面放进 rawfile，并完成 ArkWeb JavaScriptProxy 接入。

## 1. 环境

准备 Node.js、npm、DevEco Studio、OHPM，以及 HarmonyOS 模拟器或设备。本文使用 Stage Model 工程。

## 2. 创建 React 页面

```bash
npm create vite@latest web-demo -- --template react-ts
cd web-demo
npm install
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

`vite.config.ts` 必须使用相对 base。ArkWeb 从 rawfile 加载本地 HTML 时，绝对 `/assets/...` 不会指向 H5 构建目录。

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()], base: './' });
```

`src/App.tsx`：

```tsx
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const api = createTypedApi(initMyASCF());

export default function App() {
  const showToast = async (): Promise<void> => {
    try {
      const response = await api.ui.showToast({ message: 'Hello HarmonyOS' });
      console.log(response.requestId, response.code, response.message);
    } catch (error: unknown) {
      console.error(error);
    }
  };
  return <button onClick={() => void showToast()}>Show Toast</button>;
}
```

ArkWeb rawfile 的 origin 可能导致外链 ES module/CSS 被 CORS 拦截；`base: './'` 只解决路径问题。首次接入请使用[完整 React 示例](../examples/complete-react-app.md)的 `inline-dist.mjs` 与 `sync-harmony.mjs`：复制两份脚本并添加示例中的 package scripts，将同步目的地改为自己的 HarmonyOS 工程 `entry/src/main/resources/rawfile/web`，再执行 `npm run build:harmony`。原示例的目的地是相邻的 `harmony` 目录。不要只复制普通 Vite dist 后就假定真机能加载。

## 3. 安装 Runtime

另开终端进入 **HarmonyOS 消费工程的 entry 模块目录**，不要在上一步的 `web-demo` 目录运行 OHPM：

```powershell
Set-Location 'C:\你的目录\MyApplication\entry'
```

```bash
ohpm install myascf_runtime@1.0.0
```

以下字段位于消费工程 `entry/oh-package.json5`：

```json5
{
  "dependencies": {
    "myascf_runtime": "1.0.0"
  }
}
```

## 4. 声明权限

```json5
"requestPermissions": [
  { "name": "ohos.permission.INTERNET" },
  {
    "name": "ohos.permission.READ_PASTEBOARD",
    "reason": "$string:pasteboard_reason",
    "usedScene": { "abilities": ["EntryAbility"], "when": "inuse" }
  }
]
```

`INTERNET` 用于 `network.request`；读取剪贴板需要 `READ_PASTEBOARD` 与运行时授权。写剪贴板、Toast 和字符串 Preferences 不要求这里新增权限。

还需在 `entry/src/main/resources/base/element/string.json` 中声明 `pasteboard_reason`，并在实际启动生命周期或用户触发读取时调用授权方法。下面只展示方法定义；仅复制定义不会发起授权。

在 `EntryAbility` 中按需请求剪贴板读取授权：

```ets
import { abilityAccessCtrl, Permissions, UIAbility } from '@kit.AbilityKit';

const READ_PASTEBOARD_PERMISSION: Permissions = 'ohos.permission.READ_PASTEBOARD';

export default class EntryAbility extends UIAbility {
  private requestClipboardPermission(): void {
    abilityAccessCtrl.createAtManager()
      .requestPermissionsFromUser(this.context, [READ_PASTEBOARD_PERMISSION])
      .catch((error: Error) => console.error(error.message));
  }
}
```

需要读取剪贴板时，在用户触发读取时调用此方法，并处理拒绝结果。完整权限资源和运行时授权见[Clipboard API](../api/clipboard.md)；本段方法定义没有执行授权。

## 5. 注册 JavaScriptProxy

```ets
import { webview } from '@kit.ArkWeb';
import { MyASCFRuntime } from 'myascf_runtime';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));

  build() {
    Web({ src: $rawfile('web/index.html'), controller: this.controller })
      .javaScriptAccess(true)
      .javaScriptProxy({
        object: this.runtime.getNativeProxy(),
        name: this.runtime.getProxyName(),
        methodList: this.runtime.getMethodList(),
        controller: this.controller
      })
      .width('100%')
      .height('100%');
  }
}
```

在 DevEco Studio 执行 Sync and Refresh Project、Clean Project、Rebuild Project、Run。依次验证 Toast、API List、Storage、Clipboard 和 Network。

普通浏览器没有 ArkWeb 注入的 `window.MyASCFNative`，调用会 reject `NATIVE_UNAVAILABLE`。这是环境检测结果，不是 HTTP 或 Runtime API 失败。

## 下一步阅读

- [完整 React 示例](../examples/complete-react-app.md)
- [ArkWeb 接入细节](../guide/arkweb-integration.md)
- [常见白屏问题](../troubleshooting/arkweb-white-screen.md)
