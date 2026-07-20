export declare class MyASCFAbortError extends Error {
    readonly code: 'ABORTED';
    readonly requestId: string;
    constructor(requestId: string);
}
