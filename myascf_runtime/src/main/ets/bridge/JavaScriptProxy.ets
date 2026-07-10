import { BridgeController } from './BridgeController';
import { MyASCFNativeProxy } from '../api/RuntimeTypes';

export class JavaScriptProxy implements MyASCFNativeProxy {
  private bridgeController: BridgeController;

  constructor(bridgeController: BridgeController) {
    this.bridgeController = bridgeController;
  }

  postMessage(message: string): void {
    this.bridgeController.handleMessage(message);
  }
}
