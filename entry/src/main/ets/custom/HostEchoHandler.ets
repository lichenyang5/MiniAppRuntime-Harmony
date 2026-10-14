import { BridgeHandler, BridgeRequest, BridgeResponse, BridgeErrorCode } from 'myascf_runtime';

export class HostEchoHandler implements BridgeHandler {
  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    const text: string | undefined = request.params?.text;
    if (typeof text !== 'string' || text.length > 120) {
      return { requestId: request.requestId, code: BridgeErrorCode.PARAM_ERROR,
        message: 'text must be a string up to 120 characters' };
    }
    return { requestId: request.requestId, code: BridgeErrorCode.SUCCESS,
      message: 'host echo success', data: { text: text } };
  }
}
