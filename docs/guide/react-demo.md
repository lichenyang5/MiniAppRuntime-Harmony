# React Demo

你将学会什么：在 React 组件中初始化 typed API、正确处理异步事件和显示响应。

```tsx
import { useState } from 'react';
import { createTypedApi, initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk';

const api = createTypedApi(initMyASCF());

export default function App() {
  const [result, setResult] = useState('Ready');

  const callToast = async (): Promise<void> => {
    try {
      const response = await api.ui.showToast({ message: 'Saved' });
      setResult(JSON.stringify(response, null, 2));
    } catch (error: unknown) {
      setResult(JSON.stringify(error, null, 2));
    }
  };

  return <><button onClick={() => void callToast()}>Toast</button><pre>{result}</pre></>;
}
```

事件中使用 `void callToast()`，Promise 内部使用 try/catch，避免未处理 rejection。完整页面见 `examples/npm-har-consumer-demo/web/src/App.tsx`。

## 下一步阅读

- [完整 React App](../examples/complete-react-app.md)
- [错误处理](error-handling.md)
