export enum WebLoadStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  BLOCKED = 'blocked'
}

export interface WebLoadState {
  status: WebLoadStatus;
  progress: number;
  url: string;
  errorMessage: string;
}
