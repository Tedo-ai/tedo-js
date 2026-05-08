class TedoError extends Error {
  /** Machine-readable error code (e.g. "validation_error"). */
  code;
  /** HTTP status code. */
  status;
  /** Field that caused the error, if applicable. */
  field;
  /** Additional structured error details from the API. */
  details;
  /** Request ID propagated by the API, if available. */
  requestId;
  constructor(code, message, status, field, details, requestId) {
    super(message);
    this.name = "TedoError";
    this.code = code;
    this.status = status;
    this.field = field;
    this.details = details;
    this.requestId = requestId;
  }
}
class ValidationError extends TedoError {
  constructor(code, message, field, details, requestId) {
    super(code, message, 400, field, details, requestId);
    this.name = "ValidationError";
  }
}
class AuthenticationError extends TedoError {
  constructor(code, message, details, requestId) {
    super(code, message, 401, void 0, details, requestId);
    this.name = "AuthenticationError";
  }
}
class PermissionError extends TedoError {
  constructor(code, message, details, requestId) {
    super(code, message, 403, void 0, details, requestId);
    this.name = "PermissionError";
  }
}
class NotFoundError extends TedoError {
  constructor(code, message, details, requestId) {
    super(code, message, 404, void 0, details, requestId);
    this.name = "NotFoundError";
  }
}
class RateLimitError extends TedoError {
  constructor(code, message, details, requestId) {
    super(code, message, 429, void 0, details, requestId);
    this.name = "RateLimitError";
  }
}
function parseError(status, body) {
  let code = "unknown_error";
  let message = "An unknown error occurred";
  let field;
  let details;
  let requestId;
  if (body && typeof body === "object") {
    const obj = body;
    if (typeof obj.code === "string") code = obj.code;
    else if (typeof obj.error === "string") code = obj.error;
    if (typeof obj.message === "string") message = obj.message;
    if (typeof obj.field === "string") field = obj.field;
    if (obj.details && typeof obj.details === "object") {
      details = obj.details;
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
export {
  AuthenticationError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  TedoError,
  ValidationError,
  parseError
};
//# sourceMappingURL=errors.js.map
