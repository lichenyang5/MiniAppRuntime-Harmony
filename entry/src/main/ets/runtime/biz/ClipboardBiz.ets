import {
  ACTION_SYSTEM_CLIPBOARD_READ_TEXT,
  ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT
} from '../api/ActionNames';
import { BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { BridgeErrorCode } from '../error/BridgeErrorCode';
import { ClipboardImp } from '../imp/ClipboardImp';

export class ClipboardBiz {
  private clipboardImp: ClipboardImp;

  constructor(clipboardImp: ClipboardImp) {
    this.clipboardImp = clipboardImp;
  }

  async writeText(request: BridgeRequest): Promise<BridgeResponse> {
    const text: string | undefined = this.getValidText(request);

    if (text === undefined) {
      return this.createResponse(
        request.requestId,
        BridgeErrorCode.PARAM_ERROR,
        'PARAM_ERROR: text is required',
        ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT
      );
    }

    await this.clipboardImp.writeText(text);

    return this.createResponse(
      request.requestId,
      BridgeErrorCode.SUCCESS,
      'write clipboard success',
      ACTION_SYSTEM_CLIPBOARD_WRITE_TEXT
    );
  }

  async readText(request: BridgeRequest): Promise<BridgeResponse> {
    const text: string = await this.clipboardImp.readText();

    return this.createResponse(
      request.requestId,
      BridgeErrorCode.SUCCESS,
      'read clipboard success',
      ACTION_SYSTEM_CLIPBOARD_READ_TEXT,
      text
    );
  }

  private getValidText(request: BridgeRequest): string | undefined {
    if (request.params === undefined) {
      return undefined;
    }

    const text: string | undefined = request.params.text;
    if (text === undefined || typeof text !== 'string') {
      return undefined;
    }

    const normalizedText: string = text.trim();
    if (normalizedText.length === 0) {
      return undefined;
    }

    return normalizedText;
  }

  private createResponse(
    requestId: string,
    code: BridgeErrorCode,
    message: string,
    echoAction: string,
    text?: string
  ): BridgeResponse {
    const responseData: BridgeResponseData = {
      echoAction: echoAction,
      text: text
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
