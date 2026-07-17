import {
  ACTION_RUNTIME_GET_API_LIST,
  ACTION_SYSTEM_CLIPBOARD_READ_TEXT,
  ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT,
  ACTION_UI_SHOW_TOAST,
  ACTION_SYSTEM_STORAGE_SET_ITEM,
  ACTION_SYSTEM_STORAGE_GET_ITEM,
  ACTION_SYSTEM_STORAGE_REMOVE_ITEM,
  ACTION_SYSTEM_STORAGE_CLEAR,
  ACTION_NETWORK_REQUEST
} from '../api/ActionNames';
import { common } from '@kit.AbilityKit';
import { BridgeHandler, BridgeRequest, BridgeResponse } from '../api/BridgeTypes';
import { ClipboardBiz } from '../biz/ClipboardBiz';
import { ToastBiz } from '../biz/ToastBiz';
import { StorageBiz } from '../biz/StorageBiz';
import { RuntimeInfoBiz } from '../biz/RuntimeInfoBiz';
import { ClipboardImp } from '../imp/ClipboardImp';
import { ToastImp } from '../imp/ToastImp';
import { StorageImp } from '../imp/StorageImp';
import { NetworkBiz } from '../biz/NetworkBiz';
import { NetworkImp } from '../imp/NetworkImp';
import { NetworkPolicy } from '../types/NetworkTypes';
import { HandlerRegistry } from './HandlerRegistry';

class ShowToastHandler implements BridgeHandler {
  private toastBiz: ToastBiz = new ToastBiz(new ToastImp());

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    return await this.toastBiz.handle(request);
  }
}

class ClipboardWriteTextHandler implements BridgeHandler {
  private clipboardBiz: ClipboardBiz = new ClipboardBiz(new ClipboardImp());

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    return await this.clipboardBiz.writeText(request);
  }
}

class ClipboardReadTextHandler implements BridgeHandler {
  private clipboardBiz: ClipboardBiz = new ClipboardBiz(new ClipboardImp());

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    return await this.clipboardBiz.readText(request);
  }
}

class StorageSetItemHandler implements BridgeHandler {
  private storageBiz: StorageBiz;
  constructor(storageBiz: StorageBiz) { this.storageBiz = storageBiz; }
  async handle(request: BridgeRequest): Promise<BridgeResponse> { return await this.storageBiz.setItem(request); }
}

class StorageGetItemHandler implements BridgeHandler {
  private storageBiz: StorageBiz;
  constructor(storageBiz: StorageBiz) { this.storageBiz = storageBiz; }
  async handle(request: BridgeRequest): Promise<BridgeResponse> { return await this.storageBiz.getItem(request); }
}

class StorageRemoveItemHandler implements BridgeHandler {
  private storageBiz: StorageBiz;
  constructor(storageBiz: StorageBiz) { this.storageBiz = storageBiz; }
  async handle(request: BridgeRequest): Promise<BridgeResponse> { return await this.storageBiz.removeItem(request); }
}

class StorageClearHandler implements BridgeHandler {
  private storageBiz: StorageBiz;
  constructor(storageBiz: StorageBiz) { this.storageBiz = storageBiz; }
  async handle(request: BridgeRequest): Promise<BridgeResponse> { return await this.storageBiz.clear(request); }
}

class RuntimeGetApiListHandler implements BridgeHandler {
  private runtimeInfoBiz: RuntimeInfoBiz = new RuntimeInfoBiz();

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    return await this.runtimeInfoBiz.getApiList(request);
  }
}

class NetworkRequestHandler implements BridgeHandler {
  private networkBiz: NetworkBiz;

  constructor(networkBiz: NetworkBiz) {
    this.networkBiz = networkBiz;
  }

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    return await this.networkBiz.handle(request);
  }
}

export class RuntimeBootstrap {
  static createRegistry(context: common.Context, networkPolicy?: NetworkPolicy): HandlerRegistry {
    // Keep ActionNames, ApiManifest, runtime registration, API docs and H5 API list aligned.
    const registry: HandlerRegistry = new HandlerRegistry();
    const storageBiz: StorageBiz = new StorageBiz(new StorageImp(context));
    registry.register(ACTION_UI_SHOW_TOAST, new ShowToastHandler());
    registry.register(ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT, new ClipboardWriteTextHandler());
    registry.register(ACTION_SYSTEM_CLIPBOARD_READ_TEXT, new ClipboardReadTextHandler());
    registry.register(ACTION_SYSTEM_STORAGE_SET_ITEM, new StorageSetItemHandler(storageBiz));
    registry.register(ACTION_SYSTEM_STORAGE_GET_ITEM, new StorageGetItemHandler(storageBiz));
    registry.register(ACTION_SYSTEM_STORAGE_REMOVE_ITEM, new StorageRemoveItemHandler(storageBiz));
    registry.register(ACTION_SYSTEM_STORAGE_CLEAR, new StorageClearHandler(storageBiz));
    registry.register(ACTION_RUNTIME_GET_API_LIST, new RuntimeGetApiListHandler());
    registry.register(ACTION_NETWORK_REQUEST, new NetworkRequestHandler(new NetworkBiz(new NetworkImp(), networkPolicy)));
    return registry;
  }
}
