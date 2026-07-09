import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { RuntimeLogger } from '../logger/RuntimeLogger';
import { HandlerRegistry } from '../registry/HandlerRegistry';
import { BridgeHandler, BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';

export class BridgeDispatcher {
  private registry: HandlerRegistry;

  constructor(registry: HandlerRegistry) {
    this.registry = registry;
  }

  async dispatch(request: BridgeRequest): Promise<BridgeResponse> {
    const handler: BridgeHandler | undefined = this.registry.get(request.action);

    if (handler === undefined) {
      RuntimeLogger.warn(`[BridgeDispatcher] unknown action: ${request.action}`);
      return this.createErrorResponse(
        request.requestId,
        BridgeErrorCode.UNKNOWN_ACTION,
        `Unknown action: ${request.action}`
      );
    }

    try {
      RuntimeLogger.info(`[BridgeDispatcher] dispatch action: ${request.action}`);
      return await handler.handle(request);
    } catch (err) {
      RuntimeLogger.error(`[BridgeDispatcher] handler failed: ${JSON.stringify(err)}`);
      return this.createErrorResponse(
        request.requestId,
        BridgeErrorCode.INTERNAL_ERROR,
        'Internal error while handling bridge request.'
      );
    }
  }

  private createErrorResponse(requestId: string, code: BridgeErrorCode, message: string): BridgeResponse {
    const responseData: BridgeResponseData = {};
    const response: BridgeResponse = {
      requestId: requestId,
      code: code,
      message: message,
      data: responseData
    };
    return response;
  }
}
