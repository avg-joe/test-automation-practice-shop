export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export interface ApiResponseBase {
  success?: boolean;
  message?: string;
}

export async function parseApiJson<T>(response: Response): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

export function getApiMessage(
  data: ApiResponseBase | undefined,
  fallback: string,
): string {
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  return fallback;
}
