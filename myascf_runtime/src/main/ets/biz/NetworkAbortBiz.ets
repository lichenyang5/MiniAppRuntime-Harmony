import { ACTION_NETWORK_ABORT } from '../api/ActionNames';
import { BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { NetworkRequestRegistry } from '../network/NetworkRequestRegistry';

export class NetworkAbortBiz {
  private registry: NetworkRequestRegistry;

  constructor(registry: NetworkRequestRegistry) {
    this.registry = registry;
  }

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    const targetRequestId: string | undefined = request.params?.targetRequestId;
    if (targetRequestId === undefined || typeof targetRequestId !== 'string' || targetRequestId.length === 0) {
      return this.createErrorResponse(request.requestId, BridgeErrorCode.PARAM_ERROR,
        'PARAM_ERROR: targetRequestId is required');
    }

    const aborted: boolean = this.registry.abort(targetRequestId);
    const data: BridgeResponseData = {
      echoAction: ACTION_NETWORK_ABORT,
      targetRequestId: targetRequestId,
      aborted: aborted,
      reason: aborted ? undefined : 'REQUEST_NOT_FOUND'
    };
    const response: BridgeResponse = {
      requestId: request.requestId,
      code: BridgeErrorCode.SUCCESS,
      message: 'success',
      data: data
    };
    return response;
  }

  private createErrorResponse(requestId: string, code: BridgeErrorCode, message: string): BridgeResponse {
    const data: BridgeResponseData = { echoAction: ACTION_NETWORK_ABORT };
    const response: BridgeResponse = { requestId: requestId, code: code, message: message, data: data };
    return response;
  }
}
