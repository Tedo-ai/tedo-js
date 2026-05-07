class HttpTransport {
  baseUrl;
  apiKey;
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.apiKey = apiKey;
  }
  async request(req) {
    let url = this.baseUrl + req.path;
    if (req.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(req.query)) {
        if (value !== void 0 && value !== "") {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      if (qs) {
        url += "?" + qs;
      }
    }
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
      ...req.headers
    };
    let fetchBody;
    if (req.body !== void 0) {
      headers["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(req.body);
    }
    const resp = await fetch(url, {
      method: req.method,
      headers,
      body: fetchBody
    });
    let body = null;
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
export {
  HttpTransport
};
//# sourceMappingURL=transport.js.map
