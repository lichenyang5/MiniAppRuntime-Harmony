import { webview } from '@kit.ArkWeb';
import { BridgeCallbackExecutor } from './bridge/BridgeCallbackExecutor';
import { BridgeController } from './bridge/BridgeController';
import { JavaScriptProxy } from './bridge/JavaScriptProxy';
import { BridgeDispatcher } from './dispatcher/BridgeDispatcher';
import { HandlerRegistry } from './registry/HandlerRegistry';
import { RuntimeBootstrap } from './registry/RuntimeBootstrap';
import { MyASCFNativeProxy } from './api/RuntimeTypes';
import { common } from '@kit.AbilityKit';
import { NetworkPolicy } from './types/NetworkTypes';
import { BridgeHandler, CustomApiMetadata } from './api/BridgeTypes';

const PROXY_NAME = 'MyASCFNative';

export class MyASCFRuntime {
  private nativeProxy: JavaScriptProxy;
  private registry: HandlerRegistry;
  private methodList: string[] = ['postMessage'];

  constructor(controller: webview.WebviewController, context: common.Context, networkPolicy?: NetworkPolicy) {
    const registry: HandlerRegistry = RuntimeBootstrap.createRegistry(context, networkPolicy);
    this.registry = registry;
    const dispatcher: BridgeDispatcher = new BridgeDispatcher(registry);
    const callbackExecutor: BridgeCallbackExecutor = new BridgeCallbackExecutor(controller);
    const bridgeController: BridgeController = new BridgeController(dispatcher, callbackExecutor);
    this.nativeProxy = new JavaScriptProxy(bridgeController);
  }

  getNativeProxy(): MyASCFNativeProxy {
    return this.nativeProxy;
  }

  registerCustomApi(action: string, handler: BridgeHandler, metadata?: CustomApiMetadata): void {
    this.registry.registerCustomApi(action, handler, metadata);
  }

  getProxyName(): string {
    return PROXY_NAME;
  }

  getMethodList(): string[] {
    return this.methodList;
  }
}
