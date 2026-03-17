// ============================================================
// PLANS
// ============================================================

export interface Plan {
  id: string;
  key: string;
  name: string;
  description?: string;
  is_active: boolean;
  prices?: Price[];
  entitlements?: Entitlement[];
  created_at: string;
  updated_at?: string;
}

export interface CreatePlanParams {
  key: string;
  name: string;
  description?: string;
}

export interface UpdatePlanParams {
  key?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

// ============================================================
// PRICES
// ============================================================

export interface Price {
  id: string;
  plan_id: string;
  key: string;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  trial_days?: number;
  created_at: string;
}

export interface CreatePriceParams {
  key: string;
  amount: number;
  currency?: string;
  interval?: string;
  interval_count?: number;
  trial_days?: number;
}

// ============================================================
// ENTITLEMENTS
// ============================================================

export interface Entitlement {
  id: string;
  plan_id: string;
  key: string;
  value_bool?: boolean;
  value_int?: number;
  overage_price?: number;
  overage_unit?: number;
  created_at: string;
}

export interface CreateEntitlementParams {
  key: string;
  value_bool?: boolean;
  value_int?: number;
  overage_price?: number;
  overage_unit?: number;
}

// ============================================================
// CUSTOMERS
// ============================================================

export interface Customer {
  id: string;
  email: string;
  name?: string;
  external_id?: string;
  metadata?: Record<string, string>;
  subscriptions?: Subscription[];
  created_at: string;
  updated_at?: string;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  external_id?: string;
  metadata?: Record<string, string>;
}

export interface UpdateCustomerParams {
  email?: string;
  name?: string;
  external_id?: string;
  metadata?: Record<string, string>;
}

export interface ListCustomersParams {
  limit?: number;
  cursor?: string;
}

// ============================================================
// SUBSCRIPTIONS
// ============================================================

export interface Subscription {
  id: string;
  customer_id: string;
  price_id: string;
  status: string;
  quantity?: number;
  started_at: string;
  canceled_at?: string;
  metadata?: Record<string, string>;
  created_at: string;
}

export interface CreateSubscriptionParams {
  customer_id: string;
  price_id: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

// ============================================================
// ENTITLEMENT CHECK
// ============================================================

export interface EntitlementCheck {
  has_access: boolean;
  value?: string;
  plan_name?: string;
}

export interface CheckEntitlementParams {
  customer_id: string;
  entitlement_key: string;
}

// ============================================================
// USAGE
// ============================================================

export interface UsageRecord {
  id: string;
  subscription_id: string;
  quantity: number;
  timestamp: string;
}

export interface RecordUsageParams {
  subscription_id: string;
  quantity: number;
  timestamp?: string;
  idempotency_key?: string;
}

export interface UsageSummary {
  subscription_id: string;
  period_start: string;
  period_end: string;
  total_usage: number;
  records: number;
}

export interface GetUsageSummaryParams {
  subscription_id: string;
}

// ============================================================
// PORTAL
// ============================================================

export interface PortalLink {
  portal_url: string;
  token: string;
  expires_at: string;
}

export interface CreatePortalLinkParams {
  expires_in_hours?: number;
}

// ============================================================
// INVOICES
// ============================================================

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_amount: number;
  amount: number;
  price_id?: string;
  plan_name?: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  subscription_id?: string;
  number?: string;
  status: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  period_start?: string;
  period_end?: string;
  due_date?: string;
  lines?: InvoiceLineItem[];
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface CreateInvoiceParams {
  customer_id: string;
  currency?: string;
  lines: Omit<InvoiceLineItem, "amount">[];
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface ListInvoicesParams {
  customer_id: string;
  limit?: number;
  offset?: number;
}

export interface InvoiceCheckoutResult {
  payment_id: string;
  invoice_id: string;
  checkout_url: string;
}

export interface CreateInvoiceCheckoutParams {
  redirect_url?: string;
}

// ============================================================
// CHECKOUT
// ============================================================

export interface CheckoutLink {
  checkout_url: string;
  token: string;
  expires_at: string;
}

export interface CreateCheckoutLinkParams {
  expires_in_hours?: number;
  expires_in_minutes?: number;
}

// ============================================================
// PAYMENTS
// ============================================================

export interface PaymentStatus {
  id: string;
  status: string;
  invoice_id?: string;
}

// ============================================================
// PAYMENT CONFIGS
// ============================================================

export interface PaymentConfig {
  id: string;
  provider: string;
  connection_id: string;
  is_default: boolean;
  payment_mode: string;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface CreatePaymentConfigParams {
  provider: string;
  connection_id: string;
  is_default?: boolean;
  settings?: Record<string, unknown>;
}

export interface UpdatePaymentConfigParams {
  provider?: string;
  connection_id?: string;
  is_default?: boolean;
  settings?: Record<string, unknown>;
}
