import type { MyASCF, MyASCFSendOptions } from '../bridge-types.js';
import type { ApiParamsMap, TypedBridgeResponse } from './api-types.js';
export declare function createTypedApi(client: MyASCF): {
    runtime: {
        getApiList: (options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"runtime.getApiList">>;
    };
    ui: {
        showToast: (params: ApiParamsMap["ui.showToast"], options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"ui.showToast">>;
    };
    system: {
        clipboard: {
            writeText: (params: ApiParamsMap["system.clipboard.writeText"], options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"system.clipboard.writeText">>;
            readText: (options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"system.clipboard.readText">>;
        };
        storage: {
            setItem: (params: ApiParamsMap["system.storage.setItem"], options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"system.storage.setItem">>;
            getItem: (params: ApiParamsMap["system.storage.getItem"], options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"system.storage.getItem">>;
            removeItem: (params: ApiParamsMap["system.storage.removeItem"], options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"system.storage.removeItem">>;
            clear: (options?: MyASCFSendOptions) => Promise<TypedBridgeResponse<"system.storage.clear">>;
        };
    };
};
export type TypedApi = ReturnType<typeof createTypedApi>;
