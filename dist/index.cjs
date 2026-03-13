"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ActivityType: () => ActivityType,
  AuthenticationError: () => AuthenticationError,
  BillingService: () => BillingService,
  HttpTransport: () => HttpTransport,
  Link: () => Link,
  NotFoundError: () => NotFoundError,
  Page: () => Page,
  PermissionError: () => PermissionError,
  RateLimitError: () => RateLimitError,
  ResourceType: () => ResourceType,
  SalesService: () => SalesService,
  StageOutcome: () => StageOutcome,
  Tedo: () => Tedo,
  TedoError: () => TedoError,
  ValidationError: () => ValidationError,
  parseError: () => parseError
});
module.exports = __toCommonJS(index_exports);

// src/transport.ts
var HttpTransport = class {
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
      Accept: "application/json"
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
};

// src/errors.ts
var TedoError = class extends Error {
  /** Machine-readable error code (e.g. "validation_error"). */
  code;
  /** HTTP status code. */
  status;
  /** Field that caused the error, if applicable. */
  field;
  constructor(code, message, status, field) {
    super(message);
    this.name = "TedoError";
    this.code = code;
    this.status = status;
    this.field = field;
  }
};
var ValidationError = class extends TedoError {
  constructor(code, message, field) {
    super(code, message, 400, field);
    this.name = "ValidationError";
  }
};
var AuthenticationError = class extends TedoError {
  constructor(code, message) {
    super(code, message, 401);
    this.name = "AuthenticationError";
  }
};
var PermissionError = class extends TedoError {
  constructor(code, message) {
    super(code, message, 403);
    this.name = "PermissionError";
  }
};
var NotFoundError = class extends TedoError {
  constructor(code, message) {
    super(code, message, 404);
    this.name = "NotFoundError";
  }
};
var RateLimitError = class extends TedoError {
  constructor(code, message) {
    super(code, message, 429);
    this.name = "RateLimitError";
  }
};
function parseError(status, body) {
  let code = "unknown_error";
  let message = "An unknown error occurred";
  let field;
  if (body && typeof body === "object") {
    const obj = body;
    if (typeof obj.code === "string") code = obj.code;
    else if (typeof obj.error === "string") code = obj.error;
    if (typeof obj.message === "string") message = obj.message;
    if (typeof obj.field === "string") field = obj.field;
  } else if (typeof body === "string") {
    message = body;
  }
  switch (status) {
    case 400:
      return new ValidationError(code, message, field);
    case 401:
      return new AuthenticationError(code, message);
    case 403:
      return new PermissionError(code, message);
    case 404:
      return new NotFoundError(code, message);
    case 429:
      return new RateLimitError(code, message);
    default:
      return new TedoError(code, message, status, field);
  }
}

// src/pagination.ts
var Page = class _Page {
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
    return new _Page({
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
};

// src/billing/index.ts
var BillingService = class {
  req;
  reqVoid;
  transport;
  /** @internal — constructed by Tedo client. */
  constructor(client) {
    this.req = client._request;
    this.reqVoid = client._requestVoid;
    this.transport = client._transport;
  }
  // ============================================================
  // PLANS
  // ============================================================
  async createPlan(params) {
    return this.req("POST", "/billing/plans", params);
  }
  async listPlans() {
    return this.req("GET", "/billing/plans");
  }
  async getPlan(id) {
    return this.req("GET", `/billing/plans/${id}`);
  }
  async updatePlan(id, params) {
    return this.req("PATCH", `/billing/plans/${id}`, params);
  }
  async deletePlan(id) {
    return this.reqVoid("DELETE", `/billing/plans/${id}`);
  }
  // ============================================================
  // PRICES
  // ============================================================
  async createPrice(planId, params) {
    return this.req(
      "POST",
      `/billing/plans/${planId}/prices`,
      params
    );
  }
  async listPrices(planId) {
    return this.req("GET", `/billing/plans/${planId}/prices`);
  }
  async archivePrice(planId, priceId) {
    return this.reqVoid(
      "DELETE",
      `/billing/plans/${planId}/prices/${priceId}`
    );
  }
  // ============================================================
  // ENTITLEMENTS
  // ============================================================
  async createEntitlement(planId, params) {
    return this.req(
      "POST",
      `/billing/plans/${planId}/entitlements`,
      params
    );
  }
  async listEntitlements(planId) {
    return this.req("GET", `/billing/plans/${planId}/entitlements`);
  }
  async archiveEntitlement(planId, entitlementId) {
    return this.reqVoid(
      "DELETE",
      `/billing/plans/${planId}/entitlements/${entitlementId}`
    );
  }
  // ============================================================
  // CUSTOMERS
  // ============================================================
  async createCustomer(params) {
    return this.req("POST", "/billing/customers", params);
  }
  async getCustomer(id) {
    return this.req("GET", `/billing/customers/${id}`);
  }
  async listCustomers(params) {
    const query = {};
    if (params?.limit) query.limit = String(params.limit);
    if (params?.cursor) query.cursor = params.cursor;
    const baseReq = {
      method: "GET",
      path: "/billing/customers",
      query
    };
    const resp = await this.transport.request(baseReq);
    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }
    const body = resp.body;
    const customers = body.customers ?? [];
    const total = body.total ?? 0;
    const nextCursor = body.next_cursor ?? null;
    return new Page({
      data: customers,
      total,
      nextCursor,
      transport: this.transport,
      nextRequest: baseReq,
      dataKey: "customers"
    });
  }
  async updateCustomer(id, params) {
    return this.req(
      "PATCH",
      `/billing/customers/${id}`,
      params
    );
  }
  async deleteCustomer(id) {
    return this.reqVoid("DELETE", `/billing/customers/${id}`);
  }
  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================
  async createSubscription(params) {
    return this.req(
      "POST",
      "/billing/subscriptions",
      params
    );
  }
  async getSubscription(id) {
    return this.req(
      "GET",
      `/billing/subscriptions/${id}`
    );
  }
  async cancelSubscription(id) {
    return this.req(
      "DELETE",
      `/billing/subscriptions/${id}`
    );
  }
  // ============================================================
  // ENTITLEMENT CHECK
  // ============================================================
  async checkEntitlement(params) {
    return this.req(
      "POST",
      "/billing/entitlements/check",
      params
    );
  }
  // ============================================================
  // USAGE
  // ============================================================
  async recordUsage(params) {
    return this.req("POST", "/billing/usage", params);
  }
  async getUsageSummary(params) {
    return this.req("GET", "/billing/usage", void 0, {
      subscription_id: params.subscription_id
    });
  }
  // ============================================================
  // PORTAL
  // ============================================================
  async createPortalLink(customerId, params) {
    return this.req(
      "POST",
      `/billing/customers/${customerId}/portal-link`,
      params ?? {}
    );
  }
  // ============================================================
  // PAYMENT CONFIGS
  // ============================================================
  async createPaymentConfig(params) {
    return this.req(
      "POST",
      "/billing/payment-configs",
      params
    );
  }
  async listPaymentConfigs() {
    return this.req("GET", "/billing/payment-configs");
  }
  async getPaymentConfig(id) {
    return this.req(
      "GET",
      `/billing/payment-configs/${id}`
    );
  }
  async updatePaymentConfig(id, params) {
    return this.req(
      "PATCH",
      `/billing/payment-configs/${id}`,
      params
    );
  }
  async deletePaymentConfig(id) {
    return this.reqVoid("DELETE", `/billing/payment-configs/${id}`);
  }
};

// src/sales/index.ts
var SalesService = class {
  req;
  reqVoid;
  /** @internal — constructed by Tedo client. */
  constructor(client) {
    this.req = client._request;
    this.reqVoid = client._requestVoid;
  }
  /** Format a Date or ISO string to YYYY-MM-DD for the API. */
  formatDate(value) {
    if (!value) return void 0;
    if (value instanceof Date) return value.toISOString().split("T")[0];
    return value;
  }
  // ============================================================
  // PIPELINES
  // ============================================================
  /** Create a new pipeline. */
  async createPipeline(params) {
    return this.req("POST", "/sales/v1/pipelines", params);
  }
  /** List all pipelines. */
  async listPipelines() {
    return this.req("GET", "/sales/v1/pipelines");
  }
  /** Get a pipeline by ID. */
  async getPipeline(id) {
    return this.req("GET", `/sales/v1/pipelines/${id}`);
  }
  /** Update a pipeline. */
  async updatePipeline(id, params) {
    return this.req("PATCH", `/sales/v1/pipelines/${id}`, params);
  }
  /** Delete a pipeline. */
  async deletePipeline(id) {
    return this.reqVoid("DELETE", `/sales/v1/pipelines/${id}`);
  }
  // ============================================================
  // STAGES
  // ============================================================
  /** Create a stage within a pipeline. */
  async createStage(pipelineId, params) {
    return this.req(
      "POST",
      "/sales/v1/stages",
      { pipeline_id: pipelineId, ...params }
    );
  }
  /** List all stages in a pipeline. */
  async listStages(pipelineId) {
    return this.req("GET", "/sales/v1/stages", void 0, {
      pipeline_id: pipelineId
    });
  }
  /** Get a stage by ID. */
  async getStage(id) {
    return this.req("GET", `/sales/v1/stages/${id}`);
  }
  /** Update a stage. */
  async updateStage(id, params) {
    return this.req("PATCH", `/sales/v1/stages/${id}`, params);
  }
  /** Delete a stage. */
  async deleteStage(id) {
    return this.reqVoid("DELETE", `/sales/v1/stages/${id}`);
  }
  // ============================================================
  // LEADS
  // ============================================================
  /** Create a new lead. */
  async createLead(params) {
    return this.req("POST", "/sales/v1/leads", params);
  }
  /** List leads, optionally filtered by pipeline. */
  async listLeads(params) {
    const query = {};
    if (params?.pipeline_id) query.pipeline_id = params.pipeline_id;
    return this.req(
      "GET",
      "/sales/v1/leads",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get a lead by ID. */
  async getLead(id) {
    return this.req("GET", `/sales/v1/leads/${id}`);
  }
  /** Update a lead. */
  async updateLead(id, params) {
    return this.req("PATCH", `/sales/v1/leads/${id}`, params);
  }
  /** Delete a lead. */
  async deleteLead(id) {
    return this.reqVoid("DELETE", `/sales/v1/leads/${id}`);
  }
  /** Move a lead to a different stage. */
  async moveLeadStage(id, stageId) {
    return this.req("POST", `/sales/v1/leads/${id}/move`, {
      stage_id: stageId
    });
  }
  /** Convert a lead into a deal. */
  async convertLeadToDeal(id, params) {
    return this.req("POST", `/sales/v1/leads/${id}/convert`, params);
  }
  // ============================================================
  // DEALS
  // ============================================================
  /** Create a new deal. */
  async createDeal(params) {
    return this.req("POST", "/sales/v1/deals", {
      ...params,
      expected_close_date: this.formatDate(params.expected_close_date)
    });
  }
  /** List deals, optionally filtered by pipeline. */
  async listDeals(params) {
    const query = {};
    if (params?.pipeline_id) query.pipeline_id = params.pipeline_id;
    return this.req(
      "GET",
      "/sales/v1/deals",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get a deal by ID. */
  async getDeal(id) {
    return this.req("GET", `/sales/v1/deals/${id}`);
  }
  /** Update a deal. */
  async updateDeal(id, params) {
    return this.req("PATCH", `/sales/v1/deals/${id}`, {
      ...params,
      expected_close_date: this.formatDate(params.expected_close_date)
    });
  }
  /** Delete a deal. */
  async deleteDeal(id) {
    return this.reqVoid("DELETE", `/sales/v1/deals/${id}`);
  }
  /** Move a deal to a different stage. */
  async moveDealStage(id, stageId) {
    return this.req("POST", `/sales/v1/deals/${id}/move`, {
      stage_id: stageId
    });
  }
  // ============================================================
  // ACTIVITIES
  // ============================================================
  /** Create a new activity. */
  async createActivity(params) {
    return this.req("POST", "/sales/v1/activities", {
      ...params,
      due_date: this.formatDate(params.due_date)
    });
  }
  /** List activities, optionally filtered by lead, deal, or type. */
  async listActivities(params) {
    const query = {};
    if (params?.lead_id) query.lead_id = params.lead_id;
    if (params?.deal_id) query.deal_id = params.deal_id;
    if (params?.type) query.type = params.type;
    return this.req(
      "GET",
      "/sales/v1/activities",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get an activity by ID. */
  async getActivity(id) {
    return this.req("GET", `/sales/v1/activities/${id}`);
  }
  /** Update an activity. */
  async updateActivity(id, params) {
    return this.req("PATCH", `/sales/v1/activities/${id}`, {
      ...params,
      due_date: this.formatDate(params.due_date)
    });
  }
  /** Delete an activity. */
  async deleteActivity(id) {
    return this.reqVoid("DELETE", `/sales/v1/activities/${id}`);
  }
  /** Mark an activity as completed or uncompleted. */
  async completeActivity(id, completed = true) {
    return this.req("POST", `/sales/v1/activities/${id}/complete`, {
      completed
    });
  }
  // ============================================================
  // NOTES
  // ============================================================
  /** Create a new note. */
  async createNote(params) {
    return this.req("POST", "/sales/v1/notes", params);
  }
  /** List notes, optionally filtered by lead or deal. */
  async listNotes(params) {
    const query = {};
    if (params?.lead_id) query.lead_id = params.lead_id;
    if (params?.deal_id) query.deal_id = params.deal_id;
    return this.req(
      "GET",
      "/sales/v1/notes",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get a note by ID. */
  async getNote(id) {
    return this.req("GET", `/sales/v1/notes/${id}`);
  }
  /** Update a note. */
  async updateNote(id, params) {
    return this.req("PATCH", `/sales/v1/notes/${id}`, params);
  }
  /** Delete a note. */
  async deleteNote(id) {
    return this.reqVoid("DELETE", `/sales/v1/notes/${id}`);
  }
  // ============================================================
  // CONTACT BASES
  // ============================================================
  /** List all contact bases. */
  async listContactBases() {
    return this.req("GET", "/sales/v1/contact-bases");
  }
  /** Get a contact base by ID. */
  async getContactBase(id) {
    return this.req("GET", `/sales/v1/contact-bases/${id}`);
  }
  // ============================================================
  // PERSONS
  // ============================================================
  /** Create a new person in a contact base. */
  async createPerson(contactBaseId, params) {
    return this.req(
      "POST",
      `/sales/v1/contact-bases/${contactBaseId}/persons`,
      params
    );
  }
  /** List all persons in a contact base. */
  async listPersons(contactBaseId) {
    return this.req(
      "GET",
      `/sales/v1/contact-bases/${contactBaseId}/persons`
    );
  }
  /** Get a person by ID. */
  async getPerson(id) {
    return this.req("GET", `/sales/v1/persons/${id}`);
  }
  /** Update a person. */
  async updatePerson(id, params) {
    return this.req("PATCH", `/sales/v1/persons/${id}`, params);
  }
  /** Delete a person. */
  async deletePerson(id) {
    return this.reqVoid("DELETE", `/sales/v1/persons/${id}`);
  }
  // ============================================================
  // ORGANIZATIONS
  // ============================================================
  /** Create a new organization in a contact base. */
  async createOrganization(contactBaseId, params) {
    return this.req(
      "POST",
      `/sales/v1/contact-bases/${contactBaseId}/organizations`,
      params
    );
  }
  /** List all organizations in a contact base. */
  async listOrganizations(contactBaseId) {
    return this.req(
      "GET",
      `/sales/v1/contact-bases/${contactBaseId}/organizations`
    );
  }
  /** Get an organization by ID. */
  async getOrganization(id) {
    return this.req("GET", `/sales/v1/organizations/${id}`);
  }
  /** Update an organization. */
  async updateOrganization(id, params) {
    return this.req(
      "PATCH",
      `/sales/v1/organizations/${id}`,
      params
    );
  }
  /** Delete an organization. */
  async deleteOrganization(id) {
    return this.reqVoid("DELETE", `/sales/v1/organizations/${id}`);
  }
};

// src/client.ts
var DEFAULT_BASE_URL = "https://api.tedo.ai/v1";
var Tedo = class {
  billing;
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
    this.sales = new SalesService({
      _request: this._request.bind(this),
      _requestVoid: this._requestVoid.bind(this),
      _transport: this._transport
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
};

// src/sales/types.ts
var ActivityType = {
  TASK: "task",
  CALL: "call",
  EMAIL: "email",
  MEETING: "meeting",
  DEADLINE: "deadline"
};
var ResourceType = {
  LEAD: "lead",
  DEAL: "deal"
};
var StageOutcome = {
  POSITIVE: "positive",
  NEGATIVE: "negative"
};
var Link = {
  /** Create a link to a lead. */
  lead: (id, primary = true) => ({
    entity_type: "lead",
    entity_id: id,
    is_primary: primary
  }),
  /** Create a link to a deal. */
  deal: (id, primary = true) => ({
    entity_type: "deal",
    entity_id: id,
    is_primary: primary
  }),
  /** Create a link to a person. */
  person: (id, primary = false) => ({
    entity_type: "person",
    entity_id: id,
    is_primary: primary
  }),
  /** Create a link to an organization. */
  organization: (id, primary = false) => ({
    entity_type: "organization",
    entity_id: id,
    is_primary: primary
  })
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActivityType,
  AuthenticationError,
  BillingService,
  HttpTransport,
  Link,
  NotFoundError,
  Page,
  PermissionError,
  RateLimitError,
  ResourceType,
  SalesService,
  StageOutcome,
  Tedo,
  TedoError,
  ValidationError,
  parseError
});
