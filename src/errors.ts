/** Base error for all Tedo API errors. */
export class TedoError extends Error {
  /** Machine-readable error code (e.g. "validation_error"). */
  readonly code: string;
  /** HTTP status code. */
  readonly status: number;
  /** Field that caused the error, if applicable. */
  readonly field: string | undefined;
  /** Additional structured error details from the API. */
  readonly details: Record<string, unknown> | undefined;
  /** Request ID propagated by the API, if available. */
  readonly requestId: string | undefined;

  constructor(
    code: string,
    message: string,
    status: number,
    field?: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(message);
    this.name = "TedoError";
    this.code = code;
    this.status = status;
    this.field = field;
    this.details = details;
    this.requestId = requestId;
  }
}

/** 400 Bad Request — invalid parameters. */
export class ValidationError extends TedoError {
  constructor(
    code: string,
    message: string,
    field?: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(code, message, 400, field, details, requestId);
    this.name = "ValidationError";
  }
}

/** 401 Unauthorized — invalid or missing API key. */
export class AuthenticationError extends TedoError {
  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(code, message, 401, undefined, details, requestId);
    this.name = "AuthenticationError";
  }
}

/** 403 Forbidden — insufficient permissions. */
export class PermissionError extends TedoError {
  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(code, message, 403, undefined, details, requestId);
    this.name = "PermissionError";
  }
}

/** 404 Not Found — resource does not exist. */
export class NotFoundError extends TedoError {
  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(code, message, 404, undefined, details, requestId);
    this.name = "NotFoundError";
  }
}

/** 429 Too Many Requests — rate limit exceeded. */
export class RateLimitError extends TedoError {
  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(code, message, 429, undefined, details, requestId);
    this.name = "RateLimitError";
  }
}

/** Parse an API error response into the appropriate error subclass. */
export function parseError(status: number, body: unknown): TedoError {
  let code = "unknown_error";
  let message = "An unknown error occurred";
  let field: string | undefined;
  let details: Record<string, unknown> | undefined;
  let requestId: string | undefined;

  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.code === "string") code = obj.code;
    else if (typeof obj.error === "string") code = obj.error;
    if (typeof obj.message === "string") message = obj.message;
    if (typeof obj.field === "string") field = obj.field;
    if (obj.details && typeof obj.details === "object") {
      details = obj.details as Record<string, unknown>;
    }
    if (typeof obj.request_id === "string") requestId = obj.request_id;
  } else if (typeof body === "string") {
    message = body;
  }

  switch (status) {
    case 400:
      return new ValidationError(code, message, field, details, requestId);
    case 401:
      return new AuthenticationError(code, message, details, requestId);
    case 403:
      return new PermissionError(code, message, details, requestId);
    case 404:
      return new NotFoundError(code, message, details, requestId);
    case 429:
      return new RateLimitError(code, message, details, requestId);
    default:
      return new TedoError(code, message, status, field, details, requestId);
  }
}
