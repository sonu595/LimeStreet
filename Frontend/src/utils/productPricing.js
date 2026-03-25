const DEFAULT_VARIANT = 'default'

export const getVariantPriceKey = (size = '', color = '') =>
  `${(size || DEFAULT_VARIANT).trim().toLowerCase()}||${(color || DEFAULT_VARIANT).trim().toLowerCase()}`

export const getVariantPrice = (product, size = '', color = '') => {
  const variantPrices = product?.variantPrices || {}
  const keys = [
    getVariantPriceKey(size, color),
    getVariantPriceKey(size, ''),
    getVariantPriceKey('', color),
    getVariantPriceKey('', '')
  ]

  for (const key of keys) {
    const nextPrice = Number(variantPrices[key])

    if (!Number.isNaN(nextPrice) && nextPrice > 0) {
      return nextPrice
    }
  }

  return Number(product?.price || 0)
}

export const getStartingPrice = (product) => {
  const values = Object.values(product?.variantPrices || {})
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value) && value > 0)

  return values.length ? Math.min(...values) : Number(product?.price || 0)
}
