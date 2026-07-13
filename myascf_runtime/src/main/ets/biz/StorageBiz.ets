import {
  ACTION_SYSTEM_STORAGE_CLEAR,
  ACTION_SYSTEM_STORAGE_GET_ITEM,
  ACTION_SYSTEM_STORAGE_REMOVE_ITEM,
  ACTION_SYSTEM_STORAGE_SET_ITEM
} from '../api/ActionNames';
import { BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { StorageImp } from '../imp/StorageImp';

export class StorageBiz {
  private storageImp: StorageImp;

  constructor(storageImp: StorageImp) {
    this.storageImp = storageImp;
  }

  async setItem(request: BridgeRequest): Promise<BridgeResponse> {
    const key: string | undefined = this.getValidKey(request);
    const value: string | undefined = request.params?.value;
    if (key === undefined || value === undefined || typeof value !== 'string') {
      return this.createResponse(request.requestId, BridgeErrorCode.PARAM_ERROR,
        'PARAM_ERROR: key and string value are required', ACTION_SYSTEM_STORAGE_SET_ITEM);
    }
    await this.storageImp.setItem(key, value);
    return this.createResponse(request.requestId, BridgeErrorCode.SUCCESS, 'set storage success',
      ACTION_SYSTEM_STORAGE_SET_ITEM, key, value);
  }

  async getItem(request: BridgeRequest): Promise<BridgeResponse> {
    const key: string | undefined = this.getValidKey(request);
    if (key === undefined) {
      return this.createResponse(request.requestId, BridgeErrorCode.PARAM_ERROR,
        'PARAM_ERROR: key is required', ACTION_SYSTEM_STORAGE_GET_ITEM);
    }
    const value: string = await this.storageImp.getItem(key);
    return this.createResponse(request.requestId, BridgeErrorCode.SUCCESS, 'get storage success',
      ACTION_SYSTEM_STORAGE_GET_ITEM, key, value);
  }

  async removeItem(request: BridgeRequest): Promise<BridgeResponse> {
    const key: string | undefined = this.getValidKey(request);
    if (key === undefined) {
      return this.createResponse(request.requestId, BridgeErrorCode.PARAM_ERROR,
        'PARAM_ERROR: key is required', ACTION_SYSTEM_STORAGE_REMOVE_ITEM);
    }
    await this.storageImp.removeItem(key);
    return this.createResponse(request.requestId, BridgeErrorCode.SUCCESS, 'remove storage success',
      ACTION_SYSTEM_STORAGE_REMOVE_ITEM, key);
  }

  async clear(request: BridgeRequest): Promise<BridgeResponse> {
    await this.storageImp.clear();
    return this.createResponse(request.requestId, BridgeErrorCode.SUCCESS, 'clear storage success',
      ACTION_SYSTEM_STORAGE_CLEAR);
  }

  private getValidKey(request: BridgeRequest): string | undefined {
    const key: string | undefined = request.params?.key;
    if (key === undefined || typeof key !== 'string' || key.trim().length === 0) {
      return undefined;
    }
    return key.trim();
  }

  private createResponse(requestId: string, code: BridgeErrorCode, message: string, echoAction: string,
    key?: string, value?: string): BridgeResponse {
    const data: BridgeResponseData = { echoAction: echoAction, key: key, value: value };
    const response: BridgeResponse = { requestId: requestId, code: code, message: message, data: data };
    return response;
  }
}
