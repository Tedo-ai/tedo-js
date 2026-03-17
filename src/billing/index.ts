import type { Transport, TransportRequest } from "../transport.js";
import { parseError } from "../errors.js";
import { Page } from "../pagination.js";
import type {
  Plan,
  CreatePlanParams,
  UpdatePlanParams,
  Price,
  CreatePriceParams,
  Entitlement,
  CreateEntitlementParams,
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListCustomersParams,
  Subscription,
  CreateSubscriptionParams,
  EntitlementCheck,
  CheckEntitlementParams,
  UsageRecord,
  RecordUsageParams,
  UsageSummary,
  GetUsageSummaryParams,
  PortalLink,
  CreatePortalLinkParams,
  Invoice,
  CreateInvoiceParams,
  ListInvoicesParams,
  InvoiceCheckoutResult,
  CreateInvoiceCheckoutParams,
  CheckoutLink,
  CreateCheckoutLinkParams,
  PaymentStatus,
  PaymentConfig,
  CreatePaymentConfigParams,
  UpdatePaymentConfigParams,
} from "./types.js";

type RequestFn = <T>(
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, string>,
) => Promise<T>;

type RequestVoidFn = (
  method: string,
  path: string,
  body?: unknown,
) => Promise<void>;

/** Internal type for the transport accessor needed by pagination. */
interface ClientInternals {
  _request: RequestFn;
  _requestVoid: RequestVoidFn;
  _transport: Transport;
}

/** Billing service covering plans, prices, entitlements, customers,
 *  subscriptions, invoices, checkout, payments, usage, and portal links. */
export class BillingService {
  private req: RequestFn;
  private reqVoid: RequestVoidFn;
  private transport: Transport;

  /** @internal — constructed by Tedo client. */
  constructor(client: ClientInternals) {
    this.req = client._request;
    this.reqVoid = client._requestVoid;
    this.transport = client._transport;
  }

  // ============================================================
  // PLANS
  // ============================================================

  async createPlan(params: CreatePlanParams): Promise<Plan> {
    return this.req<Plan>("POST", "/billing/plans", params);
  }

  async listPlans(): Promise<{ plans: Plan[]; total: number }> {
    return this.req("GET", "/billing/plans");
  }

  async getPlan(id: string): Promise<Plan> {
    return this.req<Plan>("GET", `/billing/plans/${id}`);
  }

  async updatePlan(id: string, params: UpdatePlanParams): Promise<Plan> {
    return this.req<Plan>("PATCH", `/billing/plans/${id}`, params);
  }

  async deletePlan(id: string): Promise<void> {
    return this.reqVoid("DELETE", `/billing/plans/${id}`);
  }

  // ============================================================
  // PRICES
  // ============================================================

  async createPrice(planId: string, params: CreatePriceParams): Promise<Price> {
    return this.req<Price>(
      "POST",
      `/billing/plans/${planId}/prices`,
      params,
    );
  }

  async listPrices(
    planId: string,
  ): Promise<{ prices: Price[]; total: number }> {
    return this.req("GET", `/billing/plans/${planId}/prices`);
  }

  async archivePrice(planId: string, priceId: string): Promise<void> {
    return this.reqVoid(
      "DELETE",
      `/billing/plans/${planId}/prices/${priceId}`,
    );
  }

  // ============================================================
  // ENTITLEMENTS
  // ============================================================

  async createEntitlement(
    planId: string,
    params: CreateEntitlementParams,
  ): Promise<Entitlement> {
    return this.req<Entitlement>(
      "POST",
      `/billing/plans/${planId}/entitlements`,
      params,
    );
  }

  async listEntitlements(
    planId: string,
  ): Promise<{ entitlements: Entitlement[]; total: number }> {
    return this.req("GET", `/billing/plans/${planId}/entitlements`);
  }

  async archiveEntitlement(
    planId: string,
    entitlementId: string,
  ): Promise<void> {
    return this.reqVoid(
      "DELETE",
      `/billing/plans/${planId}/entitlements/${entitlementId}`,
    );
  }

  // ============================================================
  // CUSTOMERS
  // ============================================================

  async createCustomer(params: CreateCustomerParams): Promise<Customer> {
    return this.req<Customer>("POST", "/billing/customers", params);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.req<Customer>("GET", `/billing/customers/${id}`);
  }

  async listCustomers(params?: ListCustomersParams): Promise<Page<Customer>> {
    const query: Record<string, string> = {};
    if (params?.limit) query.limit = String(params.limit);
    if (params?.cursor) query.cursor = params.cursor;

    const baseReq: TransportRequest = {
      method: "GET",
      path: "/billing/customers",
      query,
    };

    const resp = await this.transport.request(baseReq);

    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }

    const body = resp.body as Record<string, unknown>;
    const customers = (body.customers ?? []) as Customer[];
    const total = (body.total as number) ?? 0;
    const nextCursor = (body.next_cursor as string) ?? null;

    return new Page<Customer>({
      data: customers,
      total,
      nextCursor,
      transport: this.transport,
      nextRequest: baseReq,
      dataKey: "customers",
    });
  }

  async updateCustomer(
    id: string,
    params: UpdateCustomerParams,
  ): Promise<Customer> {
    return this.req<Customer>(
      "PATCH",
      `/billing/customers/${id}`,
      params,
    );
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.reqVoid("DELETE", `/billing/customers/${id}`);
  }

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  async createSubscription(
    params: CreateSubscriptionParams,
  ): Promise<Subscription> {
    return this.req<Subscription>(
      "POST",
      "/billing/subscriptions",
      params,
    );
  }

  async getSubscription(id: string): Promise<Subscription> {
    return this.req<Subscription>(
      "GET",
      `/billing/subscriptions/${id}`,
    );
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.req<Subscription>(
      "DELETE",
      `/billing/subscriptions/${id}`,
    );
  }

  // ============================================================
  // ENTITLEMENT CHECK
  // ============================================================

  async checkEntitlement(
    params: CheckEntitlementParams,
  ): Promise<EntitlementCheck> {
    return this.req<EntitlementCheck>(
      "POST",
      "/billing/entitlements/check",
      params,
    );
  }

  // ============================================================
  // USAGE
  // ============================================================

  async recordUsage(params: RecordUsageParams): Promise<UsageRecord> {
    return this.req<UsageRecord>("POST", "/billing/usage", params);
  }

  async getUsageSummary(
    params: GetUsageSummaryParams,
  ): Promise<UsageSummary> {
    return this.req<UsageSummary>("GET", "/billing/usage", undefined, {
      subscription_id: params.subscription_id,
    });
  }

  // ============================================================
  // PORTAL
  // ============================================================

  async createPortalLink(
    customerId: string,
    params?: CreatePortalLinkParams,
  ): Promise<PortalLink> {
    return this.req<PortalLink>(
      "POST",
      `/billing/customers/${customerId}/portal-link`,
      params ?? {},
    );
  }

  // ============================================================
  // INVOICES
  // ============================================================

  async listInvoices(
    params: ListInvoicesParams,
  ): Promise<{ invoices: Invoice[]; total: number }> {
    const query: Record<string, string> = {
      customer_id: params.customer_id,
    };
    if (params.limit) query.limit = String(params.limit);
    if (params.offset) query.offset = String(params.offset);

    return this.req("GET", "/billing/invoices", undefined, query);
  }

  async createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    return this.req<Invoice>("POST", "/billing/invoices", params);
  }

  async getInvoice(id: string): Promise<Invoice> {
    return this.req<Invoice>("GET", `/billing/invoices/${id}`);
  }

  async createInvoiceCheckout(
    invoiceId: string,
    params?: CreateInvoiceCheckoutParams,
  ): Promise<InvoiceCheckoutResult> {
    return this.req<InvoiceCheckoutResult>(
      "POST",
      `/billing/invoices/${invoiceId}/checkout`,
      params ?? {},
    );
  }

  // ============================================================
  // CHECKOUT
  // ============================================================

  async createCheckoutLink(
    subscriptionId: string,
    params?: CreateCheckoutLinkParams,
  ): Promise<CheckoutLink> {
    return this.req<CheckoutLink>(
      "POST",
      `/billing/subscriptions/${subscriptionId}/checkout-link`,
      params ?? {},
    );
  }

  // ============================================================
  // PAYMENTS
  // ============================================================

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.req<PaymentStatus>(
      "GET",
      `/billing/payments/${paymentId}/status`,
    );
  }

  // ============================================================
  // PAYMENT CONFIGS
  // ============================================================

  async createPaymentConfig(
    params: CreatePaymentConfigParams,
  ): Promise<PaymentConfig> {
    return this.req<PaymentConfig>(
      "POST",
      "/billing/payment-configs",
      params,
    );
  }

  async listPaymentConfigs(): Promise<{
    payment_configs: PaymentConfig[];
    total: number;
  }> {
    return this.req("GET", "/billing/payment-configs");
  }

  async getPaymentConfig(id: string): Promise<PaymentConfig> {
    return this.req<PaymentConfig>(
      "GET",
      `/billing/payment-configs/${id}`,
    );
  }

  async updatePaymentConfig(
    id: string,
    params: UpdatePaymentConfigParams,
  ): Promise<PaymentConfig> {
    return this.req<PaymentConfig>(
      "PATCH",
      `/billing/payment-configs/${id}`,
      params,
    );
  }

  async deletePaymentConfig(id: string): Promise<void> {
    return this.reqVoid("DELETE", `/billing/payment-configs/${id}`);
  }
}
