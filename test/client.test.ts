import { describe, it, expect } from "vitest";
import { Tedo } from "../src/client.js";
import { MockTransport } from "./helpers.js";

describe("Tedo client", () => {
  it("accepts a string API key", () => {
    const client = new Tedo("tedo_live_xxx");
    expect(client).toBeDefined();
    expect(client.billing).toBeDefined();
  });

  it("accepts an options object", () => {
    const client = new Tedo({
      apiKey: "tedo_live_xxx",
      baseUrl: "https://custom.api.com/v1",
    });
    expect(client).toBeDefined();
  });

  it("accepts a custom transport", () => {
    const transport = new MockTransport();
    const client = new Tedo({ apiKey: "tedo_live_xxx", transport });
    expect(client._transport).toBe(transport);
  });

  it("sends requests through transport", async () => {
    const transport = new MockTransport();
    transport.enqueue(200, { id: "plan_1", key: "pro", name: "Pro" });

    const client = new Tedo({ apiKey: "tedo_live_xxx", transport });
    const plan = await client.billing.getPlan("plan_1");

    expect(plan.id).toBe("plan_1");
    expect(transport.lastRequest.method).toBe("GET");
    expect(transport.lastRequest.path).toBe("/billing/v1/plans/plan_1");
  });

  it("throws on error responses", async () => {
    const transport = new MockTransport();
    transport.enqueue(404, {
      code: "not_found",
      message: "Plan not found",
    });

    const client = new Tedo({ apiKey: "tedo_live_xxx", transport });

    await expect(client.billing.getPlan("nope")).rejects.toThrow(
      "Plan not found",
    );
  });

  it("handles void responses", async () => {
    const transport = new MockTransport();
    transport.enqueue(204, null);

    const client = new Tedo({ apiKey: "tedo_live_xxx", transport });
    await expect(client.billing.deletePlan("plan_1")).resolves.toBeUndefined();
  });
});
