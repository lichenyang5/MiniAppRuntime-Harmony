# 从零跑通 React + ArkWeb

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

执行 `npm run build`，把 `dist` 内容同步到 `entry/src/main/resources/rawfile/web/`。

## 3. 安装 Runtime

```bash
ohpm install myascf_runtime@1.0.0
```

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

生产应用应在用户触发 Clipboard Read 时申请，并处理拒绝结果；示例为了集中演示，在 Ability 启动时申请。

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
