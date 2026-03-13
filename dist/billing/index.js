import { parseError } from "../errors.js";
import { Page } from "../pagination.js";
/** Billing service — 23 methods covering plans, prices, entitlements,
 *  customers, subscriptions, usage, and portal links. */
export class BillingService {
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
        return this.req("POST", `/billing/plans/${planId}/prices`, params);
    }
    async listPrices(planId) {
        return this.req("GET", `/billing/plans/${planId}/prices`);
    }
    async archivePrice(planId, priceId) {
        return this.reqVoid("DELETE", `/billing/plans/${planId}/prices/${priceId}`);
    }
    // ============================================================
    // ENTITLEMENTS
    // ============================================================
    async createEntitlement(planId, params) {
        return this.req("POST", `/billing/plans/${planId}/entitlements`, params);
    }
    async listEntitlements(planId) {
        return this.req("GET", `/billing/plans/${planId}/entitlements`);
    }
    async archiveEntitlement(planId, entitlementId) {
        return this.reqVoid("DELETE", `/billing/plans/${planId}/entitlements/${entitlementId}`);
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
        if (params?.limit)
            query.limit = String(params.limit);
        if (params?.cursor)
            query.cursor = params.cursor;
        const baseReq = {
            method: "GET",
            path: "/billing/customers",
            query,
        };
        const resp = await this.transport.request(baseReq);
        if (resp.status >= 400) {
            throw parseError(resp.status, resp.body);
        }
        const body = resp.body;
        const customers = (body.customers ?? []);
        const total = body.total ?? 0;
        const nextCursor = body.next_cursor ?? null;
        return new Page({
            data: customers,
            total,
            nextCursor,
            transport: this.transport,
            nextRequest: baseReq,
            dataKey: "customers",
        });
    }
    async updateCustomer(id, params) {
        return this.req("PATCH", `/billing/customers/${id}`, params);
    }
    async deleteCustomer(id) {
        return this.reqVoid("DELETE", `/billing/customers/${id}`);
    }
    // ============================================================
    // SUBSCRIPTIONS
    // ============================================================
    async createSubscription(params) {
        return this.req("POST", "/billing/subscriptions", params);
    }
    async getSubscription(id) {
        return this.req("GET", `/billing/subscriptions/${id}`);
    }
    async cancelSubscription(id) {
        return this.req("DELETE", `/billing/subscriptions/${id}`);
    }
    // ============================================================
    // ENTITLEMENT CHECK
    // ============================================================
    async checkEntitlement(params) {
        return this.req("POST", "/billing/entitlements/check", params);
    }
    // ============================================================
    // USAGE
    // ============================================================
    async recordUsage(params) {
        return this.req("POST", "/billing/usage", params);
    }
    async getUsageSummary(params) {
        return this.req("GET", "/billing/usage", undefined, {
            subscription_id: params.subscription_id,
        });
    }
    // ============================================================
    // PORTAL
    // ============================================================
    async createPortalLink(customerId, params) {
        return this.req("POST", `/billing/customers/${customerId}/portal-link`, params ?? {});
    }
    // ============================================================
    // PAYMENT CONFIGS
    // ============================================================
    async createPaymentConfig(params) {
        return this.req("POST", "/billing/payment-configs", params);
    }
    async listPaymentConfigs() {
        return this.req("GET", "/billing/payment-configs");
    }
    async getPaymentConfig(id) {
        return this.req("GET", `/billing/payment-configs/${id}`);
    }
    async updatePaymentConfig(id, params) {
        return this.req("PATCH", `/billing/payment-configs/${id}`, params);
    }
    async deletePaymentConfig(id) {
        return this.reqVoid("DELETE", `/billing/payment-configs/${id}`);
    }
}
//# sourceMappingURL=index.js.map