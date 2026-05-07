import type { RequestOptions } from "../client.js";
import { parseError } from "../errors.js";
import { Page } from "../pagination.js";
import type { Transport, TransportRequest } from "../transport.js";
import type {
  AttachFileParams,
  CreateProjectParams,
  CreateStatusParams,
  CreateWorkItemParams,
  CreateWorkItemTypeParams,
  DeleteResult,
  ListActivityParams,
  ListPageParams,
  ListProjectsParams,
  ListStatusesParams,
  ListWorkItemsParams,
  NextDisplayID,
  PeekNextDisplayIDParams,
  PriorityLevel,
  Project,
  ProjectAttachment,
  ProjectComment,
  UpdatePriorityLevelParams,
  UpdateProjectParams,
  UpdateStatusParams,
  UpdateWorkItemParams,
  UpdateWorkItemTypeParams,
  WorkItem,
  WorkItemActivity,
  WorkItemType,
  WorkflowStatus,
} from "./types.js";

type RequestFn = <T>(
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, string>,
  options?: RequestOptions,
) => Promise<T>;

type RequestVoidFn = (
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
) => Promise<void>;

interface ClientInternals {
  _request: RequestFn;
  _requestVoid: RequestVoidFn;
  _transport: Transport;
}

/** Projects service — projects, work items, workflow configuration, comments, activity, and attachments. */
export class ProjectsService {
  private req: RequestFn;
  private transport: Transport;

  /** @internal — constructed by Tedo client. */
  constructor(client: ClientInternals) {
    this.req = client._request;
    this.transport = client._transport;
  }

  async listProjects(params?: ListProjectsParams): Promise<Page<Project>> {
    return this.requestPage<Project>(
      "/projects/v1/projects",
      listProjectsQuery(params),
    );
  }

  async createProject(
    params: CreateProjectParams,
    options?: RequestOptions,
  ): Promise<Project> {
    return this.req<Project>(
      "POST",
      "/projects/v1/projects",
      params,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async getProject(projectId: string): Promise<Project> {
    return this.req<Project>(
      "GET",
      `/projects/v1/projects/${pathEscape(projectId)}`,
    );
  }

  async updateProject(
    projectId: string,
    params: UpdateProjectParams,
    options?: RequestOptions,
  ): Promise<Project> {
    return this.req<Project>(
      "PATCH",
      `/projects/v1/projects/${pathEscape(projectId)}`,
      params,
      undefined,
      options,
    );
  }

  async archiveProject(
    projectId: string,
    options?: RequestOptions,
  ): Promise<Project> {
    return this.projectAction(projectId, "archive", options);
  }

  async restoreProject(
    projectId: string,
    options?: RequestOptions,
  ): Promise<Project> {
    return this.projectAction(projectId, "restore", options);
  }

  async deleteProject(
    projectId: string,
    options?: RequestOptions,
  ): Promise<DeleteResult> {
    return this.req<DeleteResult>(
      "DELETE",
      `/projects/v1/projects/${pathEscape(projectId)}`,
      undefined,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async listProjectWorkItems(
    projectId: string,
    params?: Omit<ListWorkItemsParams, "project_id">,
  ): Promise<Page<WorkItem>> {
    return this.requestPage<WorkItem>(
      `/projects/v1/projects/${pathEscape(projectId)}/work-items`,
      workItemListQuery(params),
    );
  }

  async createProjectWorkItem(
    projectId: string,
    params: Omit<CreateWorkItemParams, "project_id">,
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.req<WorkItem>(
      "POST",
      `/projects/v1/projects/${pathEscape(projectId)}/work-items`,
      { ...params, project_id: projectId },
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async listWorkItems(params?: ListWorkItemsParams): Promise<Page<WorkItem>> {
    return this.requestPage<WorkItem>(
      "/projects/v1/work-items",
      workItemListQuery(params),
    );
  }

  async createWorkItem(
    params: CreateWorkItemParams,
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.req<WorkItem>(
      "POST",
      "/projects/v1/work-items",
      params,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async peekNextDisplayID(
    params?: PeekNextDisplayIDParams,
  ): Promise<NextDisplayID> {
    return this.req<NextDisplayID>(
      "GET",
      "/projects/v1/work-items/next-display-id",
      undefined,
      compactQuery({ work_item_type_id: params?.work_item_type_id }),
    );
  }

  async getWorkItem(workItemId: string): Promise<WorkItem> {
    return this.req<WorkItem>(
      "GET",
      `/projects/v1/work-items/${pathEscape(workItemId)}`,
    );
  }

  async updateWorkItem(
    workItemId: string,
    params: UpdateWorkItemParams,
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.req<WorkItem>(
      "PATCH",
      `/projects/v1/work-items/${pathEscape(workItemId)}`,
      params,
      undefined,
      options,
    );
  }

  async completeWorkItem(
    workItemId: string,
    completed: boolean,
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.req<WorkItem>(
      "POST",
      `/projects/v1/work-items/${pathEscape(workItemId)}/complete`,
      { completed },
      undefined,
      options,
    );
  }

  async archiveWorkItem(
    workItemId: string,
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.workItemAction(workItemId, "archive", options);
  }

  async restoreWorkItem(
    workItemId: string,
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.workItemAction(workItemId, "restore", options);
  }

  async deleteWorkItem(
    workItemId: string,
    options?: RequestOptions,
  ): Promise<DeleteResult> {
    return this.req<DeleteResult>(
      "DELETE",
      `/projects/v1/work-items/${pathEscape(workItemId)}`,
      undefined,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async listSubtasks(
    workItemId: string,
    params?: ListPageParams,
  ): Promise<Page<WorkItem>> {
    return this.requestPage<WorkItem>(
      `/projects/v1/work-items/${pathEscape(workItemId)}/subtasks`,
      pageQuery(params),
    );
  }

  async listWorkItemActivity(
    workItemId: string,
    params?: ListActivityParams,
  ): Promise<Page<WorkItemActivity>> {
    return this.requestPage<WorkItemActivity>(
      `/projects/v1/work-items/${pathEscape(workItemId)}/activity`,
      activityQuery(params),
    );
  }

  async listStatuses(
    params?: ListStatusesParams,
  ): Promise<Page<WorkflowStatus>> {
    return this.requestPage<WorkflowStatus>(
      "/projects/v1/statuses",
      compactQuery({ work_item_type_id: params?.work_item_type_id }),
    );
  }

  async createStatus(
    params: CreateStatusParams,
    options?: RequestOptions,
  ): Promise<WorkflowStatus> {
    return this.req<WorkflowStatus>(
      "POST",
      "/projects/v1/statuses",
      params,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async updateStatus(
    statusId: string,
    params: UpdateStatusParams,
    options?: RequestOptions,
  ): Promise<WorkflowStatus> {
    return this.req<WorkflowStatus>(
      "PATCH",
      `/projects/v1/statuses/${pathEscape(statusId)}`,
      params,
      undefined,
      options,
    );
  }

  async deleteStatus(
    statusId: string,
    options?: RequestOptions,
  ): Promise<DeleteResult> {
    return this.req<DeleteResult>(
      "DELETE",
      `/projects/v1/statuses/${pathEscape(statusId)}`,
      undefined,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async listWorkItemTypes(): Promise<Page<WorkItemType>> {
    return this.requestPage<WorkItemType>("/projects/v1/work-item-types");
  }

  async createWorkItemType(
    params: CreateWorkItemTypeParams,
    options?: RequestOptions,
  ): Promise<WorkItemType> {
    return this.req<WorkItemType>(
      "POST",
      "/projects/v1/work-item-types",
      params,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async updateWorkItemType(
    workItemTypeId: string,
    params: UpdateWorkItemTypeParams,
    options?: RequestOptions,
  ): Promise<WorkItemType> {
    return this.req<WorkItemType>(
      "PATCH",
      `/projects/v1/work-item-types/${pathEscape(workItemTypeId)}`,
      params,
      undefined,
      options,
    );
  }

  async deleteWorkItemType(
    workItemTypeId: string,
    options?: RequestOptions,
  ): Promise<DeleteResult> {
    return this.req<DeleteResult>(
      "DELETE",
      `/projects/v1/work-item-types/${pathEscape(workItemTypeId)}`,
      undefined,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async listPriorityLevels(): Promise<Page<PriorityLevel>> {
    return this.requestPage<PriorityLevel>("/projects/v1/priority-levels");
  }

  async updatePriorityLevel(
    level: number,
    params: UpdatePriorityLevelParams,
    options?: RequestOptions,
  ): Promise<PriorityLevel> {
    return this.req<PriorityLevel>(
      "PATCH",
      `/projects/v1/priority-levels/${level}`,
      params,
      undefined,
      options,
    );
  }

  async resetPriorityLevel(
    level: number,
    options?: RequestOptions,
  ): Promise<PriorityLevel> {
    return this.req<PriorityLevel>(
      "POST",
      `/projects/v1/priority-levels/${level}/reset`,
      undefined,
      undefined,
      options,
    );
  }

  async listComments(
    workItemId: string,
    params?: ListPageParams,
  ): Promise<Page<ProjectComment>> {
    return this.requestPage<ProjectComment>(
      `/projects/v1/work-items/${pathEscape(workItemId)}/comments`,
      pageQuery(params),
    );
  }

  async listAttachments(
    workItemId: string,
  ): Promise<Page<ProjectAttachment>> {
    return this.requestPage<ProjectAttachment>(
      `/projects/v1/work-items/${pathEscape(workItemId)}/attachments`,
    );
  }

  async attachFile(
    workItemId: string,
    params: AttachFileParams,
    options?: RequestOptions,
  ): Promise<ProjectAttachment> {
    return this.req<ProjectAttachment>(
      "POST",
      `/projects/v1/work-items/${pathEscape(workItemId)}/attachments`,
      params,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  async detachAttachment(
    workItemId: string,
    attachmentId: string,
    options?: RequestOptions,
  ): Promise<DeleteResult> {
    return this.req<DeleteResult>(
      "DELETE",
      `/projects/v1/work-items/${pathEscape(workItemId)}/attachments/${pathEscape(
        attachmentId,
      )}`,
      undefined,
      undefined,
      requiredIdempotencyOptions(options),
    );
  }

  private async projectAction(
    projectId: string,
    action: "archive" | "restore",
    options?: RequestOptions,
  ): Promise<Project> {
    return this.req<Project>(
      "POST",
      `/projects/v1/projects/${pathEscape(projectId)}/${action}`,
      undefined,
      undefined,
      options,
    );
  }

  private async workItemAction(
    workItemId: string,
    action: "archive" | "restore",
    options?: RequestOptions,
  ): Promise<WorkItem> {
    return this.req<WorkItem>(
      "POST",
      `/projects/v1/work-items/${pathEscape(workItemId)}/${action}`,
      undefined,
      undefined,
      options,
    );
  }

  private async requestPage<T>(
    path: string,
    query?: Record<string, string>,
  ): Promise<Page<T>> {
    const req: TransportRequest = { method: "GET", path, query };
    const resp = await this.transport.request(req);

    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }

    const body = resp.body as Record<string, unknown>;
    const nextCursor = (body.next_cursor as string | null | undefined) ?? null;

    return new Page<T>({
      data: (body.items ?? []) as T[],
      total: (body.total as number | undefined) ?? 0,
      nextCursor,
      transport: this.transport,
      nextRequest: req,
      dataKey: "items",
    });
  }
}

function listProjectsQuery(
  params?: ListProjectsParams,
): Record<string, string> | undefined {
  return compactQuery({
    include_archived: params?.includeArchived ? "true" : undefined,
    limit: numberParam(params?.limit),
    cursor: params?.cursor,
  });
}

function workItemListQuery(
  params?: Omit<ListWorkItemsParams, "project_id"> | ListWorkItemsParams,
): Record<string, string> | undefined {
  return compactQuery({
    project_id: (params as ListWorkItemsParams | undefined)?.project_id,
    work_item_type_id: params?.work_item_type_id,
    status_id: params?.status_id,
    parent_id: params?.parent_id,
    assignee_id: params?.assignee_id,
    priority: numberParam(params?.priority),
    include_completed: params?.includeCompleted ? "true" : undefined,
    include_archived: params?.includeArchived ? "true" : undefined,
    limit: numberParam(params?.limit),
    cursor: params?.cursor,
  });
}

function pageQuery(params?: ListPageParams): Record<string, string> | undefined {
  return compactQuery({
    limit: numberParam(params?.limit),
    cursor: params?.cursor,
  });
}

function activityQuery(
  params?: ListActivityParams,
): Record<string, string> | undefined {
  return compactQuery({
    include_subtasks: params?.includeSubtasks ? "true" : undefined,
    include_comments: params?.includeComments ? "true" : undefined,
    limit: numberParam(params?.limit),
    cursor: params?.cursor,
  });
}

function compactQuery(
  values: Record<string, string | undefined>,
): Record<string, string> | undefined {
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") {
      query[key] = value;
    }
  }
  return Object.keys(query).length ? query : undefined;
}

function numberParam(value: number | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
}

function pathEscape(value: string): string {
  return encodeURIComponent(value);
}

function requiredIdempotencyOptions(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    idempotencyKey: options?.idempotencyKey ?? newIdempotencyKey(),
  };
}

function newIdempotencyKey(): string {
  const bytes = new Uint8Array(16);
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { getRandomValues?: (array: Uint8Array) => Uint8Array };
  };

  if (cryptoLike.crypto?.getRandomValues) {
    cryptoLike.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return (
    "tedo_js_" +
    Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
  );
}
