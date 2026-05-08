import { parseError } from "../errors.js";
import { Page } from "../pagination.js";
class ProjectsService {
  req;
  transport;
  /** @internal — constructed by Tedo client. */
  constructor(client) {
    this.req = client._request;
    this.transport = client._transport;
  }
  async listProjects(params) {
    return this.requestPage(
      "/projects/v1/projects",
      listProjectsQuery(params)
    );
  }
  async createProject(params, options) {
    return this.req(
      "POST",
      "/projects/v1/projects",
      params,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async getProject(projectId) {
    return this.req(
      "GET",
      `/projects/v1/projects/${pathEscape(projectId)}`
    );
  }
  async updateProject(projectId, params, options) {
    return this.req(
      "PATCH",
      `/projects/v1/projects/${pathEscape(projectId)}`,
      params,
      void 0,
      options
    );
  }
  async archiveProject(projectId, options) {
    return this.projectAction(projectId, "archive", options);
  }
  async restoreProject(projectId, options) {
    return this.projectAction(projectId, "restore", options);
  }
  async deleteProject(projectId, options) {
    return this.req(
      "DELETE",
      `/projects/v1/projects/${pathEscape(projectId)}`,
      void 0,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async listProjectWorkItems(projectId, params) {
    return this.requestPage(
      `/projects/v1/projects/${pathEscape(projectId)}/work-items`,
      workItemListQuery(params)
    );
  }
  async createProjectWorkItem(projectId, params, options) {
    return this.req(
      "POST",
      `/projects/v1/projects/${pathEscape(projectId)}/work-items`,
      { ...params, project_id: projectId },
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async listWorkItems(params) {
    return this.requestPage(
      "/projects/v1/work-items",
      workItemListQuery(params)
    );
  }
  async createWorkItem(params, options) {
    return this.req(
      "POST",
      "/projects/v1/work-items",
      params,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async peekNextDisplayID(params) {
    return this.req(
      "GET",
      "/projects/v1/work-items/next-display-id",
      void 0,
      compactQuery({ work_item_type_id: params?.work_item_type_id })
    );
  }
  async getWorkItem(workItemId) {
    return this.req(
      "GET",
      `/projects/v1/work-items/${pathEscape(workItemId)}`
    );
  }
  async updateWorkItem(workItemId, params, options) {
    return this.req(
      "PATCH",
      `/projects/v1/work-items/${pathEscape(workItemId)}`,
      params,
      void 0,
      options
    );
  }
  async completeWorkItem(workItemId, completed, options) {
    return this.req(
      "POST",
      `/projects/v1/work-items/${pathEscape(workItemId)}/complete`,
      { completed },
      void 0,
      options
    );
  }
  async archiveWorkItem(workItemId, options) {
    return this.workItemAction(workItemId, "archive", options);
  }
  async restoreWorkItem(workItemId, options) {
    return this.workItemAction(workItemId, "restore", options);
  }
  async deleteWorkItem(workItemId, options) {
    return this.req(
      "DELETE",
      `/projects/v1/work-items/${pathEscape(workItemId)}`,
      void 0,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async listSubtasks(workItemId, params) {
    return this.requestPage(
      `/projects/v1/work-items/${pathEscape(workItemId)}/subtasks`,
      pageQuery(params)
    );
  }
  async listWorkItemActivity(workItemId, params) {
    return this.requestPage(
      `/projects/v1/work-items/${pathEscape(workItemId)}/activity`,
      activityQuery(params)
    );
  }
  async listStatuses(params) {
    return this.requestPage(
      "/projects/v1/statuses",
      compactQuery({ work_item_type_id: params?.work_item_type_id })
    );
  }
  async createStatus(params, options) {
    return this.req(
      "POST",
      "/projects/v1/statuses",
      params,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async updateStatus(statusId, params, options) {
    return this.req(
      "PATCH",
      `/projects/v1/statuses/${pathEscape(statusId)}`,
      params,
      void 0,
      options
    );
  }
  async deleteStatus(statusId, options) {
    return this.req(
      "DELETE",
      `/projects/v1/statuses/${pathEscape(statusId)}`,
      void 0,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async listWorkItemTypes() {
    return this.requestPage("/projects/v1/work-item-types");
  }
  async createWorkItemType(params, options) {
    return this.req(
      "POST",
      "/projects/v1/work-item-types",
      params,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async updateWorkItemType(workItemTypeId, params, options) {
    return this.req(
      "PATCH",
      `/projects/v1/work-item-types/${pathEscape(workItemTypeId)}`,
      params,
      void 0,
      options
    );
  }
  async deleteWorkItemType(workItemTypeId, options) {
    return this.req(
      "DELETE",
      `/projects/v1/work-item-types/${pathEscape(workItemTypeId)}`,
      void 0,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async listPriorityLevels() {
    return this.requestPage("/projects/v1/priority-levels");
  }
  async updatePriorityLevel(level, params, options) {
    return this.req(
      "PATCH",
      `/projects/v1/priority-levels/${level}`,
      params,
      void 0,
      options
    );
  }
  async resetPriorityLevel(level, options) {
    return this.req(
      "POST",
      `/projects/v1/priority-levels/${level}/reset`,
      void 0,
      void 0,
      options
    );
  }
  async listComments(workItemId, params) {
    return this.requestPage(
      `/projects/v1/work-items/${pathEscape(workItemId)}/comments`,
      pageQuery(params)
    );
  }
  async listAttachments(workItemId) {
    return this.requestPage(
      `/projects/v1/work-items/${pathEscape(workItemId)}/attachments`
    );
  }
  async attachFile(workItemId, params, options) {
    return this.req(
      "POST",
      `/projects/v1/work-items/${pathEscape(workItemId)}/attachments`,
      params,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async detachAttachment(workItemId, attachmentId, options) {
    return this.req(
      "DELETE",
      `/projects/v1/work-items/${pathEscape(workItemId)}/attachments/${pathEscape(
        attachmentId
      )}`,
      void 0,
      void 0,
      requiredIdempotencyOptions(options)
    );
  }
  async projectAction(projectId, action, options) {
    return this.req(
      "POST",
      `/projects/v1/projects/${pathEscape(projectId)}/${action}`,
      void 0,
      void 0,
      options
    );
  }
  async workItemAction(workItemId, action, options) {
    return this.req(
      "POST",
      `/projects/v1/work-items/${pathEscape(workItemId)}/${action}`,
      void 0,
      void 0,
      options
    );
  }
  async requestPage(path, query) {
    const req = { method: "GET", path, query };
    const resp = await this.transport.request(req);
    if (resp.status >= 400) {
      throw parseError(resp.status, resp.body);
    }
    const body = resp.body;
    const nextCursor = body.next_cursor ?? null;
    return new Page({
      data: body.items ?? [],
      total: body.total ?? 0,
      nextCursor,
      transport: this.transport,
      nextRequest: req,
      dataKey: "items"
    });
  }
}
function listProjectsQuery(params) {
  return compactQuery({
    include_archived: params?.includeArchived ? "true" : void 0,
    limit: numberParam(params?.limit),
    cursor: params?.cursor
  });
}
function workItemListQuery(params) {
  return compactQuery({
    project_id: params?.project_id,
    work_item_type_id: params?.work_item_type_id,
    status_id: params?.status_id,
    parent_id: params?.parent_id,
    assignee_id: params?.assignee_id,
    priority: numberParam(params?.priority),
    include_completed: params?.includeCompleted ? "true" : void 0,
    include_archived: params?.includeArchived ? "true" : void 0,
    limit: numberParam(params?.limit),
    cursor: params?.cursor
  });
}
function pageQuery(params) {
  return compactQuery({
    limit: numberParam(params?.limit),
    cursor: params?.cursor
  });
}
function activityQuery(params) {
  return compactQuery({
    include_subtasks: params?.includeSubtasks ? "true" : void 0,
    include_comments: params?.includeComments ? "true" : void 0,
    limit: numberParam(params?.limit),
    cursor: params?.cursor
  });
}
function compactQuery(values) {
  const query = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== void 0 && value !== "") {
      query[key] = value;
    }
  }
  return Object.keys(query).length ? query : void 0;
}
function numberParam(value) {
  return value === void 0 ? void 0 : String(value);
}
function pathEscape(value) {
  return encodeURIComponent(value);
}
function requiredIdempotencyOptions(options) {
  return {
    ...options,
    idempotencyKey: options?.idempotencyKey ?? newIdempotencyKey()
  };
}
function newIdempotencyKey() {
  const bytes = new Uint8Array(16);
  const cryptoLike = globalThis;
  if (cryptoLike.crypto?.getRandomValues) {
    cryptoLike.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return "tedo_js_" + Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export {
  ProjectsService
};
//# sourceMappingURL=index.js.map
