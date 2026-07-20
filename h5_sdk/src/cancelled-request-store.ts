const DEFAULT_TTL: number = 30000;
const DEFAULT_MAX_SIZE: number = 100;

export class CancelledRequestStore {
  private readonly requestIds: Map<string, number> = new Map();

  constructor(
    private readonly ttl: number = DEFAULT_TTL,
    private readonly maxSize: number = DEFAULT_MAX_SIZE
  ) {}

  add(requestId: string, now: number = Date.now()): void {
    this.purge(now);
    this.requestIds.delete(requestId);
    while (this.requestIds.size >= this.maxSize) {
      const oldest: IteratorResult<string> = this.requestIds.keys().next();
      if (oldest.done) {
        break;
      }
      this.requestIds.delete(oldest.value);
    }
    this.requestIds.set(requestId, now + this.ttl);
  }

  consume(requestId: string, now: number = Date.now()): boolean {
    this.purge(now);
    if (!this.requestIds.has(requestId)) {
      return false;
    }
    this.requestIds.delete(requestId);
    return true;
  }

  private purge(now: number): void {
    this.requestIds.forEach((expiresAt: number, requestId: string) => {
      if (expiresAt <= now) {
        this.requestIds.delete(requestId);
      }
    });
  }
}
