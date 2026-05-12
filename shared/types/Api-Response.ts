export type APISuccess<T> = {
  success: true
  data: T
}

export type APIError = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type APIResponse<T> = APISuccess<T> | APIError

export const ok = <T>(data: T): APISuccess<T> => ({ success: true, data })

export const fail = (code: string, message: string): APIError => ({
  success: false,
  error: { code, message },
})
