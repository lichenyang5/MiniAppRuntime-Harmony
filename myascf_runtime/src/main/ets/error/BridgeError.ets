import { BridgeErrorCode } from './BridgeErrorCode';

export class BridgeError {
  code: BridgeErrorCode;
  message: string;

  constructor(code: BridgeErrorCode, message: string) {
    this.code = code;
    this.message = message;
  }
}
