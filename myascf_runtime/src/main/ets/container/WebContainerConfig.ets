export interface WebContainerConfig {
  homeUrl: string;
  allowedSchemes: string[];
  allowedHosts: string[];
  enableDebugPanel: boolean;
  enableUrlGuard: boolean;
}
