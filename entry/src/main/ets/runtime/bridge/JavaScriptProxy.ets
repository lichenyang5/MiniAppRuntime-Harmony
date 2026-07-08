import { BridgeController } from './BridgeController';

export class JavaScriptProxy {
  private bridgeController: BridgeController;

  constructor(bridgeController: BridgeController) {
    this.bridgeController = bridgeController;
  }

  postMessage(message: string): void {
    this.bridgeController.handleMessage(message);
  }
}
