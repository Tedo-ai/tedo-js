import type { Transport, TransportRequest } from "./transport.js";
/** A paginated response. */
export declare class Page<T> {
    readonly data: T[];
    readonly total: number;
    readonly nextCursor: string | null;
    private transport;
    private nextRequest;
    private dataKey;
    constructor(opts: {
        data: T[];
        total: number;
        nextCursor: string | null;
        transport: Transport;
        nextRequest: TransportRequest | null;
        dataKey: string;
    });
    /** Whether there are more pages. */
    get hasMore(): boolean;
    /** Fetch the next page. Returns null if no more pages. */
    nextPage(): Promise<Page<T> | null>;
    /** Async iterator that yields every item across all pages. */
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}
//# sourceMappingURL=pagination.d.ts.map