# 新建 Demo 接入本地 HAR

这篇文档解决什么问题：从空 HarmonyOS Stage Model Demo 开始，完成本地 HAR 依赖、ArkWeb 页面、JavaScriptProxy 注入和 H5 API 调用。

## 1. 准备模块

创建 Stage Model 工程，将 `myascf_runtime` 放在工程根目录，与 `entry` 同级。保留模块的 `oh-package.json5`、根 `Index.ets`、构建配置和 `src/main`。

## 2. 配置依赖

在 `entry/oh-package.json5` 添加：

```json5
{
  "dependencies": {
    "myascf_runtime": "file:../myascf_runtime"
  }
}
```

在根 `build-profile.json5` 的 `modules` 添加：

```json5
{
  "name": "myascf_runtime",
  "srcPath": "./myascf_runtime"
}
```

## 3. 准备 H5

在 `entry/src/main/resources/rawfile/web/` 放置 `index.html` 与 H5 SDK。当前推荐把 `h5_sdk/dist/myascf.js` 复制到 `rawfile/web/js/myascf.js`，不要在 Demo 中重新维护一份 Bridge 实现。

```html
<script src="./js/myascf.js"></script>
```

## 4. 接入页面

```ts
import { webview } from '@kit.ArkWeb';
import { MyASCFRuntime } from 'myascf_runtime';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));

  build() {
    Column() {
      Web({ src: $rawfile('web/index.html'), controller: this.controller })
        .javaScriptProxy({
          object: this.runtime.getNativeProxy(),
          name: this.runtime.getProxyName(),
          methodList: this.runtime.getMethodList(),
          controller: this.controller
        })
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
```

当前构造方式是两个参数，不是 options 对象。Context 用于 HAR 内部 Storage Preferences，外部不需要创建 StorageBiz 或 StorageImp。

## 5. H5 调用

```js
await window.myascf.send('ui.showToast', { message: 'hello from h5' });

await window.myascf.send('system.clipboard.writeText', {
  text: 'hello clipboard'
});

await window.myascf.send('system.storage.setItem', {
  key: 'username',
  value: 'lichenyang'
});

const storageRes = await window.myascf.send('system.storage.getItem', {
  key: 'username'
});
```

## 6. 同步和构建

先执行 `npm --prefix h5_sdk install` 与 `npm run h5:sync` 生成并同步 H5 SDK。然后执行 HarmonyOS 依赖同步、Sync Project、Clean Project 和 Rebuild Project。运行后先验证本地 H5，再验证 Toast、Clipboard 和 Storage。

HAR 当前是本地源码模块，不需要从 npm 或 HarmonyOS 包仓库下载。

## 7. 排查顺序

1. import 无法解析：检查 HAR name、file dependency 和根 modules。
2. H5 没有 Native 对象：检查 `.javaScriptProxy` 的 object、name、methodList 和 controller。
3. Promise 不返回：检查 requestId、ArkTS 日志和 `runJavaScript` callback。
4. Storage 失败：确认传入 Context，并查看 Preferences 异常日志。
5. Clipboard 读取失败：确认当前 SDK 和设备权限要求。

更多问题见 [常见问题](../debug/common-problems.md)。
