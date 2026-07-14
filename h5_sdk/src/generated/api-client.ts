// AUTO-GENERATED: DO NOT EDIT DIRECTLY.
// Generated from tools/api-manifest.json.

import type { MyASCF, MyASCFSendOptions } from '../bridge-types.js';
import type { ApiParamsMap, TypedBridgeResponse } from './api-types.js';

export function createTypedApi(client: MyASCF) {
  return {
    runtime: {
      getApiList: (options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"runtime.getApiList">> =>
        client.sendTyped("runtime.getApiList", undefined, options),
    },
    ui: {
      showToast: (params: ApiParamsMap["ui.showToast"], options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"ui.showToast">> =>
        client.sendTyped("ui.showToast", params, options),
    },
    system: {
      clipboard: {
        writeText: (params: ApiParamsMap["system.clipboard.writeText"], options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"system.clipboard.writeText">> =>
          client.sendTyped("system.clipboard.writeText", params, options),
        readText: (options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"system.clipboard.readText">> =>
          client.sendTyped("system.clipboard.readText", undefined, options),
      },
      storage: {
        setItem: (params: ApiParamsMap["system.storage.setItem"], options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"system.storage.setItem">> =>
          client.sendTyped("system.storage.setItem", params, options),
        getItem: (params: ApiParamsMap["system.storage.getItem"], options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"system.storage.getItem">> =>
          client.sendTyped("system.storage.getItem", params, options),
        removeItem: (params: ApiParamsMap["system.storage.removeItem"], options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"system.storage.removeItem">> =>
          client.sendTyped("system.storage.removeItem", params, options),
        clear: (options?: MyASCFSendOptions): Promise<TypedBridgeResponse<"system.storage.clear">> =>
          client.sendTyped("system.storage.clear", undefined, options),
      },
    },
  };
}

export type TypedApi = ReturnType<typeof createTypedApi>;
