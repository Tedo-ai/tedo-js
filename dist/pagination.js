import { parseError } from "./errors.js";
class Page {
  data;
  total;
  nextCursor;
  transport;
  nextRequest;
  dataKey;
  constructor(opts) {
    this.data = opts.data;
    this.total = opts.total;
    this.nextCursor = opts.nextCursor;
    this.transport = opts.transport;
    this.nextRequest = opts.nextRequest;
    this.dataKey = opts.dataKey;
  }
  /** Whether there are more pages. */
  get hasMore() {
    return this.nextCursor !== null;
  }
  /** Alias for APIs that return cursor envelopes as { items, next_cursor, has_more }. */
  get items() {
    return this.data;
  }
  /** Fetch the next page. Returns null if no more pages. */
  async nextPage() {
    if (!this.hasMore || !this.nextRequest) return null;
    const req = {
      ...this.nextRequest,
      query: {
        ...this.nextRequest.query,
        cursor: this.nextCursor
      }
    };
    const resp = await this.transport.request(req);
    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }
    const body = resp.body;
    const data = body[this.dataKey] ?? [];
    const total = body.total ?? 0;
    const cursor = body.next_cursor ?? null;
    return new Page({
      data,
      total,
      nextCursor: cursor,
      transport: this.transport,
      nextRequest: req,
      dataKey: this.dataKey
    });
  }
  /** Async iterator that yields every item across all pages. */
  async *[Symbol.asyncIterator]() {
    let page = this;
    while (page) {
      for (const item of page.data) {
        yield item;
      }
      page = await page.nextPage();
    }
  }
}
export {
  Page
};
//# sourceMappingURL=pagination.js.map
