import type { BridgeRequest } from './bridge-types.js';
import { ERROR_CODE_NATIVE_UNAVAILABLE } from './error-code.js';

export class NativeBridgeError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'NativeBridgeError';
    this.code = code;
  }
}

export class NativeAdapter {
  constructor(private readonly targetWindow: Window) {}

  postMessage(request: BridgeRequest): void {
    const nativeBridge = this.targetWindow.MyASCFNative;
    if (!nativeBridge || typeof nativeBridge.postMessage !== 'function') {
      throw new NativeBridgeError(
        ERROR_CODE_NATIVE_UNAVAILABLE,
        'Native bridge is unavailable. Please run inside HarmonyOS ArkWeb container.'
      );
    }

    nativeBridge.postMessage(JSON.stringify(request));
  }
}
