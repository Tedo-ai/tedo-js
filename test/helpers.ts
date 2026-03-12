import type {
  Transport,
  TransportRequest,
  TransportResponse,
} from "../src/transport.js";
import { Tedo } from "../src/client.js";

interface QueuedResponse {
  status: number;
  body: unknown;
}

/** A transport that records requests and returns queued responses. */
export class MockTransport implements Transport {
  /** All requests received, in order. */
  readonly requests: TransportRequest[] = [];

  private responses: QueuedResponse[] = [];

  /** Queue a response to be returned on the next request. */
  enqueue(status: number, body: unknown): void {
    this.responses.push({ status, body });
  }

  async request(req: TransportRequest): Promise<TransportResponse> {
    this.requests.push(req);

    const queued = this.responses.shift();
    if (!queued) {
      return { status: 200, body: {} };
    }
    return { status: queued.status, body: queued.body };
  }

  /** Get the last request received. */
  get lastRequest(): TransportRequest {
    return this.requests[this.requests.length - 1];
  }
}

/** Create a test client with a MockTransport. */
export function createTestClient(): { client: Tedo; transport: MockTransport } {
  const transport = new MockTransport();
  const client = new Tedo({ apiKey: "tedo_test_xxx", transport });
  return { client, transport };
}
