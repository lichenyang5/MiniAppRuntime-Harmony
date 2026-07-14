import type { CallbackRecord } from './bridge-types.js';

export class CallbackStore {
  private readonly callbacks: Map<string, CallbackRecord> = new Map();

  set(requestId: string, callback: CallbackRecord): void {
    this.callbacks.set(requestId, callback);
  }

  take(requestId: string): CallbackRecord | undefined {
    const callback: CallbackRecord | undefined = this.callbacks.get(requestId);
    if (callback) {
      this.callbacks.delete(requestId);
    }
    return callback;
  }

  delete(requestId: string): boolean {
    return this.callbacks.delete(requestId);
  }
}
