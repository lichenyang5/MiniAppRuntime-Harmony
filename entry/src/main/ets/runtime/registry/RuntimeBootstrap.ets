import { ACTION_UI_SHOW_TOAST } from '../api/ActionNames';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { BridgeHandler, BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { HandlerRegistry } from './HandlerRegistry';

class ShowToastMockHandler implements BridgeHandler {
  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    const responseData: BridgeResponseData = {
      echoAction: ACTION_UI_SHOW_TOAST
    };

    const response: BridgeResponse = {
      requestId: request.requestId,
      code: BridgeErrorCode.SUCCESS,
      message: 'mock handler success from BridgeDispatcher',
      data: responseData
    };

    return response;
  }
}

export class RuntimeBootstrap {
  static createRegistry(): HandlerRegistry {
    const registry: HandlerRegistry = new HandlerRegistry();
    registry.register(ACTION_UI_SHOW_TOAST, new ShowToastMockHandler());
    return registry;
  }
}
