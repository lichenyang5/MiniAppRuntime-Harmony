import type { CallbackRecord } from './bridge-types.js';
export declare class CallbackStore {
    private readonly callbacks;
    set(requestId: string, callback: CallbackRecord): void;
    take(requestId: string): CallbackRecord | undefined;
    delete(requestId: string): boolean;
}
