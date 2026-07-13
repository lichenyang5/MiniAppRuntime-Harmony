import { WebContainerConfig } from './WebContainerConfig';

export class WebUrlGuard {
  private config: WebContainerConfig;

  constructor(config: WebContainerConfig) {
    this.config = config;
  }

  isAllowed(url: string): boolean {
    return this.getBlockReason(url).length === 0;
  }

  getBlockReason(url: string): string {
    const normalizedUrl: string = url.trim();
    if (normalizedUrl.length === 0) {
      return 'URL 为空';
    }
    if (!this.config.enableUrlGuard) {
      return '';
    }
    if (normalizedUrl.startsWith('resource://rawfile/') || normalizedUrl.startsWith('rawfile/')) {
      return '';
    }

    const separatorIndex: number = normalizedUrl.indexOf('://');
    if (separatorIndex <= 0) {
      return 'URL 格式无法识别';
    }
    const scheme: string = normalizedUrl.substring(0, separatorIndex).toLowerCase();
    if (!this.config.allowedSchemes.includes(scheme)) {
      return `Scheme 不在白名单内: ${scheme}`;
    }
    if (scheme === 'resource') {
      return 'Resource URL 仅允许 rawfile';
    }
    if (scheme === 'file') {
      return '';
    }
    if (scheme !== 'http' && scheme !== 'https') {
      return '';
    }

    const authorityStart: number = separatorIndex + 3;
    const pathIndex: number = normalizedUrl.indexOf('/', authorityStart);
    const authority: string = pathIndex < 0 ? normalizedUrl.substring(authorityStart) :
      normalizedUrl.substring(authorityStart, pathIndex);
    const host: string = authority.split(':')[0].toLowerCase();
    if (host.length === 0) {
      return 'URL host 无法识别';
    }
    if (!this.config.allowedHosts.includes(host)) {
      return `Host 不在白名单内: ${host}`;
    }
    return '';
  }
}
