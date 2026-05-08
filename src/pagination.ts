import type { Transport, TransportRequest } from "./transport.js";
import { parseError } from "./errors.js";

/** A paginated response. */
export class Page<T> {
  readonly data: T[];
  readonly total: number;
  readonly nextCursor: string | null;

  private transport: Transport;
  private nextRequest: TransportRequest | null;
  private dataKey: string;

  constructor(opts: {
    data: T[];
    total: number;
    nextCursor: string | null;
    transport: Transport;
    nextRequest: TransportRequest | null;
    dataKey: string;
  }) {
    this.data = opts.data;
    this.total = opts.total;
    this.nextCursor = opts.nextCursor;
    this.transport = opts.transport;
    this.nextRequest = opts.nextRequest;
    this.dataKey = opts.dataKey;
  }

  /** Whether there are more pages. */
  get hasMore(): boolean {
    return this.nextCursor !== null;
  }

  /** Alias for APIs that return cursor envelopes as { items, next_cursor, has_more }. */
  get items(): T[] {
    return this.data;
  }

  /** Fetch the next page. Returns null if no more pages. */
  async nextPage(): Promise<Page<T> | null> {
    if (!this.hasMore || !this.nextRequest) return null;

    const req: TransportRequest = {
      ...this.nextRequest,
      query: {
        ...this.nextRequest.query,
        cursor: this.nextCursor!,
      },
    };

    const resp = await this.transport.request(req);

    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }

    const body = resp.body as Record<string, unknown>;
    const data = (body[this.dataKey] ?? []) as T[];
    const total = (body.total as number) ?? 0;
    const cursor = (body.next_cursor as string) ?? null;

    return new Page<T>({
      data,
      total,
      nextCursor: cursor,
      transport: this.transport,
      nextRequest: req,
      dataKey: this.dataKey,
    });
  }

  /** Async iterator that yields every item across all pages. */
  async *[Symbol.asyncIterator](): AsyncIterableIterator<T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let page: Page<T> | null = this;
    while (page) {
      for (const item of page.data) {
        yield item;
      }
      page = await page.nextPage();
    }
  }
}
