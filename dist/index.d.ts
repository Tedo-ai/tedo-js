export { Tedo } from "./client.js";
export type { RequestOptions, TedoOptions } from "./client.js";
export type { Transport, TransportRequest, TransportResponse } from "./transport.js";
export { HttpTransport } from "./transport.js";
export { TedoError, ValidationError, AuthenticationError, PermissionError, NotFoundError, RateLimitError, parseError, } from "./errors.js";
export { Page } from "./pagination.js";
export { BillingService } from "./billing/index.js";
export type { Plan, CreatePlanParams, UpdatePlanParams, Price, CreatePriceParams, Entitlement, CreateEntitlementParams, Customer, CreateCustomerParams, UpdateCustomerParams, ListCustomersParams, Subscription, CreateSubscriptionParams, EntitlementCheck, CheckEntitlementParams, UsageRecord, RecordUsageParams, UsageSummary, GetUsageSummaryParams, PortalLink, CreatePortalLinkParams, } from "./billing/types.js";
export { SalesService } from "./sales/index.js";
export type { Pipeline, CreatePipelineParams, UpdatePipelineParams, PipelineStage, CreateStageParams, UpdateStageParams, Lead, CreateLeadParams, UpdateLeadParams, ListLeadsParams, ConvertLeadParams, Deal, CreateDealParams, UpdateDealParams, ListDealsParams, Activity, CreateActivityParams, UpdateActivityParams, ListActivitiesParams, Note, CreateNoteParams, UpdateNoteParams, ListNotesParams, ContactBase, CreateContactBaseParams, Person, CreatePersonParams, UpdatePersonParams, Organization, CreateOrganizationParams, UpdateOrganizationParams, EntityLink, } from "./sales/types.js";
export { ActivityType, ResourceType, StageOutcome, Link, } from "./sales/types.js";
export { ProjectsService } from "./projects/index.js";
export type { AttachFileParams, CreateProjectParams, CreateStatusParams, CreateWorkItemParams, CreateWorkItemTypeParams, DeleteResult, ListActivityParams, ListPageParams, ListProjectsParams, ListStatusesParams, ListWorkItemsParams, NextDisplayID, PeekNextDisplayIDParams, PriorityLevel, Project, ProjectAttachment, ProjectComment, UpdatePriorityLevelParams, UpdateProjectParams, UpdateStatusParams, UpdateWorkItemParams, UpdateWorkItemTypeParams, WorkItem, WorkItemActivity, WorkItemType, WorkflowStatus, } from "./projects/types.js";
export { ProjectPriority, ProjectStatusCategory } from "./projects/types.js";
//# sourceMappingURL=index.d.ts.map
