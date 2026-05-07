import { HttpTransport } from "./transport.js";
import type { Transport } from "./transport.js";
import { parseError } from "./errors.js";
import { BillingService } from "./billing/index.js";
import { SalesService } from "./sales/index.js";
import { ProjectsService } from "./projects/index.js";

const DEFAULT_BASE_URL = "https://api.tedo.ai";

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
export class Tedo {
  readonly billing: BillingService;
  readonly projects: ProjectsService;
  readonly sales: SalesService;

  /** @internal */
  readonly _transport: Transport;

  constructor(apiKey: string);
  constructor(options: TedoOptions);
  constructor(apiKeyOrOptions: string | TedoOptions) {
    let transport: Transport;

    if (typeof apiKeyOrOptions === "string") {
      transport = new HttpTransport(DEFAULT_BASE_URL, apiKeyOrOptions);
    } else {
      const opts = apiKeyOrOptions;
      transport =
        opts.transport ??
        new HttpTransport(
          opts.baseUrl ?? DEFAULT_BASE_URL,
          opts.apiKey,
        );
    }

    this._transport = transport;

    this.billing = new BillingService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport,
    });

    this.projects = new ProjectsService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport,
    });

    this.sales = new SalesService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport,
    });
  }

  /** @internal — sends a request and returns the parsed body. */
  async _request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string>,
    options?: RequestOptions,
  ): Promise<T> {
    const resp = await this._transport.request({
      method,
      path,
      body,
      query,
      headers: headersFromOptions(options),
    });

    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }

    return resp.body as T;
  }

  /** @internal — sends a request that returns no body (204). */
  async _requestVoid(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<void> {
    const resp = await this._transport.request({
      method,
      path,
      body,
      headers: headersFromOptions(options),
    });

    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }
  }
}

function headersFromOptions(
  options?: RequestOptions,
): Record<string, string> | undefined {
  if (!options) return undefined;

  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (options.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }
  if (options.requestId) {
    headers["X-Request-ID"] = options.requestId;
  }
  return Object.keys(headers).length ? headers : undefined;
}
