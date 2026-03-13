import type { Transport } from "../transport.js";
import { Page } from "../pagination.js";
import type { Plan, CreatePlanParams, UpdatePlanParams, Price, CreatePriceParams, Entitlement, CreateEntitlementParams, Customer, CreateCustomerParams, UpdateCustomerParams, ListCustomersParams, Subscription, CreateSubscriptionParams, EntitlementCheck, CheckEntitlementParams, UsageRecord, RecordUsageParams, UsageSummary, GetUsageSummaryParams, PortalLink, CreatePortalLinkParams, PaymentConfig, CreatePaymentConfigParams, UpdatePaymentConfigParams } from "./types.js";
type RequestFn = <T>(method: string, path: string, body?: unknown, query?: Record<string, string>) => Promise<T>;
type RequestVoidFn = (method: string, path: string, body?: unknown) => Promise<void>;
/** Internal type for the transport accessor needed by pagination. */
interface ClientInternals {
    _request: RequestFn;
    _requestVoid: RequestVoidFn;
    _transport: Transport;
}
/** Billing service — 23 methods covering plans, prices, entitlements,
 *  customers, subscriptions, usage, and portal links. */
export declare class BillingService {
    private req;
    private reqVoid;
    private transport;
    /** @internal — constructed by Tedo client. */
    constructor(client: ClientInternals);
    createPlan(params: CreatePlanParams): Promise<Plan>;
    listPlans(): Promise<{
        plans: Plan[];
        total: number;
    }>;
    getPlan(id: string): Promise<Plan>;
    updatePlan(id: string, params: UpdatePlanParams): Promise<Plan>;
    deletePlan(id: string): Promise<void>;
    createPrice(planId: string, params: CreatePriceParams): Promise<Price>;
    listPrices(planId: string): Promise<{
        prices: Price[];
        total: number;
    }>;
    archivePrice(planId: string, priceId: string): Promise<void>;
    createEntitlement(planId: string, params: CreateEntitlementParams): Promise<Entitlement>;
    listEntitlements(planId: string): Promise<{
        entitlements: Entitlement[];
        total: number;
    }>;
    archiveEntitlement(planId: string, entitlementId: string): Promise<void>;
    createCustomer(params: CreateCustomerParams): Promise<Customer>;
    getCustomer(id: string): Promise<Customer>;
    listCustomers(params?: ListCustomersParams): Promise<Page<Customer>>;
    updateCustomer(id: string, params: UpdateCustomerParams): Promise<Customer>;
    deleteCustomer(id: string): Promise<void>;
    createSubscription(params: CreateSubscriptionParams): Promise<Subscription>;
    getSubscription(id: string): Promise<Subscription>;
    cancelSubscription(id: string): Promise<Subscription>;
    checkEntitlement(params: CheckEntitlementParams): Promise<EntitlementCheck>;
    recordUsage(params: RecordUsageParams): Promise<UsageRecord>;
    getUsageSummary(params: GetUsageSummaryParams): Promise<UsageSummary>;
    createPortalLink(customerId: string, params?: CreatePortalLinkParams): Promise<PortalLink>;
    createPaymentConfig(params: CreatePaymentConfigParams): Promise<PaymentConfig>;
    listPaymentConfigs(): Promise<{
        payment_configs: PaymentConfig[];
        total: number;
    }>;
    getPaymentConfig(id: string): Promise<PaymentConfig>;
    updatePaymentConfig(id: string, params: UpdatePaymentConfigParams): Promise<PaymentConfig>;
    deletePaymentConfig(id: string): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map