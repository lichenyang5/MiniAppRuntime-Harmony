import { ApiSummary, BridgeHandler, CustomApiMetadata } from '../api/BridgeTypes';

export class HandlerRegistry {
  private handlers: Map<string, BridgeHandler> = new Map<string, BridgeHandler>();
  private customSummaries: Map<string, ApiSummary> = new Map<string, ApiSummary>();

  registerCustomApi(action: string, handler: BridgeHandler, metadata?: CustomApiMetadata): void {
    if (typeof action !== 'string' || action.length > 128 ||
      !/^app\.[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)*$/.test(action)) {
      throw new Error('Custom API action must use app.* (up to 128 characters).');
    }
    if (this.handlers.has(action)) {
      throw new Error('API already registered: ' + action);
    }
    if (!handler || typeof handler.handle !== 'function') {
      throw new Error('Custom API handler must implement handle().');
    }
    if (metadata && (typeof metadata.title !== 'string' || !metadata.title.trim() ||
      typeof metadata.description !== 'string' || typeof metadata.paramsText !== 'string')) {
      throw new Error('Custom API metadata requires title, description and paramsText strings.');
    }
    const summary: ApiSummary = {
      action: action, category: 'app', implemented: true,
      title: metadata ? metadata.title : action,
      description: metadata ? metadata.description : 'Host-defined API',
      paramsText: metadata ? metadata.paramsText : 'Host-defined'
    };
    this.handlers.set(action, handler);
    this.customSummaries.set(action, summary);
  }

  getCustomSummaries(): ApiSummary[] {
    const summaries: ApiSummary[] = [];
    this.customSummaries.forEach((item: ApiSummary) => {
      summaries.push({ action: item.action, category: item.category, title: item.title,
        description: item.description, implemented: item.implemented, paramsText: item.paramsText });
    });
    return summaries;
  }

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
