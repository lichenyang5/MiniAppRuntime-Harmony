# 普通 H5 Demo

你将学会什么：不使用框架时怎样初始化 SDK 和绑定按钮。

```html
<button id="toast">Show Toast</button>
<pre id="result"></pre>
<script type="module">
  import { createTypedApi, initMyASCF } from './index.esm.js';
  const api = createTypedApi(initMyASCF());
  const output = document.querySelector('#result');
  document.querySelector('#toast').addEventListener('click', async () => {
    try {
      output.textContent = JSON.stringify(
        await api.ui.showToast({ message: 'Hello' }), null, 2
      );
    } catch (error) {
      output.textContent = JSON.stringify(error, null, 2);
    }
  });
</script>
```

若直接使用 IIFE 产物，脚本会自动挂载 `window.myascf`，可以调用 `window.myascf.send(action, params)`。

## 下一步阅读

- [API 使用](api-usage.md)
- [NATIVE_UNAVAILABLE](../troubleshooting/native-unavailable.md)
