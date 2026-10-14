import { HostEchoHandler } from '../custom/HostEchoHandler';
import { webview } from '@kit.ArkWeb';
import { hilog } from '@kit.PerformanceAnalysisKit';
import {
  MyASCFRuntime,
  WebContainerConfig,
  WebLoadState,
  WebLoadStatus,
  WebUrlGuard
} from 'myascf_runtime';

const LOG_DOMAIN: number = 0x1200;
const LOG_TAG: string = 'MyASCFDemo';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  private runtime: MyASCFRuntime = new MyASCFRuntime(this.controller, getContext(this));
  private customApiRegistered: boolean = false;
  aboutToAppear(): void {
    if (!this.customApiRegistered) {
      this.runtime.registerCustomApi('app.echo', new HostEchoHandler(), {
        title: 'Host Echo', description: 'Echo implemented by this host', paramsText: 'text: string'
      });
      this.customApiRegistered = true;
    }
  }
  private config: WebContainerConfig = {
    homeUrl: 'web/index.html',
    allowedSchemes: ['resource', 'https'],
    allowedHosts: [],
    enableDebugPanel: true,
    enableUrlGuard: true
  };
  private urlGuard: WebUrlGuard = new WebUrlGuard(this.config);
  @State private loadState: WebLoadState = {
    status: WebLoadStatus.IDLE,
    progress: 0,
    url: 'web/index.html',
    errorMessage: ''
  };

  private updateLoadState(status: WebLoadStatus, progress: number, url: string, errorMessage: string): void {
    this.loadState = { status: status, progress: progress, url: url, errorMessage: errorMessage };
  }

  private retryHome(): void {
    this.updateLoadState(WebLoadStatus.LOADING, 0, this.config.homeUrl, '');
    this.controller.loadUrl($rawfile('web/index.html'));
  }

  build() {
    Stack({ alignContent: Alignment.Top }) {
      Web({ src: $rawfile('web/index.html'), controller: this.controller })
        .javaScriptProxy({
          object: this.runtime.getNativeProxy(),
          name: this.runtime.getProxyName(),
          methodList: this.runtime.getMethodList(),
          controller: this.controller
        })
        .onPageBegin((event) => {
          hilog.info(LOG_DOMAIN, LOG_TAG, '%{public}s', `[WebContainer] load begin: ${event.url}`);
          this.updateLoadState(WebLoadStatus.LOADING, 0, event.url, '');
        })
        .onProgressChange((event) => {
          if (this.loadState.status === WebLoadStatus.ERROR || this.loadState.status === WebLoadStatus.BLOCKED) {
            return;
          }
          hilog.info(LOG_DOMAIN, LOG_TAG, '%{public}s',
            `[WebContainer] load progress: url=${this.loadState.url}, progress=${event.newProgress}`);
          this.updateLoadState(WebLoadStatus.LOADING, event.newProgress, this.loadState.url, '');
        })
        .onPageEnd((event) => {
          if (this.loadState.status === WebLoadStatus.ERROR || this.loadState.status === WebLoadStatus.BLOCKED) {
            return;
          }
          hilog.info(LOG_DOMAIN, LOG_TAG, '%{public}s', `[WebContainer] load end: ${event.url}`);
          this.updateLoadState(WebLoadStatus.SUCCESS, 100, event.url, '');
        })
        .onLoadIntercept((event) => {
          const url: string = event.data.getRequestUrl();
          if (this.urlGuard.isAllowed(url)) {
            return false;
          }
          const reason: string = this.urlGuard.getBlockReason(url);
          hilog.warn(LOG_DOMAIN, LOG_TAG, '%{public}s', `[WebContainer] url blocked: url=${url}, reason=${reason}`);
          if (event.data.isMainFrame()) {
            this.updateLoadState(WebLoadStatus.BLOCKED, 0, url, 'URL 不在白名单内');
          }
          return true;
        })
        .onErrorReceive((event) => {
          if (!event.request.isMainFrame()) {
            return;
          }
          const url: string = event.request.getRequestUrl();
          const message: string = event.error.getErrorInfo();
          hilog.error(LOG_DOMAIN, LOG_TAG, '%{public}s', `[WebContainer] load error: url=${url}, message=${message}`);
          this.updateLoadState(WebLoadStatus.ERROR, 0, url, '页面加载失败');
        })
        .width('100%')
        .height('100%')

      if (this.loadState.status === WebLoadStatus.LOADING) {
        Column() {
          Progress({ value: this.loadState.progress, total: 100, type: ProgressType.Linear })
            .width('100%')
            .height(3)
          Text(`Loading ${this.loadState.progress}%`)
            .fontSize(12)
            .fontColor('#475569')
            .padding({ top: 6, right: 12 })
            .alignSelf(ItemAlign.End)
        }
        .width('100%')
      }

      if (this.loadState.status === WebLoadStatus.ERROR || this.loadState.status === WebLoadStatus.BLOCKED) {
        Column({ space: 12 }) {
          Text(this.loadState.status === WebLoadStatus.BLOCKED ? 'URL 已拦截' : '加载失败')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
          Text(this.loadState.errorMessage)
            .fontSize(15)
            .fontColor('#475569')
          Text(this.loadState.url)
            .fontSize(12)
            .fontColor('#64748b')
            .maxLines(3)
          Button('重试首页')
            .onClick(() => this.retryHome())
        }
        .justifyContent(FlexAlign.Center)
        .padding(24)
        .width('100%')
        .height('100%')
        .backgroundColor('#FFFFFF')
      }
    }
    .width('100%')
    .height('100%')
  }
}
