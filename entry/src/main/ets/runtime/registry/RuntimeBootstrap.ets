import {
  ACTION_SYSTEM_CLIPBOARD_READ_TEXT,
  ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT,
  ACTION_UI_SHOW_TOAST
} from '../api/ActionNames';
import { BridgeHandler, BridgeRequest, BridgeResponse } from '../api/BridgeTypes';
import { ClipboardBiz } from '../biz/ClipboardBiz';
import { ToastBiz } from '../biz/ToastBiz';
import { ClipboardImp } from '../imp/ClipboardImp';
import { ToastImp } from '../imp/ToastImp';
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

export class RuntimeBootstrap {
  static createRegistry(): HandlerRegistry {
    const registry: HandlerRegistry = new HandlerRegistry();
    registry.register(ACTION_UI_SHOW_TOAST, new ShowToastHandler());
    registry.register(ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT, new ClipboardWriteTextHandler());
    registry.register(ACTION_SYSTEM_CLIPBOARD_READ_TEXT, new ClipboardReadTextHandler());
    return registry;
  }
}
