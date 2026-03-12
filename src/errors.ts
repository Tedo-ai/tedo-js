/** Base error for all Tedo API errors. */
export class TedoError extends Error {
  /** Machine-readable error code (e.g. "validation_error"). */
  readonly code: string;
  /** HTTP status code. */
  readonly status: number;
  /** Field that caused the error, if applicable. */
  readonly field: string | undefined;

  constructor(
    code: string,
    message: string,
    status: number,
    field?: string,
  ) {
    super(message);
    this.name = "TedoError";
    this.code = code;
    this.status = status;
    this.field = field;
  }
}

/** 400 Bad Request — invalid parameters. */
export class ValidationError extends TedoError {
  constructor(code: string, message: string, field?: string) {
    super(code, message, 400, field);
    this.name = "ValidationError";
  }
}

/** 401 Unauthorized — invalid or missing API key. */
export class AuthenticationError extends TedoError {
  constructor(code: string, message: string) {
    super(code, message, 401);
    this.name = "AuthenticationError";
  }
}

/** 403 Forbidden — insufficient permissions. */
export class PermissionError extends TedoError {
  constructor(code: string, message: string) {
    super(code, message, 403);
    this.name = "PermissionError";
  }
}

/** 404 Not Found — resource does not exist. */
export class NotFoundError extends TedoError {
  constructor(code: string, message: string) {
    super(code, message, 404);
    this.name = "NotFoundError";
  }
}

/** 429 Too Many Requests — rate limit exceeded. */
export class RateLimitError extends TedoError {
  constructor(code: string, message: string) {
    super(code, message, 429);
    this.name = "RateLimitError";
  }
}

/** Parse an API error response into the appropriate error subclass. */
export function parseError(status: number, body: unknown): TedoError {
  let code = "unknown_error";
  let message = "An unknown error occurred";
  let field: string | undefined;

  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.code === "string") code = obj.code;
    else if (typeof obj.error === "string") code = obj.error;
    if (typeof obj.message === "string") message = obj.message;
    if (typeof obj.field === "string") field = obj.field;
  } else if (typeof body === "string") {
    message = body;
  }

  switch (status) {
    case 400:
      return new ValidationError(code, message, field);
    case 401:
      return new AuthenticationError(code, message);
    case 403:
      return new PermissionError(code, message);
    case 404:
      return new NotFoundError(code, message);
    case 429:
      return new RateLimitError(code, message);
    default:
      return new TedoError(code, message, status, field);
  }
}
