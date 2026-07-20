// AUTO-GENERATED: DO NOT EDIT DIRECTLY.
// Generated from tools/api-manifest.json.

import type { ApiSummary, BridgeResponse, MyASCFSendOptions } from '../bridge-types.js';

export type NetworkMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type NetworkHeaders = Record<string, string>;
export type NetworkResponseType = 'text' | 'json';
export type NetworkBody = string | Record<string, unknown> | unknown[] | null;

export type ApiAction =
  | "runtime.getApiList"
  | "ui.showToast"
  | "system.clipboard.writeText"
  | "system.clipboard.readText"
  | "system.storage.setItem"
  | "system.storage.getItem"
  | "system.storage.removeItem"
  | "system.storage.clear"
  | "network.request";

export interface ApiParamsMap {
  "runtime.getApiList": undefined;
  "ui.showToast": {
    message: string;
  };
  "system.clipboard.writeText": {
    text: string;
  };
  "system.clipboard.readText": undefined;
  "system.storage.setItem": {
    key: string;
    value: string;
  };
  "system.storage.getItem": {
    key: string;
  };
  "system.storage.removeItem": {
    key: string;
  };
  "system.storage.clear": undefined;
  "network.request": {
    url: string;
    method?: NetworkMethod;
    headers?: NetworkHeaders;
    body?: string;
    timeout?: number;
    responseType?: NetworkResponseType;
  };
}

export interface ApiResponseDataMap {
  "runtime.getApiList": {
    apis?: ApiSummary[];
  };
  "ui.showToast": {
    echoAction?: string;
  };
  "system.clipboard.writeText": {
    echoAction?: string;
  };
  "system.clipboard.readText": {
    echoAction?: string;
    text?: string;
  };
  "system.storage.setItem": {
    echoAction?: string;
    key?: string;
    value?: string;
  };
  "system.storage.getItem": {
    echoAction?: string;
    key?: string;
    value?: string;
  };
  "system.storage.removeItem": {
    echoAction?: string;
    key?: string;
  };
  "system.storage.clear": {
    echoAction?: string;
  };
  "network.request": {
    ok: boolean;
    statusCode: number;
    statusText?: string;
    headers: NetworkHeaders;
    body: NetworkBody;
    duration: number;
  };
}

export type TypedBridgeResponse<T extends ApiAction> =
  Omit<BridgeResponse, 'data'> & { data?: ApiResponseDataMap[T] };

export type TypedSendArgs<T extends ApiAction> =
  ApiParamsMap[T] extends undefined
    ? [params?: undefined, options?: MyASCFSendOptions]
    : [params: ApiParamsMap[T], options?: MyASCFSendOptions];
