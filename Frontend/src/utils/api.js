// const FALLBACK_API_BASE_URL = 'http://localhost:8080/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL).replace(/\/+$/, '')

export const buildApiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
