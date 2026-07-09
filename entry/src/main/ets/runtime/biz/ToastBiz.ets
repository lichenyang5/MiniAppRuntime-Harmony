import { ACTION_UI_SHOW_TOAST } from '../api/ActionNames';
import { BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { ToastImp } from '../imp/ToastImp';

export class ToastBiz {
  private toastImp: ToastImp;

  constructor(toastImp: ToastImp) {
    this.toastImp = toastImp;
  }

  async handle(request: BridgeRequest): Promise<BridgeResponse> {
    const message: string | undefined = this.getValidMessage(request);

    if (message === undefined) {
      return this.createResponse(
        request.requestId,
        BridgeErrorCode.PARAM_ERROR,
        'PARAM_ERROR: message is required'
      );
    }

    await this.toastImp.showToast(message);

    return this.createResponse(
      request.requestId,
      BridgeErrorCode.SUCCESS,
      'showToast success'
    );
  }

  private getValidMessage(request: BridgeRequest): string | undefined {
    if (request.params === undefined) {
      return undefined;
    }

    const message: string | undefined = request.params.message;
    if (message === undefined || typeof message !== 'string') {
      return undefined;
    }

    const normalizedMessage: string = message.trim();
    if (normalizedMessage.length === 0) {
      return undefined;
    }

    return normalizedMessage;
  }

  private createResponse(requestId: string, code: BridgeErrorCode, message: string): BridgeResponse {
    const responseData: BridgeResponseData = {
      echoAction: ACTION_UI_SHOW_TOAST
    };

    const response: BridgeResponse = {
      requestId: requestId,
      code: code,
      message: message,
      data: responseData
    };

    return response;
  }
}
