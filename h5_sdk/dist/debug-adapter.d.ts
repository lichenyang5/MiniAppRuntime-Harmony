import type { DebugRecord } from './bridge-types.js';
type DebugMethod = 'recordStart' | 'recordEnd' | 'recordError' | 'recordLost';
export declare class DebugAdapter {
    private readonly targetWindow;
    constructor(targetWindow: Window);
    record(method: DebugMethod, record: DebugRecord): void;
}
export {};
