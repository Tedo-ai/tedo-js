import { describe, it, expect } from "vitest";
import {
  TedoError,
  ValidationError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  RateLimitError,
  parseError,
} from "../src/errors.js";

describe("parseError", () => {
  it("returns ValidationError for 400", () => {
    const err = parseError(400, {
      code: "email_taken",
      message: "Email already exists",
      field: "email",
    });
    expect(err).toBeInstanceOf(ValidationError);
    expect(err).toBeInstanceOf(TedoError);
    expect(err.code).toBe("email_taken");
    expect(err.message).toBe("Email already exists");
    expect(err.status).toBe(400);
    expect(err.field).toBe("email");
  });

  it("returns AuthenticationError for 401", () => {
    const err = parseError(401, {
      code: "authentication_error",
      message: "Invalid API key",
    });
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.status).toBe(401);
  });

  it("returns PermissionError for 403", () => {
    const err = parseError(403, {
      code: "permission_denied",
      message: "Insufficient scope",
    });
    expect(err).toBeInstanceOf(PermissionError);
    expect(err.status).toBe(403);
  });

  it("returns NotFoundError for 404", () => {
    const err = parseError(404, {
      code: "not_found",
      message: "Customer not found",
    });
    expect(err).toBeInstanceOf(NotFoundError);
    expect(err.status).toBe(404);
  });

  it("returns RateLimitError for 429", () => {
    const err = parseError(429, {
      code: "rate_limit_exceeded",
      message: "Too many requests",
    });
    expect(err).toBeInstanceOf(RateLimitError);
    expect(err.status).toBe(429);
  });

  it("returns base TedoError for 500", () => {
    const err = parseError(500, {
      code: "internal_error",
      message: "Something went wrong",
    });
    expect(err).toBeInstanceOf(TedoError);
    expect(err).not.toBeInstanceOf(ValidationError);
    expect(err.status).toBe(500);
  });

  it("handles string body", () => {
    const err = parseError(500, "Internal Server Error");
    expect(err.message).toBe("Internal Server Error");
    expect(err.code).toBe("unknown_error");
  });

  it("handles null body", () => {
    const err = parseError(500, null);
    expect(err.code).toBe("unknown_error");
  });

  it("reads error field as code fallback", () => {
    const err = parseError(400, {
      error: "email_taken",
      message: "Email already exists",
    });
    expect(err.code).toBe("email_taken");
  });

  it("errors extend Error", () => {
    const err = parseError(404, {
      code: "not_found",
      message: "Not found",
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("NotFoundError");
  });
});
