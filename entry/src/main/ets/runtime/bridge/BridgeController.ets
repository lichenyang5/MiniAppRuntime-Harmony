import { webview } from '@kit.ArkWeb';
import { BridgeCallbackExecutor } from './BridgeCallbackExecutor';
import { BridgeDispatcher } from '../dispatcher/BridgeDispatcher';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { RuntimeLogger } from '../logger/RuntimeLogger';
import { RuntimeBootstrap } from '../registry/RuntimeBootstrap';
import { BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';

export class BridgeController {
  private dispatcher: BridgeDispatcher = new BridgeDispatcher(RuntimeBootstrap.createRegistry());
  private callbackExecutor: BridgeCallbackExecutor;

  constructor(controller: webview.WebviewController) {
    this.callbackExecutor = new BridgeCallbackExecutor(controller);
  }

  handleMessage(message: string): void {
    RuntimeLogger.info(`[BridgeController] raw message: ${message}`);

    try {
      const request: BridgeRequest = this.parseRequest(message);
      RuntimeLogger.info(`[BridgeController] requestId: ${request.requestId}`);
      RuntimeLogger.info(`[BridgeController] action: ${request.action}`);
      RuntimeLogger.info(`[BridgeController] params: ${this.stringifyParams(request)}`);

      this.dispatcher.dispatch(request)
        .then((response: BridgeResponse) => {
          this.callbackExecutor.sendResponse(response);
        })
        .catch((err: Error) => {
          RuntimeLogger.error(`[BridgeController] dispatcher failed: ${JSON.stringify(err)}`);
          const response: BridgeResponse = this.createErrorResponse(
            request.requestId,
            BridgeErrorCode.INTERNAL_ERROR,
            'Internal error while dispatching bridge request.'
          );
          this.callbackExecutor.sendResponse(response);
        });
    } catch (err) {
      RuntimeLogger.error(`[BridgeController] failed to handle message: ${JSON.stringify(err)}`);
      const response: BridgeResponse = this.createErrorResponse(
        this.extractRequestId(message),
        BridgeErrorCode.PARSE_ERROR,
        'PARSE_ERROR: invalid bridge request'
      );
      this.callbackExecutor.sendResponse(response);
    }
  }

  private parseRequest(message: string): BridgeRequest {
    const request = JSON.parse(message) as BridgeRequest;
    if (!request.requestId || !request.action) {
      throw new Error('Invalid bridge request: requestId and action are required.');
    }
    return request;
  }

  private stringifyParams(request: BridgeRequest): string {
    if (request.params === undefined) {
      return '';
    }
    return JSON.stringify(request.params);
  }

  private extractRequestId(message: string): string {
    try {
      const request = JSON.parse(message) as BridgeRequest;
      if (request.requestId) {
        return request.requestId;
      }
    } catch (err) {
      RuntimeLogger.warn(`[BridgeController] requestId extraction failed: ${JSON.stringify(err)}`);
    }
    return '';
  }

  private createErrorResponse(requestId: string, code: BridgeErrorCode, message: string): BridgeResponse {
    const responseData: BridgeResponseData = {
      echoAction: undefined
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
