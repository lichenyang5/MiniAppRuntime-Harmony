export class MyASCFAbortError extends Error {
  readonly code: 'ABORTED' = 'ABORTED';
  readonly requestId: string;

  constructor(requestId: string) {
    super('The request was aborted.');
    this.name = 'AbortError';
    this.requestId = requestId;
  }
}
