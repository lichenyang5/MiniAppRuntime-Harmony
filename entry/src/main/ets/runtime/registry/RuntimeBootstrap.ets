import { ACTION_UI_SHOW_TOAST } from '../api/ActionNames';
import { BridgeHandler, BridgeRequest, BridgeResponse } from '../api/BridgeTypes';
import { ToastBiz } from '../biz/ToastBiz';
import { ToastImp } from '../imp/ToastImp';
import { HandlerRegistry } from './HandlerRegistry';

class ShowToastHandler implements BridgeHandler {
  private toastBiz: ToastBiz = new ToastBiz(new ToastImp());

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    return await this.toastBiz.handle(request);
  }
}

export class RuntimeBootstrap {
  static createRegistry(): HandlerRegistry {
    const registry: HandlerRegistry = new HandlerRegistry();
    registry.register(ACTION_UI_SHOW_TOAST, new ShowToastHandler());
    return registry;
  }
}
