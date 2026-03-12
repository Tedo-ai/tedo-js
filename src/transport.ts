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
export class HttpTransport implements Transport {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.apiKey = apiKey;
  }

  async request(req: TransportRequest): Promise<TransportResponse> {
    let url = this.baseUrl + req.path;

    if (req.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(req.query)) {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      if (qs) {
        url += "?" + qs;
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
    };

    let fetchBody: string | undefined;
    if (req.body !== undefined) {
      headers["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(req.body);
    }

    const resp = await fetch(url, {
      method: req.method,
      headers,
      body: fetchBody,
    });

    let body: unknown = null;
    const text = await resp.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    return { status: resp.status, body };
  }
}
