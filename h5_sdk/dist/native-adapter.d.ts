import type { BridgeRequest } from './bridge-types.js';
export declare class NativeBridgeError extends Error {
    readonly code: number;
    constructor(code: number, message: string);
}
export declare class NativeAdapter {
    private readonly targetWindow;
    constructor(targetWindow: Window);
    postMessage(request: BridgeRequest): void;
}
