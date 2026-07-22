import {
  createTypedApi,
  initMyASCF,
  type DebugRecord
} from '@lichenyang5/miniapp-runtime-harmony-web-sdk';
import './style.css';

const debugRecords: DebugRecord[] = [];
const debugContainer: HTMLElement | null = document.querySelector('#debug-records');
const debugCount: HTMLElement | null = document.querySelector('#debug-count');
const statusElement: HTMLElement | null = document.querySelector('#status');
const resultElement: HTMLElement | null = document.querySelector('#result');
const environmentElement: HTMLElement | null = document.querySelector('#environment');

function renderDebug(record: DebugRecord): void {
  const index: number = debugRecords.findIndex((item) => item.requestId === record.requestId);
  if (index >= 0) {
    debugRecords[index] = record;
  } else {
    debugRecords.unshift(record);
  }
  debugRecords.splice(30);
  if (debugCount) {
    debugCount.textContent = `${debugRecords.length} records`;
  }
  if (debugContainer) {
    const elements: HTMLElement[] = debugRecords.map((item) => {
      const article: HTMLElement = document.createElement('article');
      const status: HTMLElement = document.createElement('strong');
      const action: HTMLElement = document.createElement('span');
      const requestId: HTMLElement = document.createElement('code');
      status.textContent = item.status;
      action.textContent = item.action;
      requestId.textContent = item.requestId;
      article.append(status, action, requestId);
      return article;
    });
    debugContainer.replaceChildren(...elements);
  }
}

window.MyASCFDebugPanel = {
  recordStart: renderDebug,
  recordEnd: renderDebug,
  recordError: renderDebug,
  recordLost: renderDebug,
  recordAbort: renderDebug,
  recordLateAfterAbort: renderDebug
};

const client = initMyASCF();
const api = createTypedApi(client);

if (environmentElement) {
  environmentElement.textContent = window.MyASCFNative
    ? 'ArkWeb native proxy detected'
    : 'Normal browser mode: calls should reject NATIVE_UNAVAILABLE';
}

async function run(label: string, task: () => Promise<unknown>): Promise<void> {
  if (statusElement) {
    statusElement.textContent = `${label}: pending`;
  }
  try {
    const response: unknown = await task();
    if (statusElement) {
      statusElement.textContent = `${label}: resolved`;
    }
    if (resultElement) {
      resultElement.textContent = JSON.stringify(response, null, 2);
    }
  } catch (error: unknown) {
    if (statusElement) {
      statusElement.textContent = `${label}: rejected`;
    }
    if (resultElement) {
      resultElement.textContent = JSON.stringify(error, null, 2);
    }
  }
}

document.querySelector('#toast')?.addEventListener('click', () => {
  void run('ui.showToast', () => api.ui.showToast({ message: 'Hello from npm SDK' }));
});

document.querySelector('#clipboard')?.addEventListener('click', () => {
  void run('system.clipboard.readText', () => api.system.clipboard.readText());
});

document.querySelector('#storage')?.addEventListener('click', () => {
  void run('system.storage', async () => {
    await api.system.storage.setItem({ key: 'sdk-source', value: 'npm-0.1.0' });
    return api.system.storage.getItem({ key: 'sdk-source' });
  });
});

document.querySelector('#api-list')?.addEventListener('click', () => {
  void run('runtime.getApiList', () => api.runtime.getApiList());
});

document.querySelector('#network')?.addEventListener('click', () => {
  void run('network.request', () => api.network.request({
    url: 'https://example.com',
    method: 'GET',
    responseType: 'text',
    timeout: 10000
  }, { timeout: 12000 }));
});
