/**
 * Central API client for all HTTP requests.
 */

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type ApiError = Error & {
  status: number;
  body: string;
};

function createApiError(message: string, status: number, body: string): ApiError {
  const err = new Error(message) as ApiError;
  err.name = "ApiError";
  err.status = status;
  err.body = body;
  return err;
}

/* runs fetch, checks response, parses JSON. */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, signal } = options;

  const hasBody = body !== undefined && body !== null;
  const requestHeaders: Record<string, string> = { ...headers };
  if (hasBody) {
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] ?? "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: Object.keys(requestHeaders).length ? requestHeaders : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await response.text();
  if (!response.ok) {
    throw createApiError(
      `API error ${response.status}: ${response.statusText}`,
      response.status,
      text
    );
  }

  if (!text.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw createApiError(`Invalid JSON response`, response.status, text);
  }
}

export async function get<T>(url: string, options: { signal?: AbortSignal } = {}): Promise<T> {
  return request<T>(url, { method: "GET", ...options });
}

/** Single shared client interface for all endpoints. */
export const apiClient = {
  get,
  request,
};
