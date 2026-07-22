import { useMemo, useState } from 'react';
import {
  createTypedApi,
  initMyASCF,
  type DebugRecord
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

interface ResultSummary {
  action: string;
  bridge: 'RESOLVED' | 'REJECTED';
  requestId: string;
  code: string;
  message: string;
  duration: string;
  httpStatus: string;
  httpOk: string;
  errorKind: string;
}

function serialize(value: unknown): string {
  if (value instanceof Error) {
    return JSON.stringify({ name: value.name, message: value.message }, null, 2);
  }
  return JSON.stringify(value, null, 2) ?? String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readEnvironment(): Record<string, string> {
  return {
    myascfType: typeof window.myascf,
    nativeType: typeof window.MyASCFNative,
    postMessageType: typeof window.MyASCFNative?.postMessage,
    callbackType: typeof window.__myascf_on_native_response__
  };
}

function summarize(action: string, bridge: 'RESOLVED' | 'REJECTED', value: unknown): ResultSummary {
  const response: Record<string, unknown> = isRecord(value) ? value : {};
  const data: Record<string, unknown> = isRecord(response.data) ? response.data : {};
  const message: string = typeof response.message === 'string' ? response.message : '';
  const code: string = response.code === undefined ? '-' : String(response.code);
  const knownErrors: string[] = [
    'NATIVE_UNAVAILABLE',
    'TIMEOUT',
    'CALLBACK_LOST',
    'INVALID_RESPONSE',
    'UNKNOWN_ACTION',
    'PARAM_ERROR',
    'NETWORK_TIMEOUT',
    'NETWORK_REQUEST_FAILED'
  ];
  const errorKind: string = bridge === 'RESOLVED'
    ? '-'
    : knownErrors.find((name: string) => message.includes(name)) ?? 'BUSINESS_OR_BRIDGE_ERROR';

  return {
    action,
    bridge,
    requestId: typeof response.requestId === 'string' ? response.requestId : '-',
    code,
    message: message || '-',
    duration: response.duration === undefined ? '-' : `${String(response.duration)} ms`,
    httpStatus: data.statusCode === undefined ? '-' : String(data.statusCode),
    httpOk: data.ok === undefined ? '-' : String(data.ok),
    errorKind
  };
}

export function App() {
  const [status, setStatus] = useState('Ready');
  const [result, setResult] = useState('No request yet.');
  const [summary, setSummary] = useState<ResultSummary | null>(null);
  const [records, setRecords] = useState<DebugRecord[]>([]);
  const environment = useMemo(readEnvironment, []);

  const recordDebug = (record: DebugRecord): void => {
    setRecords((current) => {
      const next = current.filter((item) => item.requestId !== record.requestId);
      return [record, ...next].slice(0, 30);
    });
  };

  window.MyASCFDebugPanel = {
    recordStart: recordDebug,
    recordEnd: recordDebug,
    recordError: recordDebug,
    recordLost: recordDebug,
    recordAbort: recordDebug,
    recordLateAfterAbort: recordDebug
  };

  const run = async (label: string, task: () => Promise<unknown>): Promise<void> => {
    setStatus(`${label}: pending`);
    try {
      const response: unknown = await task();
      setStatus(`${label}: resolved`);
      setResult(serialize(response));
      setSummary(summarize(label, 'RESOLVED', response));
    } catch (error: unknown) {
      setStatus(`${label}: rejected`);
      setResult(serialize(error));
      setSummary(summarize(label, 'REJECTED', error));
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">HarmonyOS ArkWeb Integration</p>
        <h1>npm SDK + local HAR</h1>
        <dl className="environment">
          {Object.entries(environment).map(([key, value]) => (
            <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </header>

      <section className="actions" aria-label="Runtime API actions">
        <button type="button" onClick={() => void run('ui.showToast', () => api.ui.showToast({ message: 'Hello from npm SDK + local HAR' }))}>Show Toast</button>
        <button type="button" onClick={() => void run('runtime.getApiList', () => api.runtime.getApiList())}>Runtime API List</button>
        <button type="button" onClick={() => void run('system.storage.setItem', () => api.system.storage.setItem({ key: 'full-chain-demo', value: 'stored-by-har' }))}>Storage Set</button>
        <button type="button" onClick={() => void run('system.storage.getItem', () => api.system.storage.getItem({ key: 'full-chain-demo' }))}>Storage Get</button>
        <button type="button" onClick={() => void run('system.clipboard.writeText', () => api.system.clipboard.writeText({ text: 'Hello from npm SDK + local HAR' }))}>Clipboard Write</button>
        <button type="button" onClick={() => void run('system.clipboard.readText', () => api.system.clipboard.readText())}>Clipboard Read</button>
        <button type="button" onClick={() => void run('network.request', () => api.network.request({ url: 'https://example.com', method: 'GET', responseType: 'text', timeout: 10000 }, { timeout: 12000 }))}>Network GET</button>
        <button type="button" onClick={() => void run('network.request (non-2xx)', () => api.network.request({ url: 'https://example.com/not-found', method: 'GET', responseType: 'text', timeout: 10000 }, { timeout: 12000 }))}>Network non-2xx</button>
      </section>

      <section className="result-panel" aria-live="polite">
        <div className="section-heading"><h2>Latest result</h2><strong>{status}</strong></div>
        {summary && (
          <dl className="result-summary">
            {Object.entries(summary).map(([key, value]) => (
              <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        )}
        <pre>{result}</pre>
        <p className="http-note">Bridge 成功不等于 HTTP 2xx。HTTP 404/500 会 resolve，并通过 data.ok=false 交给 H5 判断。</p>
      </section>

      <section className="debug-panel">
        <div className="section-heading"><h2>Bridge timeline</h2><span>{records.length} records</span></div>
        <div className="debug-records">
          {records.map((record) => (
            <article key={record.requestId}>
              <strong>{record.status}</strong>
              <span>{record.action}</span>
              <code>{record.requestId}</code>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
