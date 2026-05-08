export const ProjectStatusCategory = {
  START: "start",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELED: "canceled",
} as const;
export type ProjectStatusCategory =
  (typeof ProjectStatusCategory)[keyof typeof ProjectStatusCategory];

export const ProjectPriority = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
} as const;
export type ProjectPriority =
  (typeof ProjectPriority)[keyof typeof ProjectPriority];

export interface Project {
  id: string;
  team_id: string | null;
  name: string;
  description: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkItem {
  id: string;
  display_id: string;
  sequence_number: number;
  project_id: string | null;
  team_id: string | null;
  parent_id: string | null;
  work_item_type_id: string | null;
  status_id: string | null;
  title: string;
  description: string;
  completed_at: string | null;
  archived_at: string | null;
  assignee_id: string | null;
  priority: number | null;
  due_date: string | null;
  position: number | null;
  child_count: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStatus {
  id: string;
  work_item_type_id: string | null;
  name: string;
  category: ProjectStatusCategory | string;
  position: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkItemType {
  id: string;
  name: string;
  singular_name: string;
  plural_name: string;
  parent_type_id: string;
  prefix: string;
  color: string;
  position: number;
  show_in_sidebar: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriorityLevel {
  id: string;
  level: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectComment {
  id: string;
  work_item_id: string;
  actor_type: string;
  actor_ref: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WorkItemActivity {
  id: string;
  actor_type: string;
  actor_ref: string;
  action: string;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface ProjectAttachment {
  id: string;
  work_item_id: string;
  file_id: string;
  position: number;
  filename: string;
  mime_type: string;
  size: number;
  title: string;
  alt_text: string;
  created_at: string;
  actor_type: string | null;
  created_by_ref: string | null;
}

export interface DeleteResult {
  deleted: boolean;
  id: string;
}

export interface NextDisplayID {
  display_id: string;
}

export interface ListProjectsParams {
  includeArchived?: boolean;
  limit?: number;
  cursor?: string;
}

export interface CreateProjectParams {
  name: string;
  description?: string;
  team_id?: string | null;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string | null;
  team_id?: string | null;
}

export interface ListWorkItemsParams {
  project_id?: string;
  work_item_type_id?: string;
  status_id?: string;
  parent_id?: string;
  assignee_id?: string;
  priority?: number;
  includeCompleted?: boolean;
  includeArchived?: boolean;
  limit?: number;
  cursor?: string;
}

export interface ListPageParams {
  limit?: number;
  cursor?: string;
}

export interface ListActivityParams extends ListPageParams {
  includeSubtasks?: boolean;
  includeComments?: boolean;
}

export interface CreateWorkItemParams {
  project_id?: string | null;
  team_id?: string | null;
  parent_id?: string | null;
  work_item_type_id?: string | null;
  status_id?: string | null;
  title: string;
  description?: string;
  assignee_id?: string | null;
  priority?: number | null;
  due_date?: string | null;
  position?: number | null;
}

export interface UpdateWorkItemParams {
  project_id?: string | null;
  team_id?: string | null;
  parent_id?: string | null;
  work_item_type_id?: string | null;
  status_id?: string | null;
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  priority?: number | null;
  due_date?: string | null;
  position?: number | null;
}

export interface PeekNextDisplayIDParams {
  work_item_type_id?: string;
}

export interface ListStatusesParams {
  work_item_type_id?: string;
}

export interface CreateStatusParams {
  work_item_type_id?: string | null;
  name: string;
  category: ProjectStatusCategory | string;
  position?: number;
  is_default?: boolean;
}

export interface UpdateStatusParams {
  work_item_type_id?: string | null;
  name?: string;
  category?: ProjectStatusCategory | string;
  position?: number;
  is_default?: boolean;
}

export interface CreateWorkItemTypeParams {
  name: string;
  singular_name?: string;
  plural_name?: string;
  parent_type_id?: string | null;
  prefix?: string;
  color?: string;
  position?: number;
  show_in_sidebar?: boolean;
}

export interface UpdateWorkItemTypeParams {
  name?: string;
  singular_name?: string | null;
  plural_name?: string | null;
  parent_type_id?: string | null;
  prefix?: string | null;
  color?: string | null;
  position?: number;
  show_in_sidebar?: boolean;
}

export interface UpdatePriorityLevelParams {
  name?: string;
  icon?: string;
}

export interface AttachFileParams {
  file_id: string;
  display_name?: string;
}
