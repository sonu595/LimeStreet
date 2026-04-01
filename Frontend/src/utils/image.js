import { API_BASE_URL } from './api'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin
  } catch (error) {
    console.error('Unable to derive API origin for images:', error)
    return ''
  }
})()

const buildFallbackSvg = (label = 'Image unavailable') =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
      <rect width="480" height="600" fill="#050505" />
      <rect x="24" y="24" width="432" height="552" rx="28" fill="#111111" stroke="#262626" stroke-width="2" />
      <circle cx="240" cy="220" r="58" fill="#1f1f1f" />
      <rect x="118" y="338" width="244" height="18" rx="9" fill="#242424" />
      <rect x="150" y="374" width="180" height="14" rx="7" fill="#1f1f1f" />
      <text x="240" y="450" fill="#d4d4d4" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">${label}</text>
    </svg>
  `)}`

export const PRODUCT_IMAGE_FALLBACK_SRC = buildFallbackSvg()

const normalizeRelativeImagePath = (value) => {
  const trimmedValue = value.trim().replace(/^\.?\//, '')

  if (!trimmedValue) {
    return ''
  }

  if (trimmedValue.startsWith('uploads/')) {
    return `/${trimmedValue}`
  }

  if (/^[^/]+\.(avif|gif|jpe?g|png|svg|webp)$/i.test(trimmedValue)) {
    return `/uploads/${trimmedValue}`
  }

  return trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`
}

export const resolveImageUrl = (value) => {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  if (/^(data:|blob:)/i.test(trimmedValue)) {
    return trimmedValue
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    try {
      const parsedUrl = new URL(trimmedValue)

      if (LOCAL_HOSTS.has(parsedUrl.hostname) && API_ORIGIN) {
        const apiOrigin = new URL(API_ORIGIN)
        parsedUrl.protocol = apiOrigin.protocol
        parsedUrl.host = apiOrigin.host
      }

      return parsedUrl.toString()
    } catch (error) {
      console.error('Unable to parse image URL:', error)
      return trimmedValue
    }
  }

  const normalizedPath = normalizeRelativeImagePath(trimmedValue)
  return API_ORIGIN ? `${API_ORIGIN}${normalizedPath}` : normalizedPath
}

export const resolveProductImageList = (product) => {
  const mergedImages = [...(product?.imageUrls || []), product?.imageUrl]
    .map(resolveImageUrl)
    .filter(Boolean)

  return Array.from(new Set(mergedImages)).slice(0, 4)
}

export const handleProductImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === 'true') {
    return
  }

  event.currentTarget.dataset.fallbackApplied = 'true'
  event.currentTarget.src = PRODUCT_IMAGE_FALLBACK_SRC
}
