import {
  ACTION_RUNTIME_GET_API_LIST,
  ACTION_SYSTEM_CLIPBOARD_READ_TEXT,
  ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT,
  ACTION_SYSTEM_STORAGE_CLEAR,
  ACTION_SYSTEM_STORAGE_GET_ITEM,
  ACTION_SYSTEM_STORAGE_REMOVE_ITEM,
  ACTION_SYSTEM_STORAGE_SET_ITEM,
  ACTION_UI_SHOW_TOAST
} from './ActionNames';

export enum ApiCategory {
  UI = 'ui',
  SYSTEM = 'system',
  RUNTIME = 'runtime',
  CONTAINER = 'container'
}

export interface ApiParamMeta {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiResponseMeta {
  name: string;
  type: string;
  description: string;
}

export interface ApiManifestItem {
  action: string;
  category: ApiCategory;
  title: string;
  description: string;
  params: ApiParamMeta[];
  response: ApiResponseMeta[];
  errors: string[];
  implemented: boolean;
  biz: string;
  imp: string;
  example: string;
}

export const BUILTIN_API_MANIFEST: ApiManifestItem[] = [
  {
    action: ACTION_RUNTIME_GET_API_LIST,
    category: ApiCategory.RUNTIME,
    title: '获取 API 列表',
    description: '返回当前 runtime 内置 API Manifest 的精简信息。',
    params: [],
    response: [
      { name: 'apis', type: 'ApiSummary[]', description: '当前 runtime 支持的 API 简要列表。' }
    ],
    errors: ['INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'RuntimeInfoBiz',
    imp: '-',
    example: 'window.myascf.send("runtime.getApiList", {})'
  },
  {
    action: ACTION_UI_SHOW_TOAST,
    category: ApiCategory.UI,
    title: '显示 Toast',
    description: '从 H5 侧触发 HarmonyOS Toast 提示。',
    params: [
      { name: 'message', type: 'string', required: true, description: 'Toast 展示的文本内容。' }
    ],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' }
    ],
    errors: ['PARAM_ERROR', 'INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'ToastBiz',
    imp: 'ToastImp',
    example: 'window.myascf.send("ui.showToast", { message: "hello" })'
  },
  {
    action: ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT,
    category: ApiCategory.SYSTEM,
    title: '写入剪贴板',
    description: '向 HarmonyOS 系统剪贴板写入纯文本。',
    params: [
      { name: 'text', type: 'string', required: true, description: '写入剪贴板的文本。' }
    ],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' }
    ],
    errors: ['PARAM_ERROR', 'INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'ClipboardBiz',
    imp: 'ClipboardImp',
    example: 'window.myascf.send("system.clipboard.writeText", { text: "hello" })'
  },
  {
    action: ACTION_SYSTEM_CLIPBOARD_READ_TEXT,
    category: ApiCategory.SYSTEM,
    title: '读取剪贴板',
    description: '读取 HarmonyOS 系统剪贴板中的纯文本。',
    params: [],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' },
      { name: 'text', type: 'string', description: '读取到的剪贴板文本。' }
    ],
    errors: ['INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'ClipboardBiz',
    imp: 'ClipboardImp',
    example: 'window.myascf.send("system.clipboard.readText", {})'
  },
  {
    action: ACTION_SYSTEM_STORAGE_SET_ITEM,
    category: ApiCategory.SYSTEM,
    title: '写入本地存储',
    description: '向 Preferences 写入字符串键值。',
    params: [
      { name: 'key', type: 'string', required: true, description: '非空存储键。' },
      { name: 'value', type: 'string', required: true, description: '要保存的字符串值。' }
    ],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' },
      { name: 'key', type: 'string', description: '已写入的 key。' },
      { name: 'value', type: 'string', description: '已写入的 value。' }
    ],
    errors: ['PARAM_ERROR', 'INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'StorageBiz',
    imp: 'StorageImp',
    example: 'window.myascf.send("system.storage.setItem", { key: "username", value: "lichenyang" })'
  },
  {
    action: ACTION_SYSTEM_STORAGE_GET_ITEM,
    category: ApiCategory.SYSTEM,
    title: '读取本地存储',
    description: '从 Preferences 读取字符串键值，不存在时返回空字符串。',
    params: [
      { name: 'key', type: 'string', required: true, description: '非空存储键。' }
    ],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' },
      { name: 'key', type: 'string', description: '查询的 key。' },
      { name: 'value', type: 'string', description: '读取结果。' }
    ],
    errors: ['PARAM_ERROR', 'INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'StorageBiz',
    imp: 'StorageImp',
    example: 'window.myascf.send("system.storage.getItem", { key: "username" })'
  },
  {
    action: ACTION_SYSTEM_STORAGE_REMOVE_ITEM,
    category: ApiCategory.SYSTEM,
    title: '删除本地存储',
    description: '幂等删除 Preferences 中的指定 key。',
    params: [
      { name: 'key', type: 'string', required: true, description: '非空存储键。' }
    ],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' },
      { name: 'key', type: 'string', description: '已删除的 key。' }
    ],
    errors: ['PARAM_ERROR', 'INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'StorageBiz',
    imp: 'StorageImp',
    example: 'window.myascf.send("system.storage.removeItem", { key: "username" })'
  },
  {
    action: ACTION_SYSTEM_STORAGE_CLEAR,
    category: ApiCategory.SYSTEM,
    title: '清空本地存储',
    description: '清空框架使用的 Preferences 存储。',
    params: [],
    response: [
      { name: 'echoAction', type: 'string', description: '回显当前 action。' }
    ],
    errors: ['INTERNAL_ERROR', 'TIMEOUT', 'CALLBACK_LOST'],
    implemented: true,
    biz: 'StorageBiz',
    imp: 'StorageImp',
    example: 'window.myascf.send("system.storage.clear", {})'
  }
];
