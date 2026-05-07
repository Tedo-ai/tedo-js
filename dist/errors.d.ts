/** Base error for all Tedo API errors. */
export declare class TedoError extends Error {
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
    constructor(code: string, message: string, status: number, field?: string, details?: Record<string, unknown>, requestId?: string);
}
/** 400 Bad Request — invalid parameters. */
export declare class ValidationError extends TedoError {
    constructor(code: string, message: string, field?: string, details?: Record<string, unknown>, requestId?: string);
}
/** 401 Unauthorized — invalid or missing API key. */
export declare class AuthenticationError extends TedoError {
    constructor(code: string, message: string, details?: Record<string, unknown>, requestId?: string);
}
/** 403 Forbidden — insufficient permissions. */
export declare class PermissionError extends TedoError {
    constructor(code: string, message: string, details?: Record<string, unknown>, requestId?: string);
}
/** 404 Not Found — resource does not exist. */
export declare class NotFoundError extends TedoError {
    constructor(code: string, message: string, details?: Record<string, unknown>, requestId?: string);
}
/** 429 Too Many Requests — rate limit exceeded. */
export declare class RateLimitError extends TedoError {
    constructor(code: string, message: string, details?: Record<string, unknown>, requestId?: string);
}
/** Parse an API error response into the appropriate error subclass. */
export declare function parseError(status: number, body: unknown): TedoError;
//# sourceMappingURL=errors.d.ts.map
