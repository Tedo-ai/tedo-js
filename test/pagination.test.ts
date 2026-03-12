import { describe, it, expect } from "vitest";
import { createTestClient } from "./helpers.js";

describe("Page", () => {
  it("returns page data from listCustomers", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(200, {
      customers: [
        { id: "c1", email: "a@test.com" },
        { id: "c2", email: "b@test.com" },
      ],
      total: 5,
      next_cursor: "cursor_abc",
    });

    const page = await client.billing.listCustomers({ limit: 2 });

    expect(page.data).toHaveLength(2);
    expect(page.total).toBe(5);
    expect(page.hasMore).toBe(true);
    expect(page.nextCursor).toBe("cursor_abc");
  });

  it("returns null from nextPage when no more pages", async () => {
    const { client, transport } = createTestClient();
    transport.enqueue(200, {
      customers: [{ id: "c1", email: "a@test.com" }],
      total: 1,
      next_cursor: null,
    });

    const page = await client.billing.listCustomers();

    expect(page.hasMore).toBe(false);
    const next = await page.nextPage();
    expect(next).toBeNull();
  });

  it("fetches next page with cursor", async () => {
    const { client, transport } = createTestClient();

    // First page
    transport.enqueue(200, {
      customers: [{ id: "c1", email: "a@test.com" }],
      total: 2,
      next_cursor: "cursor_abc",
    });

    // Second page
    transport.enqueue(200, {
      customers: [{ id: "c2", email: "b@test.com" }],
      total: 2,
      next_cursor: null,
    });

    const page1 = await client.billing.listCustomers({ limit: 1 });
    expect(page1.data[0].id).toBe("c1");

    const page2 = await page1.nextPage();
    expect(page2).not.toBeNull();
    expect(page2!.data[0].id).toBe("c2");
    expect(page2!.hasMore).toBe(false);

    // Verify cursor was sent
    expect(transport.requests[1].query?.cursor).toBe("cursor_abc");
  });

  it("async iterator yields all items across pages", async () => {
    const { client, transport } = createTestClient();

    // First page
    transport.enqueue(200, {
      customers: [
        { id: "c1", email: "a@test.com" },
        { id: "c2", email: "b@test.com" },
      ],
      total: 3,
      next_cursor: "page2",
    });

    // Second page
    transport.enqueue(200, {
      customers: [{ id: "c3", email: "c@test.com" }],
      total: 3,
      next_cursor: null,
    });

    const page = await client.billing.listCustomers();
    const ids: string[] = [];

    for await (const customer of page) {
      ids.push(customer.id);
    }

    expect(ids).toEqual(["c1", "c2", "c3"]);
    expect(transport.requests).toHaveLength(2);
  });
});
