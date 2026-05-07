import type { RequestOptions } from "../client.js";
import { Page } from "../pagination.js";
import type { Transport } from "../transport.js";
import type { AttachFileParams, CreateProjectParams, CreateStatusParams, CreateWorkItemParams, CreateWorkItemTypeParams, DeleteResult, ListActivityParams, ListPageParams, ListProjectsParams, ListStatusesParams, ListWorkItemsParams, NextDisplayID, PeekNextDisplayIDParams, PriorityLevel, Project, ProjectAttachment, ProjectComment, UpdatePriorityLevelParams, UpdateProjectParams, UpdateStatusParams, UpdateWorkItemParams, UpdateWorkItemTypeParams, WorkItem, WorkItemActivity, WorkItemType, WorkflowStatus } from "./types.js";
type RequestFn = <T>(method: string, path: string, body?: unknown, query?: Record<string, string>, options?: RequestOptions) => Promise<T>;
type RequestVoidFn = (method: string, path: string, body?: unknown, options?: RequestOptions) => Promise<void>;
interface ClientInternals {
    _request: RequestFn;
    _requestVoid: RequestVoidFn;
    _transport: Transport;
}
/** Projects service — projects, work items, workflow configuration, comments, activity, and attachments. */
export declare class ProjectsService {
    private req;
    private transport;
    /** @internal — constructed by Tedo client. */
    constructor(client: ClientInternals);
    listProjects(params?: ListProjectsParams): Promise<Page<Project>>;
    createProject(params: CreateProjectParams, options?: RequestOptions): Promise<Project>;
    getProject(projectId: string): Promise<Project>;
    updateProject(projectId: string, params: UpdateProjectParams, options?: RequestOptions): Promise<Project>;
    archiveProject(projectId: string, options?: RequestOptions): Promise<Project>;
    restoreProject(projectId: string, options?: RequestOptions): Promise<Project>;
    deleteProject(projectId: string, options?: RequestOptions): Promise<DeleteResult>;
    listProjectWorkItems(projectId: string, params?: Omit<ListWorkItemsParams, "project_id">): Promise<Page<WorkItem>>;
    createProjectWorkItem(projectId: string, params: Omit<CreateWorkItemParams, "project_id">, options?: RequestOptions): Promise<WorkItem>;
    listWorkItems(params?: ListWorkItemsParams): Promise<Page<WorkItem>>;
    createWorkItem(params: CreateWorkItemParams, options?: RequestOptions): Promise<WorkItem>;
    peekNextDisplayID(params?: PeekNextDisplayIDParams): Promise<NextDisplayID>;
    getWorkItem(workItemId: string): Promise<WorkItem>;
    updateWorkItem(workItemId: string, params: UpdateWorkItemParams, options?: RequestOptions): Promise<WorkItem>;
    completeWorkItem(workItemId: string, completed: boolean, options?: RequestOptions): Promise<WorkItem>;
    archiveWorkItem(workItemId: string, options?: RequestOptions): Promise<WorkItem>;
    restoreWorkItem(workItemId: string, options?: RequestOptions): Promise<WorkItem>;
    deleteWorkItem(workItemId: string, options?: RequestOptions): Promise<DeleteResult>;
    listSubtasks(workItemId: string, params?: ListPageParams): Promise<Page<WorkItem>>;
    listWorkItemActivity(workItemId: string, params?: ListActivityParams): Promise<Page<WorkItemActivity>>;
    listStatuses(params?: ListStatusesParams): Promise<Page<WorkflowStatus>>;
    createStatus(params: CreateStatusParams, options?: RequestOptions): Promise<WorkflowStatus>;
    updateStatus(statusId: string, params: UpdateStatusParams, options?: RequestOptions): Promise<WorkflowStatus>;
    deleteStatus(statusId: string, options?: RequestOptions): Promise<DeleteResult>;
    listWorkItemTypes(): Promise<Page<WorkItemType>>;
    createWorkItemType(params: CreateWorkItemTypeParams, options?: RequestOptions): Promise<WorkItemType>;
    updateWorkItemType(workItemTypeId: string, params: UpdateWorkItemTypeParams, options?: RequestOptions): Promise<WorkItemType>;
    deleteWorkItemType(workItemTypeId: string, options?: RequestOptions): Promise<DeleteResult>;
    listPriorityLevels(): Promise<Page<PriorityLevel>>;
    updatePriorityLevel(level: number, params: UpdatePriorityLevelParams, options?: RequestOptions): Promise<PriorityLevel>;
    resetPriorityLevel(level: number, options?: RequestOptions): Promise<PriorityLevel>;
    listComments(workItemId: string, params?: ListPageParams): Promise<Page<ProjectComment>>;
    listAttachments(workItemId: string): Promise<Page<ProjectAttachment>>;
    attachFile(workItemId: string, params: AttachFileParams, options?: RequestOptions): Promise<ProjectAttachment>;
    detachAttachment(workItemId: string, attachmentId: string, options?: RequestOptions): Promise<DeleteResult>;
    private projectAction;
    private workItemAction;
    private requestPage;
}
export {};
