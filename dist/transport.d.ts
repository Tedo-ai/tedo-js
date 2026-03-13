/** Request passed to a transport. */
export interface TransportRequest {
    method: string;
    path: string;
    body?: unknown;
    query?: Record<string, string>;
}
/** Response returned by a transport. */
export interface TransportResponse {
    status: number;
    body: unknown;
}
/** Pluggable transport interface. Layer 2 can swap this for local state reads. */
export interface Transport {
    request(req: TransportRequest): Promise<TransportResponse>;
}
/** HTTP transport using native fetch. */
export declare class HttpTransport implements Transport {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    request(req: TransportRequest): Promise<TransportResponse>;
}
//# sourceMappingURL=transport.d.ts.map