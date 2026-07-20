export declare class CancelledRequestStore {
    private readonly ttl;
    private readonly maxSize;
    private readonly requestIds;
    constructor(ttl?: number, maxSize?: number);
    add(requestId: string, now?: number): void;
    consume(requestId: string, now?: number): boolean;
    private purge;
}
