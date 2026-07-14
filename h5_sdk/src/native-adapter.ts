namespace MyASCFWebSDK {
  export class NativeBridgeError extends Error {
    readonly code: number;

    constructor(code: number, message: string) {
      super(message);
      this.name = 'NativeBridgeError';
      this.code = code;
    }
  }

  export class NativeAdapter {
    postMessage(request: BridgeRequest): void {
      if (!window.MyASCFNative || typeof window.MyASCFNative.postMessage !== 'function') {
        throw new NativeBridgeError(
          ERROR_CODE_NATIVE_UNAVAILABLE,
          'Native bridge is unavailable. Please run inside HarmonyOS ArkWeb container.'
        );
      }

      window.MyASCFNative.postMessage(JSON.stringify(request));
    }
  }
}
