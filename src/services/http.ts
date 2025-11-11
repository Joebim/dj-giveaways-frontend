import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../types";

interface UnwrappedResponse<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Normalises API responses coming from the backend.
 * Backend returns `{ success, data, message, meta }`, while some endpoints
 * may still respond with bare payloads. This helper gracefully unwraps both shapes.
 */
export const unwrapResponse = <T = unknown>(
  response: AxiosResponse<ApiResponse<T> | T>
): UnwrappedResponse<T> => {
  const payload = response.data as ApiResponse<T> & { [key: string]: any };

  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    Object.prototype.hasOwnProperty.call(payload, "data")
  ) {
    return {
      data: payload.data as T,
      message: payload.message,
      meta: payload.meta as Record<string, unknown> | undefined,
    };
  }

  return {
    data: response.data as T,
  };
};

export const unwrapData = <T = unknown>(
  response: AxiosResponse<ApiResponse<T> | T>
): T => unwrapResponse<T>(response).data;

