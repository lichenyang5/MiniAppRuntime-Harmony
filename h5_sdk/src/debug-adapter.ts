import type { DebugPanel, DebugRecord } from './bridge-types.js';

type DebugMethod = 'recordStart' | 'recordEnd' | 'recordError' | 'recordLost' |
  'recordAbort' | 'recordLateAfterAbort';

export class DebugAdapter {
  constructor(private readonly targetWindow: Window) {}

  record(method: DebugMethod, record: DebugRecord): void {
    try {
      const panel: DebugPanel | undefined = this.targetWindow.MyASCFDebugPanel;
      const handler: ((item: DebugRecord) => void) | undefined = panel && panel[method];
      if (typeof handler === 'function') {
        handler.call(panel, sanitizeDebugRecord(record));
      }
    } catch (error) {
      console.warn('[myascf] DebugPanel failed:', error);
    }
  }
}

function stripUrlQuery(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    const parsed: URL = new URL(value);
    parsed.username = '';
    parsed.password = '';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, parsed.pathname === '/' ? '/' : '');
  } catch (error) {
    const queryIndex: number = value.indexOf('?');
    const fragmentIndex: number = value.indexOf('#');
    const indexes: number[] = [queryIndex, fragmentIndex].filter((index) => index >= 0);
    const endIndex: number = indexes.length === 0 ? value.length : Math.min(...indexes);
    return value.slice(0, endIndex);
  }
}

function sanitizeNetworkParams(params: unknown): unknown {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return params;
  }
  const source: Record<string, unknown> = params as Record<string, unknown>;
  const headers: Record<string, unknown> | undefined = source.headers &&
    typeof source.headers === 'object' && !Array.isArray(source.headers)
    ? source.headers as Record<string, unknown>
    : undefined;
  return {
    url: stripUrlQuery(source.url),
    method: source.method,
    timeout: source.timeout,
    responseType: source.responseType,
    headerNames: headers ? Object.keys(headers) : [],
    bodyLength: typeof source.body === 'string' ? source.body.length : 0
  };
}

function sanitizeNetworkResponse(response: unknown): unknown {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return {
      malformed: true,
      valueType: Array.isArray(response) ? 'array' : typeof response,
      valueLength: getSerializedLength(response)
    };
  }
  const source: Record<string, unknown> = response as Record<string, unknown>;
  const data: Record<string, unknown> | undefined = source.data &&
    typeof source.data === 'object' && !Array.isArray(source.data)
    ? source.data as Record<string, unknown>
    : undefined;
  if (!data) {
    return {
      requestId: source.requestId,
      code: source.code,
      message: source.message,
      data: {
        malformed: true,
        valueType: Array.isArray(source.data) ? 'array' : typeof source.data,
        valueLength: getSerializedLength(source.data)
      }
    };
  }
  const bodyText: string = typeof data.body === 'string'
    ? data.body
    : JSON.stringify(data.body ?? '');
  const headers: Record<string, unknown> | undefined = data.headers &&
    typeof data.headers === 'object' && !Array.isArray(data.headers)
    ? data.headers as Record<string, unknown>
    : undefined;
  return {
    ...source,
    data: {
      echoAction: data.echoAction,
      ok: data.ok,
      statusCode: data.statusCode,
      statusText: data.statusText,
      duration: data.duration,
      headerNames: headers ? Object.keys(headers) : [],
      bodyLength: bodyText.length
    }
  };
}

function getSerializedLength(value: unknown): number {
  if (typeof value === 'string') {
    return value.length;
  }
  try {
    return JSON.stringify(value ?? '').length;
  } catch (error) {
    return 0;
  }
}

function sanitizeDebugRecord(record: DebugRecord): DebugRecord {
  if (record.action !== 'network.request') {
    return record;
  }
  return {
    ...record,
    params: sanitizeNetworkParams(record.params) as DebugRecord['params'],
    response: sanitizeNetworkResponse(record.response)
  };
}
