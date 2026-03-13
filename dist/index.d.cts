/** Request passed to a transport. */
interface TransportRequest {
    method: string;
    path: string;
    body?: unknown;
    query?: Record<string, string>;
}
/** Response returned by a transport. */
interface TransportResponse {
    status: number;
    body: unknown;
}
/** Pluggable transport interface. Layer 2 can swap this for local state reads. */
interface Transport {
    request(req: TransportRequest): Promise<TransportResponse>;
}
/** HTTP transport using native fetch. */
declare class HttpTransport implements Transport {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    request(req: TransportRequest): Promise<TransportResponse>;
}

/** A paginated response. */
declare class Page<T> {
    readonly data: T[];
    readonly total: number;
    readonly nextCursor: string | null;
    private transport;
    private nextRequest;
    private dataKey;
    constructor(opts: {
        data: T[];
        total: number;
        nextCursor: string | null;
        transport: Transport;
        nextRequest: TransportRequest | null;
        dataKey: string;
    });
    /** Whether there are more pages. */
    get hasMore(): boolean;
    /** Fetch the next page. Returns null if no more pages. */
    nextPage(): Promise<Page<T> | null>;
    /** Async iterator that yields every item across all pages. */
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

interface Plan {
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
interface CreatePlanParams {
    key: string;
    name: string;
    description?: string;
}
interface UpdatePlanParams {
    key?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
}
interface Price {
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
interface CreatePriceParams {
    key: string;
    amount: number;
    currency?: string;
    interval?: string;
    interval_count?: number;
    trial_days?: number;
}
interface Entitlement {
    id: string;
    plan_id: string;
    key: string;
    value_bool?: boolean;
    value_int?: number;
    overage_price?: number;
    overage_unit?: number;
    created_at: string;
}
interface CreateEntitlementParams {
    key: string;
    value_bool?: boolean;
    value_int?: number;
    overage_price?: number;
    overage_unit?: number;
}
interface Customer {
    id: string;
    email: string;
    name?: string;
    external_id?: string;
    metadata?: Record<string, string>;
    subscriptions?: Subscription[];
    created_at: string;
    updated_at?: string;
}
interface CreateCustomerParams {
    email: string;
    name?: string;
    external_id?: string;
    metadata?: Record<string, string>;
}
interface UpdateCustomerParams {
    email?: string;
    name?: string;
    external_id?: string;
    metadata?: Record<string, string>;
}
interface ListCustomersParams {
    limit?: number;
    cursor?: string;
}
interface Subscription {
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
interface CreateSubscriptionParams {
    customer_id: string;
    price_id: string;
    quantity?: number;
    metadata?: Record<string, string>;
}
interface EntitlementCheck {
    has_access: boolean;
    value?: string;
    plan_name?: string;
}
interface CheckEntitlementParams {
    customer_id: string;
    entitlement_key: string;
}
interface UsageRecord {
    id: string;
    subscription_id: string;
    quantity: number;
    timestamp: string;
}
interface RecordUsageParams {
    subscription_id: string;
    quantity: number;
    timestamp?: string;
    idempotency_key?: string;
}
interface UsageSummary {
    subscription_id: string;
    period_start: string;
    period_end: string;
    total_usage: number;
    records: number;
}
interface GetUsageSummaryParams {
    subscription_id: string;
}
interface PortalLink {
    portal_url: string;
    token: string;
    expires_at: string;
}
interface CreatePortalLinkParams {
    expires_in_hours?: number;
}
interface PaymentConfig {
    id: string;
    provider: string;
    connection_id: string;
    is_default: boolean;
    payment_mode: string;
    settings?: Record<string, unknown>;
    created_at: string;
    updated_at?: string;
}
interface CreatePaymentConfigParams {
    provider: string;
    connection_id: string;
    is_default?: boolean;
    settings?: Record<string, unknown>;
}
interface UpdatePaymentConfigParams {
    provider?: string;
    connection_id?: string;
    is_default?: boolean;
    settings?: Record<string, unknown>;
}

type RequestFn$1 = <T>(method: string, path: string, body?: unknown, query?: Record<string, string>) => Promise<T>;
type RequestVoidFn$1 = (method: string, path: string, body?: unknown) => Promise<void>;
/** Internal type for the transport accessor needed by pagination. */
interface ClientInternals$1 {
    _request: RequestFn$1;
    _requestVoid: RequestVoidFn$1;
    _transport: Transport;
}
/** Billing service — 23 methods covering plans, prices, entitlements,
 *  customers, subscriptions, usage, and portal links. */
declare class BillingService {
    private req;
    private reqVoid;
    private transport;
    /** @internal — constructed by Tedo client. */
    constructor(client: ClientInternals$1);
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

/** Activity type constants. */
declare const ActivityType: {
    readonly TASK: "task";
    readonly CALL: "call";
    readonly EMAIL: "email";
    readonly MEETING: "meeting";
    readonly DEADLINE: "deadline";
};
type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];
/** Pipeline resource type constants. */
declare const ResourceType: {
    readonly LEAD: "lead";
    readonly DEAL: "deal";
};
type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];
/** Stage outcome constants. */
declare const StageOutcome: {
    readonly POSITIVE: "positive";
    readonly NEGATIVE: "negative";
};
type StageOutcome = (typeof StageOutcome)[keyof typeof StageOutcome];
/** A link connecting an activity or note to a sales entity. */
interface EntityLink {
    entity_type: string;
    entity_id: string;
    is_primary?: boolean;
}
/** Helper to create typed entity links for activities and notes. */
declare const Link: {
    /** Create a link to a lead. */
    readonly lead: (id: string, primary?: boolean) => EntityLink;
    /** Create a link to a deal. */
    readonly deal: (id: string, primary?: boolean) => EntityLink;
    /** Create a link to a person. */
    readonly person: (id: string, primary?: boolean) => EntityLink;
    /** Create a link to an organization. */
    readonly organization: (id: string, primary?: boolean) => EntityLink;
};
interface Pipeline {
    id: string;
    name: string;
    resource_type: ResourceType;
    created_at: string;
    updated_at: string;
}
interface CreatePipelineParams {
    name: string;
    resource_type: ResourceType;
}
interface UpdatePipelineParams {
    name?: string;
}
interface PipelineStage {
    id: string;
    pipeline_id: string;
    name: string;
    position: number;
    is_terminal: boolean;
    outcome?: StageOutcome;
    created_at: string;
    updated_at: string;
}
interface CreateStageParams {
    name: string;
    position: number;
    is_terminal?: boolean;
    outcome?: StageOutcome;
}
interface UpdateStageParams {
    name?: string;
    position?: number;
    is_terminal?: boolean;
    outcome?: StageOutcome;
}
interface Lead {
    id: string;
    label: string;
    pipeline_id: string;
    stage_id: string;
    person_id?: string;
    organization_id?: string;
    source?: string;
    owner_id?: string;
    created_at: string;
    updated_at: string;
}
interface CreateLeadParams {
    label: string;
    pipeline_id: string;
    person_id?: string;
    organization_id?: string;
    source?: string;
}
interface UpdateLeadParams {
    label?: string;
    person_id?: string;
    organization_id?: string;
    source?: string;
}
interface ListLeadsParams {
    pipeline_id?: string;
}
interface ConvertLeadParams {
    deal_pipeline_id: string;
    deal_stage_id: string;
    deal_label?: string;
    value?: number;
    currency?: string;
}
interface Deal {
    id: string;
    label: string;
    pipeline_id: string;
    stage_id: string;
    person_id?: string;
    organization_id?: string;
    value?: number;
    currency: string;
    expected_close_date?: string;
    owner_id?: string;
    created_at: string;
    updated_at: string;
}
interface CreateDealParams {
    label: string;
    pipeline_id: string;
    person_id?: string;
    organization_id?: string;
    value?: number;
    currency?: string;
    expected_close_date?: string | Date;
}
interface UpdateDealParams {
    label?: string;
    person_id?: string;
    organization_id?: string;
    value?: number;
    currency?: string;
    expected_close_date?: string | Date;
}
interface ListDealsParams {
    pipeline_id?: string;
}
interface Activity {
    id: string;
    type: ActivityType;
    subject: string;
    description?: string;
    due_date?: string;
    due_time?: string;
    duration_minutes?: number;
    is_completed: boolean;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}
interface CreateActivityParams {
    type: ActivityType;
    subject: string;
    description?: string;
    due_date?: string | Date;
    due_time?: string;
    duration_minutes?: number;
    assigned_to_id?: string;
    links?: EntityLink[];
}
interface UpdateActivityParams {
    subject?: string;
    description?: string;
    due_date?: string | Date;
    due_time?: string;
    duration_minutes?: number;
}
interface ListActivitiesParams {
    lead_id?: string;
    deal_id?: string;
    type?: string;
}
interface Note {
    id: string;
    content: string;
    author_id?: string;
    links?: EntityLink[];
    created_at: string;
    updated_at: string;
}
interface CreateNoteParams {
    content: string;
    author_id?: string;
    links?: EntityLink[];
}
interface UpdateNoteParams {
    content: string;
}
interface ListNotesParams {
    lead_id?: string;
    deal_id?: string;
}
interface ContactBase {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}
interface Person {
    id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    owner_id?: string;
    created_at: string;
    updated_at: string;
}
interface CreatePersonParams {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
}
interface UpdatePersonParams {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
}
interface Organization {
    id: string;
    name: string;
    website?: string;
    linkedin_url?: string;
    owner_id?: string;
    created_at: string;
    updated_at: string;
}
interface CreateOrganizationParams {
    name: string;
    website?: string;
    linkedin_url?: string;
}
interface UpdateOrganizationParams {
    name?: string;
    website?: string;
    linkedin_url?: string;
}

type RequestFn = <T>(method: string, path: string, body?: unknown, query?: Record<string, string>) => Promise<T>;
type RequestVoidFn = (method: string, path: string, body?: unknown) => Promise<void>;
/** Internal type for the transport accessor needed by pagination. */
interface ClientInternals {
    _request: RequestFn;
    _requestVoid: RequestVoidFn;
    _transport: Transport;
}
/** Sales service — pipelines, stages, leads, deals, activities,
 *  notes, persons, and organizations. */
declare class SalesService {
    private req;
    private reqVoid;
    /** @internal — constructed by Tedo client. */
    constructor(client: ClientInternals);
    /** Format a Date or ISO string to YYYY-MM-DD for the API. */
    private formatDate;
    /** Create a new pipeline. */
    createPipeline(params: CreatePipelineParams): Promise<Pipeline>;
    /** List all pipelines. */
    listPipelines(): Promise<{
        pipelines: Pipeline[];
        total: number;
    }>;
    /** Get a pipeline by ID. */
    getPipeline(id: string): Promise<Pipeline>;
    /** Update a pipeline. */
    updatePipeline(id: string, params: UpdatePipelineParams): Promise<Pipeline>;
    /** Delete a pipeline. */
    deletePipeline(id: string): Promise<void>;
    /** Create a stage within a pipeline. */
    createStage(pipelineId: string, params: CreateStageParams): Promise<PipelineStage>;
    /** List all stages in a pipeline. */
    listStages(pipelineId: string): Promise<{
        stages: PipelineStage[];
        total: number;
    }>;
    /** Get a stage by ID. */
    getStage(id: string): Promise<PipelineStage>;
    /** Update a stage. */
    updateStage(id: string, params: UpdateStageParams): Promise<PipelineStage>;
    /** Delete a stage. */
    deleteStage(id: string): Promise<void>;
    /** Create a new lead. */
    createLead(params: CreateLeadParams): Promise<Lead>;
    /** List leads, optionally filtered by pipeline. */
    listLeads(params?: ListLeadsParams): Promise<{
        leads: Lead[];
        total: number;
    }>;
    /** Get a lead by ID. */
    getLead(id: string): Promise<Lead>;
    /** Update a lead. */
    updateLead(id: string, params: UpdateLeadParams): Promise<Lead>;
    /** Delete a lead. */
    deleteLead(id: string): Promise<void>;
    /** Move a lead to a different stage. */
    moveLeadStage(id: string, stageId: string): Promise<Lead>;
    /** Convert a lead into a deal. */
    convertLeadToDeal(id: string, params: ConvertLeadParams): Promise<Deal>;
    /** Create a new deal. */
    createDeal(params: CreateDealParams): Promise<Deal>;
    /** List deals, optionally filtered by pipeline. */
    listDeals(params?: ListDealsParams): Promise<{
        deals: Deal[];
        total: number;
    }>;
    /** Get a deal by ID. */
    getDeal(id: string): Promise<Deal>;
    /** Update a deal. */
    updateDeal(id: string, params: UpdateDealParams): Promise<Deal>;
    /** Delete a deal. */
    deleteDeal(id: string): Promise<void>;
    /** Move a deal to a different stage. */
    moveDealStage(id: string, stageId: string): Promise<Deal>;
    /** Create a new activity. */
    createActivity(params: CreateActivityParams): Promise<Activity>;
    /** List activities, optionally filtered by lead, deal, or type. */
    listActivities(params?: ListActivitiesParams): Promise<{
        activities: Activity[];
        total: number;
    }>;
    /** Get an activity by ID. */
    getActivity(id: string): Promise<Activity>;
    /** Update an activity. */
    updateActivity(id: string, params: UpdateActivityParams): Promise<Activity>;
    /** Delete an activity. */
    deleteActivity(id: string): Promise<void>;
    /** Mark an activity as completed or uncompleted. */
    completeActivity(id: string, completed?: boolean): Promise<Activity>;
    /** Create a new note. */
    createNote(params: CreateNoteParams): Promise<Note>;
    /** List notes, optionally filtered by lead or deal. */
    listNotes(params?: ListNotesParams): Promise<{
        notes: Note[];
        total: number;
    }>;
    /** Get a note by ID. */
    getNote(id: string): Promise<Note>;
    /** Update a note. */
    updateNote(id: string, params: UpdateNoteParams): Promise<Note>;
    /** Delete a note. */
    deleteNote(id: string): Promise<void>;
    /** List all contact bases. */
    listContactBases(): Promise<{
        contact_bases: ContactBase[];
        total: number;
    }>;
    /** Get a contact base by ID. */
    getContactBase(id: string): Promise<ContactBase>;
    /** Create a new person in a contact base. */
    createPerson(contactBaseId: string, params: CreatePersonParams): Promise<Person>;
    /** List all persons in a contact base. */
    listPersons(contactBaseId: string): Promise<{
        persons: Person[];
        total: number;
    }>;
    /** Get a person by ID. */
    getPerson(id: string): Promise<Person>;
    /** Update a person. */
    updatePerson(id: string, params: UpdatePersonParams): Promise<Person>;
    /** Delete a person. */
    deletePerson(id: string): Promise<void>;
    /** Create a new organization in a contact base. */
    createOrganization(contactBaseId: string, params: CreateOrganizationParams): Promise<Organization>;
    /** List all organizations in a contact base. */
    listOrganizations(contactBaseId: string): Promise<{
        organizations: Organization[];
        total: number;
    }>;
    /** Get an organization by ID. */
    getOrganization(id: string): Promise<Organization>;
    /** Update an organization. */
    updateOrganization(id: string, params: UpdateOrganizationParams): Promise<Organization>;
    /** Delete an organization. */
    deleteOrganization(id: string): Promise<void>;
}

interface TedoOptions {
    apiKey: string;
    baseUrl?: string;
    transport?: Transport;
}
/** Tedo API client. */
declare class Tedo {
    readonly billing: BillingService;
    readonly sales: SalesService;
    /** @internal */
    readonly _transport: Transport;
    constructor(apiKey: string);
    constructor(options: TedoOptions);
    /** @internal — sends a request and returns the parsed body. */
    _request<T>(method: string, path: string, body?: unknown, query?: Record<string, string>): Promise<T>;
    /** @internal — sends a request that returns no body (204). */
    _requestVoid(method: string, path: string, body?: unknown): Promise<void>;
}

/** Base error for all Tedo API errors. */
declare class TedoError extends Error {
    /** Machine-readable error code (e.g. "validation_error"). */
    readonly code: string;
    /** HTTP status code. */
    readonly status: number;
    /** Field that caused the error, if applicable. */
    readonly field: string | undefined;
    constructor(code: string, message: string, status: number, field?: string);
}
/** 400 Bad Request — invalid parameters. */
declare class ValidationError extends TedoError {
    constructor(code: string, message: string, field?: string);
}
/** 401 Unauthorized — invalid or missing API key. */
declare class AuthenticationError extends TedoError {
    constructor(code: string, message: string);
}
/** 403 Forbidden — insufficient permissions. */
declare class PermissionError extends TedoError {
    constructor(code: string, message: string);
}
/** 404 Not Found — resource does not exist. */
declare class NotFoundError extends TedoError {
    constructor(code: string, message: string);
}
/** 429 Too Many Requests — rate limit exceeded. */
declare class RateLimitError extends TedoError {
    constructor(code: string, message: string);
}
/** Parse an API error response into the appropriate error subclass. */
declare function parseError(status: number, body: unknown): TedoError;

export { type Activity, ActivityType, AuthenticationError, BillingService, type CheckEntitlementParams, type ContactBase, type ConvertLeadParams, type CreateActivityParams, type CreateCustomerParams, type CreateDealParams, type CreateEntitlementParams, type CreateLeadParams, type CreateNoteParams, type CreateOrganizationParams, type CreatePersonParams, type CreatePipelineParams, type CreatePlanParams, type CreatePortalLinkParams, type CreatePriceParams, type CreateStageParams, type CreateSubscriptionParams, type Customer, type Deal, type Entitlement, type EntitlementCheck, type EntityLink, type GetUsageSummaryParams, HttpTransport, type Lead, Link, type ListActivitiesParams, type ListCustomersParams, type ListDealsParams, type ListLeadsParams, type ListNotesParams, NotFoundError, type Note, type Organization, Page, PermissionError, type Person, type Pipeline, type PipelineStage, type Plan, type PortalLink, type Price, RateLimitError, type RecordUsageParams, ResourceType, SalesService, StageOutcome, type Subscription, Tedo, TedoError, type TedoOptions, type Transport, type TransportRequest, type TransportResponse, type UpdateActivityParams, type UpdateCustomerParams, type UpdateDealParams, type UpdateLeadParams, type UpdateNoteParams, type UpdateOrganizationParams, type UpdatePersonParams, type UpdatePipelineParams, type UpdatePlanParams, type UpdateStageParams, type UsageRecord, type UsageSummary, ValidationError, parseError };
