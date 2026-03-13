import { HttpTransport } from "./transport.js";
import { parseError } from "./errors.js";
import { BillingService } from "./billing/index.js";
import { SalesService } from "./sales/index.js";
const DEFAULT_BASE_URL = "https://api.tedo.ai/v1";
/** Tedo API client. */
export class Tedo {
    billing;
    sales;
    /** @internal */
    _transport;
    constructor(apiKeyOrOptions) {
        let transport;
        if (typeof apiKeyOrOptions === "string") {
            transport = new HttpTransport(DEFAULT_BASE_URL, apiKeyOrOptions);
        }
        else {
            const opts = apiKeyOrOptions;
            transport =
                opts.transport ??
                    new HttpTransport(opts.baseUrl ?? DEFAULT_BASE_URL, opts.apiKey);
        }
        this._transport = transport;
        this.billing = new BillingService({
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
    async _request(method, path, body, query) {
        const resp = await this._transport.request({ method, path, body, query });
        if (resp.status >= 400) {
            throw parseError(resp.status, resp.body);
        }
        return resp.body;
    }
    /** @internal — sends a request that returns no body (204). */
    async _requestVoid(method, path, body) {
        const resp = await this._transport.request({ method, path, body });
        if (resp.status >= 400) {
            throw parseError(resp.status, resp.body);
        }
    }
}
//# sourceMappingURL=client.js.map