import type { DebugPanel, DebugRecord } from './bridge-types.js';

type DebugMethod = 'recordStart' | 'recordEnd' | 'recordError' | 'recordLost';

export class DebugAdapter {
  constructor(private readonly targetWindow: Window) {}

  record(method: DebugMethod, record: DebugRecord): void {
    try {
      const panel: DebugPanel | undefined = this.targetWindow.MyASCFDebugPanel;
      const handler: ((item: DebugRecord) => void) | undefined = panel && panel[method];
      if (typeof handler === 'function') {
        handler.call(panel, record);
      }
    } catch (error) {
      console.warn('[myascf] DebugPanel failed:', error);
    }
  }
}
