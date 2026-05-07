import { describe, expect, it } from "vitest";
import { PermissionError, ProjectPriority, TedoError } from "../src/index.js";
import { createTestClient } from "./helpers.js";

describe("ProjectsService", () => {
  it("is initialized on the root client", () => {
    const { client } = createTestClient();
    expect(client.projects).toBeDefined();
  });

  it("createProject sends POST /projects/v1/projects with an idempotency key header", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(201, {
      id: "proj-1",
      team_id: null,
      name: "Launch",
      description: "Q2",
      archived: false,
      created_at: "2026-05-08T00:00:00Z",
      updated_at: "2026-05-08T00:00:00Z",
    });

    const project = await client.projects.createProject({
      name: "Launch",
      description: "Q2",
    });

    expect(project.id).toBe("proj-1");
    expect(transport.lastRequest.method).toBe("POST");
    expect(transport.lastRequest.path).toBe("/projects/v1/projects");
    expect(transport.lastRequest.headers?.["Idempotency-Key"]).toMatch(
      /^tedo_js_[a-f0-9]{32}$/,
    );
    expect(transport.lastRequest.body).toEqual({
      name: "Launch",
      description: "Q2",
    });
  });

  it("lets per-call request options override generated idempotency and set request ID", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(200, { deleted: true, id: "proj-1" });

    const result = await client.projects.deleteProject("proj-1", {
      idempotencyKey: "idem_123",
      requestId: "req_123",
    });

    expect(result.deleted).toBe(true);
    expect(transport.lastRequest.headers).toEqual({
      "Idempotency-Key": "idem_123",
      "X-Request-ID": "req_123",
    });
  });

  it("listWorkItems encodes cursor filters using the public API query names", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(200, {
      items: [],
      next_cursor: null,
      has_more: false,
    });

    const page = await client.projects.listWorkItems({
      project_id: "proj-1",
      status_id: "status-1",
      priority: ProjectPriority.MEDIUM,
      includeCompleted: true,
      includeArchived: true,
      limit: 50,
      cursor: "eyJvZmZzZXQiOjUwfQ",
    });

    expect(page.items).toEqual([]);
    expect(page.hasMore).toBe(false);
    expect(transport.lastRequest.path).toBe("/projects/v1/work-items");
    expect(transport.lastRequest.query).toEqual({
      project_id: "proj-1",
      status_id: "status-1",
      priority: "2",
      include_completed: "true",
      include_archived: "true",
      limit: "50",
      cursor: "eyJvZmZzZXQiOjUwfQ",
    });
  });

  it("supports async iteration over Projects cursor pages", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(200, {
      items: [{ id: "proj-1", name: "One" }],
      next_cursor: "cursor-2",
      has_more: true,
    });
    transport.enqueue(200, {
      items: [{ id: "proj-2", name: "Two" }],
      next_cursor: null,
      has_more: false,
    });

    const seen: string[] = [];
    const page = await client.projects.listProjects({ limit: 1 });
    for await (const project of page) {
      seen.push(project.id);
    }

    expect(seen).toEqual(["proj-1", "proj-2"]);
    expect(transport.requests[1].query).toEqual({
      limit: "1",
      cursor: "cursor-2",
    });
  });

  it("uses the read-only comments endpoint and opaque actor fields", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(200, {
      items: [
        {
          id: "comment-1",
          work_item_id: "work-1",
          actor_type: "api_key",
          actor_ref: "api_key:key-1",
          content: "ready",
          created_at: "2026-05-08T00:00:00Z",
          updated_at: "2026-05-08T00:00:00Z",
        },
      ],
      has_more: false,
      next_cursor: null,
    });

    const comments = await client.projects.listComments("work-1");

    expect(comments.items[0].actor_ref).toBe("api_key:key-1");
    expect(transport.lastRequest.method).toBe("GET");
    expect(transport.lastRequest.path).toBe(
      "/projects/v1/work-items/work-1/comments",
    );
  });

  it("parses canonical Projects error details and request ID", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(403, {
      code: "permission_denied",
      message: "API key lacks projects.projects.write",
      details: { permission: "projects.projects.write" },
      request_id: "req_123",
    });

    try {
      await client.projects.createProject({ name: "Denied" });
      throw new Error("expected createProject to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(PermissionError);
      const apiErr = err as TedoError;
      expect(apiErr.code).toBe("permission_denied");
      expect(apiErr.requestId).toBe("req_123");
      expect(apiErr.details?.permission).toBe("projects.projects.write");
    }
  });
});
