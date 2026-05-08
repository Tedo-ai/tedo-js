import type { Transport } from "./transport.js";
import { BillingService } from "./billing/index.js";
import { SalesService } from "./sales/index.js";
import { ProjectsService } from "./projects/index.js";
export interface TedoOptions {
    apiKey: string;
    baseUrl?: string;
    transport?: Transport;
}
export interface RequestOptions {
    idempotencyKey?: string;
    requestId?: string;
    headers?: Record<string, string>;
}
/** Tedo API client. */
export declare class Tedo {
    readonly billing: BillingService;
    readonly projects: ProjectsService;
    readonly sales: SalesService;
    /** @internal */
    readonly _transport: Transport;
    constructor(apiKey: string);
    constructor(options: TedoOptions);
    /** @internal — sends a request and returns the parsed body. */
    _request<T>(method: string, path: string, body?: unknown, query?: Record<string, string>, options?: RequestOptions): Promise<T>;
    /** @internal — sends a request that returns no body (204). */
    _requestVoid(method: string, path: string, body?: unknown, options?: RequestOptions): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map
