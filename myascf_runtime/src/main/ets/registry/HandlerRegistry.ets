import { BridgeHandler } from '../api/BridgeTypes';

export class HandlerRegistry {
  private handlers: Map<string, BridgeHandler> = new Map<string, BridgeHandler>();

  register(action: string, handler: BridgeHandler): void {
    this.handlers.set(action, handler);
  }

  get(action: string): BridgeHandler | undefined {
    return this.handlers.get(action);
  }

  has(action: string): boolean {
    return this.handlers.has(action);
  }
}
