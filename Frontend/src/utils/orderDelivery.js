const formatDateTime = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
})

const buildDateFromParts = (value, fallbackDateTime) => {
  if (!value) {
    return null
  }

  if (value.includes('T')) {
    const parsedDate = new Date(value)
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
  }

  const parts = value.split('-').map((part) => Number(part))

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return null
  }

  const [year, month, day] = parts
  const fallback = fallbackDateTime ? new Date(fallbackDateTime) : null
  const hours = fallback && !Number.isNaN(fallback.getTime()) ? fallback.getHours() : 18
  const minutes = fallback && !Number.isNaN(fallback.getTime()) ? fallback.getMinutes() : 0
  return new Date(year, month - 1, day, hours, minutes)
}

export const getEstimatedDeliveryDateTime = (order) =>
  buildDateFromParts(order?.estimatedDeliveryAt || order?.estimatedDeliveryDate, order?.approvedAt)

export const formatEstimatedDelivery = (order) => {
  const deliveryDate = getEstimatedDeliveryDateTime(order)

  if (!deliveryDate) {
    return ''
  }

  return formatDateTime.format(deliveryDate)
}

export const getDeliveryCountdown = (order) => {
  const deliveryDate = getEstimatedDeliveryDateTime(order)

  if (!deliveryDate) {
    return ''
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const comparisonDate = new Date(deliveryDate)
  comparisonDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((comparisonDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays > 1) return `${diffDays} days left`
  if (diffDays === 1) return '1 day left'
  if (diffDays === 0) return 'Arriving today'
  return 'Delivery date passed'
}
