
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

type ApiResponse<T, M = unknown> = {
  data: T;
  error: { message: string } | null;
  meta: M;
};

type ApiRequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T, M = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T, M>> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  const { token, headers, ...requestOptions } = options;

  const response = await fetch(
    `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      ...requestOptions,
      headers: {
        ...(requestOptions.body ? { "Content-Type": "application/json" } : {}),
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error?.message || `Request failed with status ${response.status}`,
    );
  }

  return result as ApiResponse<T, M>;
}
