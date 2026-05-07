import { HttpTransport } from "./transport.js";
import { parseError } from "./errors.js";
import { BillingService } from "./billing/index.js";
import { SalesService } from "./sales/index.js";
import { ProjectsService } from "./projects/index.js";
const DEFAULT_BASE_URL = "https://api.tedo.ai";
class Tedo {
  billing;
  projects;
  sales;
  /** @internal */
  _transport;
  constructor(apiKeyOrOptions) {
    let transport;
    if (typeof apiKeyOrOptions === "string") {
      transport = new HttpTransport(DEFAULT_BASE_URL, apiKeyOrOptions);
    } else {
      const opts = apiKeyOrOptions;
      transport = opts.transport ?? new HttpTransport(
        opts.baseUrl ?? DEFAULT_BASE_URL,
        opts.apiKey
      );
    }
    this._transport = transport;
    this.billing = new BillingService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport
    });
    this.projects = new ProjectsService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport
    });
    this.sales = new SalesService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport
    });
  }
  /** @internal — sends a request and returns the parsed body. */
  async _request(method, path, body, query, options) {
    const resp = await this._transport.request({
      method,
      path,
      body,
      query,
      headers: headersFromOptions(options)
    });
    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }
    return resp.body;
  }
  /** @internal — sends a request that returns no body (204). */
  async _requestVoid(method, path, body, options) {
    const resp = await this._transport.request({
      method,
      path,
      body,
      headers: headersFromOptions(options)
    });
    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }
  }
}
function headersFromOptions(options) {
  if (!options) return void 0;
  const headers = { ...options.headers ?? {} };
  if (options.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }
  if (options.requestId) {
    headers["X-Request-ID"] = options.requestId;
  }
  return Object.keys(headers).length ? headers : void 0;
}
export {
  Tedo
};
//# sourceMappingURL=client.js.map
