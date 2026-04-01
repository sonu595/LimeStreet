const formatDateTime = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
})

const addDays = (dateValue, days) => {
  const date = new Date(dateValue)
  date.setDate(date.getDate() + days)
  return date
}

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

export const getOrderCreatedDateTime = (order) => {
  if (!order?.createdAt) {
    return null
  }

  const parsedDate = new Date(order.createdAt)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

export const getOrderDisplayStatus = (order) => {
  if (!order) {
    return ''
  }

  if (order.status === 'CANCELLED') {
    return 'Cancelled'
  }

  const createdAt = getOrderCreatedDateTime(order)
  const estimatedDeliveryAt = getEstimatedDeliveryDateTime(order)
  const now = new Date()

  if (estimatedDeliveryAt && now >= estimatedDeliveryAt) {
    return 'Delivered'
  }

  if (createdAt) {
    const packedAt = addDays(createdAt, 1)
    const inTransitAt = addDays(createdAt, 2)

    if (now >= inTransitAt) {
      return 'Out for delivery'
    }

    if (now >= packedAt) {
      return 'Packed'
    }
  }

  return 'Processing'
}

export const getOrderTrackingSteps = (order) => {
  const createdAt = getOrderCreatedDateTime(order) || new Date()
  const estimatedDeliveryAt = getEstimatedDeliveryDateTime(order) || addDays(createdAt, 3)
  const now = new Date()
  const packedAt = addDays(createdAt, 1)
  const inTransitAt = addDays(createdAt, 2)
  const cancelledAt = order?.cancelledAt ? new Date(order.cancelledAt) : null
  const isCancelled = order?.status === 'CANCELLED'

  const steps = [
    {
      key: 'confirmed',
      title: 'Order confirmed',
      description: 'Your order was received and added to our processing queue.',
      time: createdAt
    },
    {
      key: 'packed',
      title: 'Packed',
      description: 'Your items are packed and prepared for dispatch.',
      time: packedAt
    },
    {
      key: 'in-transit',
      title: 'Out for delivery',
      description: 'Your package is on the way to your delivery address.',
      time: inTransitAt
    },
    {
      key: 'delivered',
      title: 'Delivered',
      description: 'Estimated arrival based on the current 3-day delivery window.',
      time: estimatedDeliveryAt
    }
  ]

  return steps.map((step, index) => {
    if (isCancelled) {
      const reachedBeforeCancel = cancelledAt ? cancelledAt >= step.time : index === 0

      return {
        ...step,
        state: reachedBeforeCancel ? 'completed' : 'cancelled'
      }
    }

    if (now >= step.time) {
      return {
        ...step,
        state: 'completed'
      }
    }

    const previousStep = steps[index - 1]
    const isCurrent = !previousStep || now >= previousStep.time

    return {
      ...step,
      state: isCurrent ? 'current' : 'upcoming'
    }
  })
}

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
