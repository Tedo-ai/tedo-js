import { parseError } from "../errors.js";
import { Page } from "../pagination.js";
class BillingService {
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
    return this.req("POST", "/billing/v1/plans", params);
  }
  async listPlans() {
    return this.req("GET", "/billing/v1/plans");
  }
  async getPlan(id) {
    return this.req("GET", `/billing/v1/plans/${id}`);
  }
  async updatePlan(id, params) {
    return this.req("PATCH", `/billing/v1/plans/${id}`, params);
  }
  async deletePlan(id) {
    return this.reqVoid("DELETE", `/billing/v1/plans/${id}`);
  }
  // ============================================================
  // PRICES
  // ============================================================
  async createPrice(planId, params) {
    return this.req(
      "POST",
      `/billing/v1/plans/${planId}/prices`,
      params
    );
  }
  async listPrices(planId) {
    return this.req("GET", `/billing/v1/plans/${planId}/prices`);
  }
  async archivePrice(planId, priceId) {
    return this.reqVoid(
      "DELETE",
      `/billing/v1/plans/${planId}/prices/${priceId}`
    );
  }
  // ============================================================
  // ENTITLEMENTS
  // ============================================================
  async createEntitlement(planId, params) {
    return this.req(
      "POST",
      `/billing/v1/plans/${planId}/entitlements`,
      params
    );
  }
  async listEntitlements(planId) {
    return this.req("GET", `/billing/v1/plans/${planId}/entitlements`);
  }
  async archiveEntitlement(planId, entitlementId) {
    return this.reqVoid(
      "DELETE",
      `/billing/v1/plans/${planId}/entitlements/${entitlementId}`
    );
  }
  // ============================================================
  // CUSTOMERS
  // ============================================================
  async createCustomer(params) {
    return this.req("POST", "/billing/v1/customers", params);
  }
  async getCustomer(id) {
    return this.req("GET", `/billing/v1/customers/${id}`);
  }
  async listCustomers(params) {
    const query = {};
    if (params?.limit) query.limit = String(params.limit);
    if (params?.cursor) query.cursor = params.cursor;
    const baseReq = {
      method: "GET",
      path: "/billing/v1/customers",
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
      `/billing/v1/customers/${id}`,
      params
    );
  }
  async deleteCustomer(id) {
    return this.reqVoid("DELETE", `/billing/v1/customers/${id}`);
  }
  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================
  async createSubscription(params) {
    return this.req(
      "POST",
      "/billing/v1/subscriptions",
      params
    );
  }
  async getSubscription(id) {
    return this.req(
      "GET",
      `/billing/v1/subscriptions/${id}`
    );
  }
  async cancelSubscription(id) {
    return this.req(
      "DELETE",
      `/billing/v1/subscriptions/${id}`
    );
  }
  // ============================================================
  // ENTITLEMENT CHECK
  // ============================================================
  async checkEntitlement(params) {
    return this.req(
      "POST",
      "/billing/v1/entitlements/check",
      params
    );
  }
  // ============================================================
  // USAGE
  // ============================================================
  async recordUsage(params) {
    return this.req("POST", "/billing/v1/usage", params);
  }
  async getUsageSummary(params) {
    return this.req("GET", "/billing/v1/usage", void 0, {
      subscription_id: params.subscription_id
    });
  }
  // ============================================================
  // PORTAL
  // ============================================================
  async createPortalLink(customerId, params) {
    return this.req(
      "POST",
      `/billing/v1/customers/${customerId}/portal-link`,
      params ?? {}
    );
  }
  // ============================================================
  // INVOICES
  // ============================================================
  async listInvoices(params) {
    const query = {
      customer_id: params.customer_id
    };
    if (params.limit) query.limit = String(params.limit);
    if (params.offset) query.offset = String(params.offset);
    return this.req("GET", "/billing/v1/invoices", void 0, query);
  }
  async createInvoice(params) {
    return this.req("POST", "/billing/v1/invoices", params);
  }
  async getInvoice(id) {
    return this.req("GET", `/billing/v1/invoices/${id}`);
  }
  async createInvoiceCheckout(invoiceId, params) {
    return this.req(
      "POST",
      `/billing/v1/invoices/${invoiceId}/checkout`,
      params ?? {}
    );
  }
  // ============================================================
  // CHECKOUT
  // ============================================================
  async createCheckoutLink(subscriptionId, params) {
    return this.req(
      "POST",
      `/billing/v1/subscriptions/${subscriptionId}/checkout-link`,
      params ?? {}
    );
  }
  // ============================================================
  // PAYMENTS
  // ============================================================
  async getPaymentStatus(paymentId) {
    return this.req(
      "GET",
      `/billing/v1/payments/${paymentId}/status`
    );
  }
  // ============================================================
  // PAYMENT CONFIGS
  // ============================================================
  async createPaymentConfig(params) {
    return this.req(
      "POST",
      "/billing/v1/payment-configs",
      params
    );
  }
  async listPaymentConfigs() {
    return this.req("GET", "/billing/v1/payment-configs");
  }
  async getPaymentConfig(id) {
    return this.req(
      "GET",
      `/billing/v1/payment-configs/${id}`
    );
  }
  async updatePaymentConfig(id, params) {
    return this.req(
      "PATCH",
      `/billing/v1/payment-configs/${id}`,
      params
    );
  }
  async deletePaymentConfig(id) {
    return this.reqVoid("DELETE", `/billing/v1/payment-configs/${id}`);
  }
}
export {
  BillingService
};
//# sourceMappingURL=index.js.map
