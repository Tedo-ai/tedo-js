import { describe, it, expect } from "vitest";
import { createTestClient } from "./helpers.js";

describe("BillingService", () => {
  // ============================================================
  // PLANS
  // ============================================================

  describe("plans", () => {
    it("createPlan sends POST /billing/v1/plans", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, { id: "plan_1", key: "pro", name: "Pro" });

      const plan = await client.billing.createPlan({
        key: "pro",
        name: "Pro",
      });

      expect(plan.id).toBe("plan_1");
      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe("/billing/v1/plans");
      expect(transport.lastRequest.body).toEqual({
        key: "pro",
        name: "Pro",
      });
    });

    it("listPlans sends GET /billing/v1/plans", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, {
        plans: [{ id: "plan_1", key: "pro" }],
        total: 1,
      });

      const list = await client.billing.listPlans();

      expect(list.plans).toHaveLength(1);
      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe("/billing/v1/plans");
    });

    it("getPlan sends GET /billing/v1/plans/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { id: "plan_1", key: "pro" });

      await client.billing.getPlan("plan_1");

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe("/billing/v1/plans/plan_1");
    });

    it("updatePlan sends PATCH /billing/v1/plans/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { id: "plan_1", name: "Pro Plus" });

      await client.billing.updatePlan("plan_1", { name: "Pro Plus" });

      expect(transport.lastRequest.method).toBe("PATCH");
      expect(transport.lastRequest.path).toBe("/billing/v1/plans/plan_1");
      expect(transport.lastRequest.body).toEqual({ name: "Pro Plus" });
    });

    it("deletePlan sends DELETE /billing/v1/plans/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(204, null);

      await client.billing.deletePlan("plan_1");

      expect(transport.lastRequest.method).toBe("DELETE");
      expect(transport.lastRequest.path).toBe("/billing/v1/plans/plan_1");
    });
  });

  // ============================================================
  // PRICES
  // ============================================================

  describe("prices", () => {
    it("createPrice sends POST /billing/v1/plans/:id/prices", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, { id: "price_1", amount: 2900 });

      await client.billing.createPrice("plan_1", {
        key: "monthly",
        amount: 2900,
      });

      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/plans/plan_1/prices",
      );
      expect(transport.lastRequest.body).toEqual({
        key: "monthly",
        amount: 2900,
      });
    });

    it("listPrices sends GET /billing/v1/plans/:id/prices", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, {
        prices: [{ id: "price_1" }],
        total: 1,
      });

      await client.billing.listPrices("plan_1");

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/plans/plan_1/prices",
      );
    });

    it("archivePrice sends DELETE /billing/v1/plans/:planId/prices/:priceId", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(204, null);

      await client.billing.archivePrice("plan_1", "price_1");

      expect(transport.lastRequest.method).toBe("DELETE");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/plans/plan_1/prices/price_1",
      );
    });
  });

  // ============================================================
  // ENTITLEMENTS
  // ============================================================

  describe("entitlements", () => {
    it("createEntitlement sends POST /billing/v1/plans/:id/entitlements", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, { id: "ent_1", key: "api_access" });

      await client.billing.createEntitlement("plan_1", {
        key: "api_access",
        value_bool: true,
      });

      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/plans/plan_1/entitlements",
      );
    });

    it("listEntitlements sends GET /billing/v1/plans/:id/entitlements", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, {
        entitlements: [{ id: "ent_1" }],
        total: 1,
      });

      await client.billing.listEntitlements("plan_1");

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/plans/plan_1/entitlements",
      );
    });

    it("archiveEntitlement sends DELETE", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(204, null);

      await client.billing.archiveEntitlement("plan_1", "ent_1");

      expect(transport.lastRequest.method).toBe("DELETE");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/plans/plan_1/entitlements/ent_1",
      );
    });
  });

  // ============================================================
  // CUSTOMERS
  // ============================================================

  describe("customers", () => {
    it("createCustomer sends POST /billing/v1/customers", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, {
        id: "cus_1",
        email: "user@example.com",
      });

      await client.billing.createCustomer({
        email: "user@example.com",
        name: "Acme",
      });

      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe("/billing/v1/customers");
      expect(transport.lastRequest.body).toEqual({
        email: "user@example.com",
        name: "Acme",
      });
    });

    it("getCustomer sends GET /billing/v1/customers/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { id: "cus_1", email: "user@example.com" });

      await client.billing.getCustomer("cus_1");

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe("/billing/v1/customers/cus_1");
    });

    it("listCustomers sends GET with query params", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, {
        customers: [],
        total: 0,
      });

      await client.billing.listCustomers({ limit: 10, cursor: "abc" });

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe("/billing/v1/customers");
      expect(transport.lastRequest.query).toEqual({
        limit: "10",
        cursor: "abc",
      });
    });

    it("updateCustomer sends PATCH /billing/v1/customers/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { id: "cus_1", name: "Acme Corp" });

      await client.billing.updateCustomer("cus_1", {
        name: "Acme Corp",
      });

      expect(transport.lastRequest.method).toBe("PATCH");
      expect(transport.lastRequest.path).toBe("/billing/v1/customers/cus_1");
    });

    it("deleteCustomer sends DELETE /billing/v1/customers/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(204, null);

      await client.billing.deleteCustomer("cus_1");

      expect(transport.lastRequest.method).toBe("DELETE");
      expect(transport.lastRequest.path).toBe("/billing/v1/customers/cus_1");
    });
  });

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  describe("subscriptions", () => {
    it("createSubscription sends POST /billing/v1/subscriptions", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, {
        id: "sub_1",
        customer_id: "cus_1",
        status: "active",
      });

      await client.billing.createSubscription({
        customer_id: "cus_1",
        price_id: "price_1",
      });

      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe("/billing/v1/subscriptions");
    });

    it("getSubscription sends GET /billing/v1/subscriptions/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { id: "sub_1", status: "active" });

      await client.billing.getSubscription("sub_1");

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/subscriptions/sub_1",
      );
    });

    it("cancelSubscription sends DELETE /billing/v1/subscriptions/:id", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { id: "sub_1", status: "canceled" });

      const sub = await client.billing.cancelSubscription("sub_1");

      expect(sub.status).toBe("canceled");
      expect(transport.lastRequest.method).toBe("DELETE");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/subscriptions/sub_1",
      );
    });
  });

  // ============================================================
  // ENTITLEMENT CHECK
  // ============================================================

  describe("entitlement check", () => {
    it("checkEntitlement sends POST /billing/v1/entitlements/check", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, { has_access: true, value: "10000" });

      const result = await client.billing.checkEntitlement({
        customer_id: "cus_1",
        entitlement_key: "api_requests",
      });

      expect(result.has_access).toBe(true);
      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/entitlements/check",
      );
    });
  });

  // ============================================================
  // USAGE
  // ============================================================

  describe("usage", () => {
    it("recordUsage sends POST /billing/v1/usage", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, { id: "usage_1", quantity: 100 });

      await client.billing.recordUsage({
        subscription_id: "sub_1",
        quantity: 100,
      });

      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe("/billing/v1/usage");
      expect(transport.lastRequest.body).toEqual({
        subscription_id: "sub_1",
        quantity: 100,
      });
    });

    it("getUsageSummary sends GET /billing/v1/usage with query", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(200, {
        subscription_id: "sub_1",
        total_usage: 500,
        records: 5,
      });

      await client.billing.getUsageSummary({
        subscription_id: "sub_1",
      });

      expect(transport.lastRequest.method).toBe("GET");
      expect(transport.lastRequest.path).toBe("/billing/v1/usage");
      expect(transport.lastRequest.query).toEqual({
        subscription_id: "sub_1",
      });
    });
  });

  // ============================================================
  // PORTAL
  // ============================================================

  describe("portal", () => {
    it("createPortalLink sends POST /billing/v1/customers/:id/portal-link", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, {
        portal_url: "https://portal.tedo.ai/abc",
        token: "tok_123",
      });

      const link = await client.billing.createPortalLink("cus_1", {
        expires_in_hours: 48,
      });

      expect(link.portal_url).toBe("https://portal.tedo.ai/abc");
      expect(transport.lastRequest.method).toBe("POST");
      expect(transport.lastRequest.path).toBe(
        "/billing/v1/customers/cus_1/portal-link",
      );
    });

    it("createPortalLink works without params", async () => {
      const { client, transport } = createTestClient();
      transport.enqueue(201, {
        portal_url: "https://portal.tedo.ai/abc",
      });

      await client.billing.createPortalLink("cus_1");

      expect(transport.lastRequest.body).toEqual({});
    });
  });
});
