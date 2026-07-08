import { webview } from '@kit.ArkWeb';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { RuntimeLogger } from '../logger/RuntimeLogger';
import { BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';

const H5_RESPONSE_CALLBACK = 'window.__myascf_on_native_response__';

export class BridgeController {
  private controller: webview.WebviewController;

  constructor(controller: webview.WebviewController) {
    this.controller = controller;
  }

  handleMessage(message: string): void {
    RuntimeLogger.info(`[BridgeController] raw message: ${message}`);

    try {
      const request: BridgeRequest = this.parseRequest(message);
      RuntimeLogger.info(`[BridgeController] requestId: ${request.requestId}`);
      RuntimeLogger.info(`[BridgeController] action: ${request.action}`);
      RuntimeLogger.info(`[BridgeController] params: ${this.stringifyParams(request)}`);

      const responseData: BridgeResponseData = {
        echoAction: request.action
      };
      const response: BridgeResponse = {
        requestId: request.requestId,
        code: BridgeErrorCode.SUCCESS,
        message: 'mock success from ArkTS',
        data: responseData
      };

      this.sendResponseToH5(response);
    } catch (err) {
      RuntimeLogger.error(`[BridgeController] failed to handle message: ${JSON.stringify(err)}`);
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

  private sendResponseToH5(response: BridgeResponse): void {
    const responseText = JSON.stringify(response);
    const responseArg = JSON.stringify(responseText);
    const script = `if (${H5_RESPONSE_CALLBACK}) { ${H5_RESPONSE_CALLBACK}(${responseArg}); }`;

    RuntimeLogger.info(`[BridgeController] callback script: ${script}`);

    this.controller.runJavaScript(script)
      .then(() => {
        RuntimeLogger.info(`[BridgeController] mock response sent: ${responseText}`);
      })
      .catch((err: Error) => {
        RuntimeLogger.error(`[BridgeController] failed to run JavaScript: ${JSON.stringify(err)}`);
      });
  }
}
