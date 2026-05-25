export interface APISuccess<T> {
  success: true
  data: T
}

export interface APIError {
  success: false
  error: { code: string; message: string }
}

export type APIResponse<T> = APISuccess<T> | APIError
