export interface NetworkRequestHandle {
  abort(): boolean;
}

export class NetworkRequestRegistry {
  private requests: Map<string, NetworkRequestHandle> = new Map<string, NetworkRequestHandle>();

  register(requestId: string, handle: NetworkRequestHandle): boolean {
    if (this.requests.has(requestId)) {
      return false;
    }
    this.requests.set(requestId, handle);
    return true;
  }

  get(requestId: string): NetworkRequestHandle | undefined {
    return this.requests.get(requestId);
  }

  abort(requestId: string): boolean {
    const handle: NetworkRequestHandle | undefined = this.requests.get(requestId);
    if (handle === undefined) {
      return false;
    }
    const aborted: boolean = handle.abort();
    if (aborted) {
      this.requests.delete(requestId);
    }
    return aborted;
  }

  remove(requestId: string, expectedHandle?: NetworkRequestHandle): boolean {
    if (expectedHandle !== undefined && this.requests.get(requestId) !== expectedHandle) {
      return false;
    }
    return this.requests.delete(requestId);
  }

  has(requestId: string): boolean {
    return this.requests.has(requestId);
  }

  clear(): void {
    this.requests.forEach((handle: NetworkRequestHandle) => {
      handle.abort();
    });
    this.requests.clear();
  }
}
