import { APIResponse, APISuccess } from "@/types"
import { type AxiosError, type AxiosResponse, create } from "axios"

export const apiClient = create({
  baseURL: "/api",
  timeout: 15_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<APIResponse<unknown>>) => {
    return response
  },
  (error: AxiosError<APIResponse<unknown>>) => {
    const status = error.response?.status

    // Sesión expirada - redirigir al login
    if (status === 401) {
      // Solo redirigir si estamos en el browser y no ya en /auth
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth")
      ) {
        window.location.href = "/auth/login"
      }
    }

    // Normalizar el mensaje de error para los hooks
    const apiError = error.response?.data
    if (apiError && !apiError.success) {
      return Promise.reject({
        status,
        code: apiError.error.code,
        message: apiError.error.message,
      })
    }

    // Errores de red o timeout
    return Promise.reject({
      status: status ?? 0,
      code: "NETWORK_ERROR",
      message: error.message ?? "Error de conexión",
    })
  }
)

// Helpers
export async function get<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await apiClient.get<APISuccess<T>>(url, { params })
  return response.data.data
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.post<APISuccess<T>>(url, body)
  return response.data.data
}

export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.patch<APISuccess<T>>(url, body)
  return response.data.data
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.put<APISuccess<T>>(url, body)
  return response.data.data
}

export async function del<T>(url: string): Promise<T> {
  const response = await apiClient.delete<APISuccess<T>>(url)
  return response.data.data
}
