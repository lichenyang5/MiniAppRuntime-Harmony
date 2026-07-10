import { webview } from '@kit.ArkWeb';
import { BridgeResponse } from '../api/BridgeTypes';
import { RuntimeLogger } from '../logger/RuntimeLogger';

const H5_RESPONSE_CALLBACK = 'window.__myascf_on_native_response__';

export class BridgeCallbackExecutor {
  private controller: webview.WebviewController;

  constructor(controller: webview.WebviewController) {
    this.controller = controller;
  }

  async sendResponse(response: BridgeResponse): Promise<void> {
    const responseText: string = JSON.stringify(response);
    const responseArg: string = JSON.stringify(responseText);
    const script: string = `if (${H5_RESPONSE_CALLBACK}) { ${H5_RESPONSE_CALLBACK}(${responseArg}); }`;
    const action: string = this.getAction(response);

    RuntimeLogger.info(`[BridgeCallbackExecutor] prepare H5 callback: ${responseText}`);
    RuntimeLogger.logBridgeResponse(response.requestId, action, response.code);

    try {
      await this.controller.runJavaScript(script);
      RuntimeLogger.info(`[BridgeCallbackExecutor] runJavaScript success: ${response.requestId}`);
    } catch (err) {
      RuntimeLogger.error(`[BridgeCallbackExecutor] CALLBACK_LOST risk, runJavaScript failed: ${JSON.stringify(err)}`);
      RuntimeLogger.logBridgeError(response.requestId, action, response.code, 'CALLBACK_LOST risk');
    }
  }

  private getAction(response: BridgeResponse): string {
    if (response.data === undefined || response.data.echoAction === undefined) {
      return '';
    }
    return response.data.echoAction;
  }
}
