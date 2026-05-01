import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { ImagePlus, Plus, RefreshCw, Save, ShieldCheck, Trash2, X } from 'lucide-react'
import useAuth from '../../context/useAuth'
import { buildApiUrl } from '../../utils/api'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'
import { formatEstimatedDelivery } from '../../utils/orderDelivery'

const CATEGORY_OPTIONS = ['Quotes', 'Funny', 'Niche-Based', 'Illustration', 'Aesthetic', 'Motivational', 'Pop Culture', 'Desi', 'Couple', 'Spiritual']
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL']
const COLOR_OPTIONS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Beige']
const DEFAULT_VARIANT = 'default'
const MAX_IMAGES = 4
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024

const createLocalId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const normalizeOptionList = (values = []) => {
  const seen = new Set()

  return values
    .map((value) => value?.trim())
    .filter(Boolean)
    .filter((value) => {
      const normalizedValue = value.toLowerCase()

      if (seen.has(normalizedValue)) {
        return false
      }

      seen.add(normalizedValue)
      return true
    })
}

const getVariantKey = (size = '', color = '') =>
  `${(size || DEFAULT_VARIANT).trim().toLowerCase()}||${(color || DEFAULT_VARIANT).trim().toLowerCase()}`

const parseVariantKey = (key = '') => {
  const [rawSize = DEFAULT_VARIANT, rawColor = DEFAULT_VARIANT] = key.split('||')

  return {
    size: rawSize === DEFAULT_VARIANT ? '' : rawSize,
    color: rawColor === DEFAULT_VARIANT ? '' : rawColor
  }
}

const restoreOptionValue = (value, options = []) => {
  if (!value || value === DEFAULT_VARIANT) {
    return ''
  }

  return options.find((option) => option.trim().toLowerCase() === value.trim().toLowerCase()) || value
}

const roundPrice = (value) => Math.round((value + Number.EPSILON) * 100) / 100

const parseNumberInput = (value) => {
  if (value === '' || value == null) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

const getLowestVariantPrice = (variants = []) => {
  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => !Number.isNaN(price) && price > 0)

  return prices.length ? Math.min(...prices) : null
}

const buildVariantsFromProduct = (product) => {
  const sizes = normalizeOptionList(product.sizes?.length ? product.sizes : (product.size || '').split(','))
  const colors = normalizeOptionList(product.colors || [])
  const savedVariants = Object.entries(product.variantPrices || {})
    .map(([key, price]) => {
      const parsedKey = parseVariantKey(key)

      return {
        id: createLocalId(),
        size: restoreOptionValue(parsedKey.size, sizes),
        color: restoreOptionValue(parsedKey.color, colors),
        price: price == null ? '' : String(price)
      }
    })
    .filter((variant) => variant.size || variant.color)

  if (savedVariants.length > 0) {
    return savedVariants
  }

  if (!sizes.length && !colors.length) {
    return []
  }

  const fallbackSizes = sizes.length ? sizes : ['']
  const fallbackColors = colors.length ? colors : ['']

  return fallbackSizes.flatMap((size) => fallbackColors.map((color) => ({
    id: createLocalId(),
    size,
    color,
    price: product.price == null ? '' : String(product.price)
  })))
}

const createProductForm = () => ({
  id: null,
  name: '',
  category: '',
  description: '',
  basePrice: '',
  discountPercentage: '',
  variants: [],
  variantSize: '',
  variantColor: '',
  customSize: '',
  customColor: '',
  newArrival: true,
  sale: false,
  existingImages: [],
  imageFiles: []
})

const buildFormFromProduct = (product) => ({
  id: product.id,
  name: product.name || '',
  category: product.category || '',
  description: product.description || '',
  basePrice: product.price == null ? '' : String(product.price),
  discountPercentage: product.discountPercentage == null ? '' : String(product.discountPercentage),
  variants: buildVariantsFromProduct(product),
  variantSize: product.sizes?.[0] || '',
  variantColor: product.colors?.[0] || '',
  customSize: '',
  customColor: '',
  newArrival: Boolean(product.newArrival),
  sale: Boolean(product.sale),
  existingImages: product.imageUrls?.length ? product.imageUrls.slice(0, MAX_IMAGES) : (product.imageUrl ? [product.imageUrl] : []),
  imageFiles: []
})

const OrderCard = ({ order }) => {
  const expectedDeliveryLabel = formatEstimatedDelivery(order)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <article className="rounded-[32px] border border-white/10 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Order #{order.id}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{order.customerName}</h3>
          <p className="mt-1 text-sm text-zinc-400">{order.customerEmail} • {order.contactNumber}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300">{order.status}</span>
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300">Rs {Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-black/30 p-4 text-sm text-zinc-300">
            {order.addressLine1}, {order.addressLine2 ? `${order.addressLine2}, ` : ''}{order.city}, {order.state} {order.postalCode}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {order.items?.map((item) => (
              <div key={`${order.id}-${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 rounded-2xl border border-white/8 bg-black/30 p-3">
                <img
                  src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
                  alt={item.productName}
                  className="h-16 w-14 rounded-xl object-cover"
                  onError={handleProductImageError}
                />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm text-white">{item.productName}</p>
                  <p className="mt-1 text-xs text-zinc-500">Qty {item.quantity} • {item.selectedSize || 'Default'} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                  <p className="mt-2 text-sm text-zinc-300">Rs {Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-[28px] border border-white/8 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{isCancelled ? 'Cancellation status' : 'Automatic delivery flow'}</p>
          {isCancelled ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {order.cancellationReason ? `Customer note: ${order.cancellationReason}` : 'This order was cancelled by the customer.'}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                This order follows the automatic 3-day delivery timeline.
              </div>
              {expectedDeliveryLabel && <p className="text-xs text-zinc-500">Expected on {expectedDeliveryLabel}</p>}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

const AdminConsoleNext = () => {
  const { axiosInstance } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(createProductForm())

  const stats = useMemo(() => ({
    totalProducts: products.length,
    activeOrders: orders.filter((order) => !['DELIVERED', 'CANCELLED'].includes(order.status)).length,
    deliveredOrders: orders.filter((order) => order.status === 'DELIVERED').length,
    cancelledOrders: orders.filter((order) => order.status === 'CANCELLED').length
  }), [orders, products])
  const sizeOptions = useMemo(() => normalizeOptionList([
    ...SIZE_OPTIONS,
    ...form.variants.map((variant) => variant.size),
    form.variantSize,
    form.customSize
  ]), [form.customSize, form.variantSize, form.variants])
  const colorOptions = useMemo(() => normalizeOptionList([
    ...COLOR_OPTIONS,
    ...form.variants.map((variant) => variant.color),
    form.variantColor,
    form.customColor
  ]), [form.customColor, form.variantColor, form.variants])
  const previewImages = useMemo(() => form.imageFiles.map((file, index) => ({
    id: `new-${index}-${file.name}-${file.size}`,
    url: URL.createObjectURL(file)
  })), [form.imageFiles])
  const allImages = useMemo(() => [
    ...form.existingImages.map((url, index) => ({ id: `existing-${index}`, url })),
    ...previewImages
  ], [form.existingImages, previewImages])
  const effectiveSellingPrice = useMemo(() => {
    const lowestVariantPrice = getLowestVariantPrice(form.variants)

    if (lowestVariantPrice) {
      return lowestVariantPrice
    }

    const parsedBasePrice = parseNumberInput(form.basePrice)
    return parsedBasePrice && parsedBasePrice > 0 ? parsedBasePrice : null
  }, [form.basePrice, form.variants])
  const compareAtPrice = useMemo(() => {
    const discountPercentage = parseNumberInput(form.discountPercentage)

    if (!form.sale || !effectiveSellingPrice || discountPercentage == null || discountPercentage <= 0 || discountPercentage >= 100) {
      return null
    }

    return roundPrice(effectiveSellingPrice / (1 - (discountPercentage / 100)))
  }, [effectiveSellingPrice, form.discountPercentage, form.sale])

  useEffect(() => () => {
    previewImages.forEach((image) => URL.revokeObjectURL(image.url))
  }, [previewImages])

  const fetchProducts = async () => {
    const response = await axios.get(buildApiUrl('/products'))
    setProducts(Array.isArray(response.data) ? response.data : [])
  }

  const fetchOrders = async () => {
    const response = await axiosInstance.get('/orders')
    setOrders(Array.isArray(response.data) ? response.data : [])
  }

  const refreshAll = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchProducts(), fetchOrders()])
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Failed to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const resetForm = () => {
    setForm(createProductForm())
    setError('')
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'sale' && !checked ? { discountPercentage: '' } : {})
    }))
  }

  const addCustomOption = (fieldKey, inputKey) => {
    const value = form[inputKey].trim()

    if (!value) {
      return
    }

    setForm((current) => ({ ...current, [fieldKey]: value, [inputKey]: '' }))
  }

  const handleAddVariant = () => {
    const size = form.variantSize.trim()
    const color = form.variantColor.trim()

    if (!size && !color) {
      setError('Select at least a size or a color before adding a variant section.')
      return
    }

    const alreadyExists = form.variants.some((variant) => getVariantKey(variant.size, variant.color) === getVariantKey(size, color))

    if (alreadyExists) {
      setError('This size and color combination has already been added.')
      return
    }

    setForm((current) => ({
      ...current,
      variants: [...current.variants, { id: createLocalId(), size, color, price: '' }]
    }))
    setError('')
  }

  const handleVariantPriceChange = (variantId, value) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant) => (variant.id === variantId ? { ...variant, price: value } : variant))
    }))
  }

  const handleRemoveVariant = (variantId) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((variant) => variant.id !== variantId)
    }))
  }

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (!selectedFiles.length) {
      return
    }

    const currentCount = form.existingImages.length + form.imageFiles.length
    const availableSlots = MAX_IMAGES - currentCount

    if (availableSlots <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} images only.`)
      event.target.value = ''
      return
    }

    const acceptedFiles = []

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError('Each image must be smaller than 8MB.')
        continue
      }

      acceptedFiles.push(file)
    }

    if (!acceptedFiles.length) {
      event.target.value = ''
      return
    }

    setForm((current) => ({
      ...current,
      imageFiles: [...current.imageFiles, ...acceptedFiles.slice(0, availableSlots)]
    }))

    if (acceptedFiles.length > availableSlots || selectedFiles.length > acceptedFiles.length) {
      setError(`Only ${MAX_IMAGES} product images can be kept. Extra files were skipped.`)
    } else {
      setError('')
    }

    event.target.value = ''
  }

  const removeExistingImage = (imageIndex) => {
    setForm((current) => ({
      ...current,
      existingImages: current.existingImages.filter((_, index) => index !== imageIndex)
    }))
  }

  const removeNewImage = (imageIndex) => {
    setForm((current) => ({
      ...current,
      imageFiles: current.imageFiles.filter((_, index) => index !== imageIndex)
    }))
  }

  const handleEdit = (product) => {
    setActiveTab('products')
    setMessage('')
    setError('')
    setForm(buildFormFromProduct(product))
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return

    try {
      setError('')
      setMessage('')
      await axiosInstance.delete(`/products/${productId}`)
      await fetchProducts()
      setMessage('Product deleted successfully.')
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Failed to delete product.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const sanitizedVariants = form.variants.map((variant) => ({
        ...variant,
        size: variant.size.trim(),
        color: variant.color.trim(),
        numericPrice: parseNumberInput(variant.price)
      }))

      if (allImages.length === 0) {
        throw new Error('At least one product image is required.')
      }

      if (sanitizedVariants.some((variant) => variant.numericPrice == null || variant.numericPrice <= 0)) {
        throw new Error('Enter a valid price for every added variant section.')
      }

      const variantPrices = Object.fromEntries(
        sanitizedVariants.map((variant) => [getVariantKey(variant.size, variant.color), roundPrice(variant.numericPrice)])
      )
      const sizes = normalizeOptionList(sanitizedVariants.map((variant) => variant.size))
      const colors = normalizeOptionList(sanitizedVariants.map((variant) => variant.color))
      const manualBasePrice = parseNumberInput(form.basePrice)
      const finalPrice = sanitizedVariants.length ? Math.min(...Object.values(variantPrices)) : manualBasePrice

      if (finalPrice == null || finalPrice <= 0) {
        throw new Error('Add a base price or create at least one priced variant section.')
      }

      let originalPrice = null

      if (form.sale) {
        const discountPercentage = parseNumberInput(form.discountPercentage)

        if (discountPercentage == null || discountPercentage <= 0 || discountPercentage >= 100) {
          throw new Error('When sale mode is enabled, enter a valid discount percentage between 1 and 99.')
        }

        originalPrice = roundPrice(finalPrice / (1 - (discountPercentage / 100)))
      }

      let imageUrls = [...form.existingImages]

      if (form.imageFiles.length > 0) {
        const uploadForm = new FormData()
        form.imageFiles.forEach((file) => uploadForm.append('files', file))
        const uploadResponse = await axiosInstance.post('/products/upload-images', uploadForm)
        const uploadedImages = uploadResponse.data.imageUrls || []
        imageUrls = [...form.existingImages, ...uploadedImages].slice(0, MAX_IMAGES)
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: roundPrice(finalPrice),
        originalPrice,
        sizes,
        colors,
        variantPrices,
        size: sizes.join(', '),
        imageUrls,
        imageUrl: imageUrls[0] || '',
        newArrival: form.newArrival,
        sale: Boolean(form.sale && originalPrice && originalPrice > finalPrice)
      }

      if (form.id) {
        await axiosInstance.put(`/products/${form.id}`, payload)
      } else {
        await axiosInstance.post('/products', payload)
      }

      resetForm()
      await fetchProducts()
      setMessage(form.id ? 'Product updated successfully.' : 'Product created successfully.')
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Store Console</h1>
          </div>
          <button type="button" onClick={refreshAll} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:text-white"><RefreshCw size={15} />Refresh</button>
        </div>

        {message && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <div className="mb-5 flex flex-wrap gap-2">{['dashboard', 'products', 'orders'].map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm transition ${activeTab === tab ? 'bg-white text-black' : 'border border-white/10 text-zinc-300'}`}>{tab}</button>)}</div>

        {loading ? <div className="flex h-72 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div> : (
          <>
            {activeTab === 'dashboard' && <div className="space-y-5"><div className="grid gap-4 md:grid-cols-4"><div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Products</p><p className="mt-3 text-3xl font-semibold text-white">{stats.totalProducts}</p></div><div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Active Orders</p><p className="mt-3 text-3xl font-semibold text-white">{stats.activeOrders}</p></div><div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Delivered Orders</p><p className="mt-3 text-3xl font-semibold text-white">{stats.deliveredOrders}</p></div><div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Cancelled Orders</p><p className="mt-3 text-3xl font-semibold text-white">{stats.cancelledOrders}</p></div></div><div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-white" /><div><h2 className="text-lg font-semibold text-white">Store ready checklist</h2><p className="text-sm text-zinc-400">Variant pricing, automatic delivery tracking, and order visibility are managed from one place.</p></div></div></div></div>}

            {activeTab === 'products' && (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
                <form onSubmit={handleSubmit} className="space-y-4 rounded-[32px] border border-white/10 bg-zinc-950 p-5">
                  <div><h2 className="text-xl font-semibold text-white">{form.id ? 'Edit Product' : 'Add Product'}</h2><p className="text-sm text-zinc-400">Create size and color sections first, then assign pricing for each variant manually.</p></div>
                  <div className="grid gap-4 md:grid-cols-2"><input name="name" value={form.name} onChange={handleInputChange} placeholder="Product name" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required /><select name="category" value={form.category} onChange={handleInputChange} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required><option value="">Select category</option>{CATEGORY_OPTIONS.map((category) => <option key={category} value={category}>{category}</option>)}</select></div>
                  <textarea name="description" value={form.description} onChange={handleInputChange} rows="4" placeholder="Product description" className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required />
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]"><input name="basePrice" type="number" step="0.01" value={form.basePrice} onChange={handleInputChange} placeholder="Base price if no variant section" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" /><label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-zinc-300"><input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleInputChange} className="accent-white" />New arrival</label></div>
                  <div className="rounded-[28px] border border-white/8 bg-black/30 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Variant Sections</p><p className="mt-1 text-sm text-zinc-400">Select a size and color, then add a dedicated pricing section for that combination.</p></div><button type="button" onClick={handleAddVariant} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"><Plus size={15} />Add section</button></div><div className="mt-4 grid gap-3 md:grid-cols-2"><select name="variantSize" value={form.variantSize} onChange={handleInputChange} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30"><option value="">Select size</option>{sizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}</select><select name="variantColor" value={form.variantColor} onChange={handleInputChange} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30"><option value="">Select color</option>{colorOptions.map((color) => <option key={color} value={color}>{color}</option>)}</select></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="flex gap-2"><input name="customSize" value={form.customSize} onChange={handleInputChange} placeholder="Custom size" className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30" /><button type="button" onClick={() => addCustomOption('variantSize', 'customSize')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">Use</button></div><div className="flex gap-2"><input name="customColor" value={form.customColor} onChange={handleInputChange} placeholder="Custom color" className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30" /><button type="button" onClick={() => addCustomOption('variantColor', 'customColor')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">Use</button></div></div><div className="mt-4 space-y-3">{form.variants.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/70 px-4 py-5 text-sm text-zinc-500">No size and color pricing sections have been added yet. You can save with a base price or create sections above.</div> : form.variants.map((variant, index) => <div key={variant.id} className="grid gap-3 rounded-2xl border border-white/8 bg-zinc-950 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_auto]"><div className="rounded-2xl border border-white/8 px-3 py-3 text-sm text-zinc-300">{variant.size || 'Default size'}</div><div className="rounded-2xl border border-white/8 px-3 py-3 text-sm text-zinc-300">{variant.color || 'Default color'}</div><input type="number" step="0.01" value={variant.price} onChange={(event) => handleVariantPriceChange(variant.id, event.target.value)} placeholder={`Section ${index + 1} price`} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" /><button type="button" onClick={() => handleRemoveVariant(variant.id)} className="inline-flex items-center justify-center rounded-2xl border border-red-500/20 px-3 py-3 text-red-300 transition hover:bg-red-500/10"><Trash2 size={15} /></button></div>)}</div></div>
                  <div className="rounded-[28px] border border-white/8 bg-black/30 p-4"><div className="flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="sale" checked={form.sale} onChange={handleInputChange} className="accent-white" />Put on sale</label>{effectiveSellingPrice && <p className="text-sm text-zinc-400">Current selling price starts at Rs {Number(effectiveSellingPrice).toLocaleString('en-IN')}</p>}</div>{form.sale && <div className="mt-4 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]"><input name="discountPercentage" type="number" min="1" max="99" value={form.discountPercentage} onChange={handleInputChange} placeholder="Discount %" className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30" /><div className="rounded-2xl border border-white/8 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">{compareAtPrice ? `Customers will see a compare-at price of Rs ${Number(compareAtPrice).toLocaleString('en-IN')}.` : 'Enter a discount percentage to auto-calculate the compare-at price.'}</div></div>}</div>
                  <div className="space-y-3"><div className="rounded-[28px] border border-dashed border-white/10 bg-black/40 p-4"><label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"><ImagePlus className="h-6 w-6 text-white" /><span className="text-sm text-zinc-300">Upload up to 4 product images</span><span className="text-xs text-zinc-500">Responsive previews appear below. File names remain hidden.</span><input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" /></label></div>{allImages.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{form.existingImages.map((url, index) => <div key={`existing-${url}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"><img src={resolveImageUrl(url) || PRODUCT_IMAGE_FALLBACK_SRC} alt="Existing product" className="h-full w-full object-cover" onError={handleProductImageError} /><button type="button" onClick={() => removeExistingImage(index)} className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-black"><X size={14} /></button></div>)}{previewImages.map((image, index) => <div key={image.id} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"><img src={image.url} alt="New product" className="h-full w-full object-cover" /><button type="button" onClick={() => removeNewImage(index)} className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-black"><X size={14} /></button></div>)}</div>}</div>
                  <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-70"><Save size={15} />{saving ? 'Saving...' : (form.id ? 'Update product' : 'Create product')}</button>{form.id && <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:text-white">Reset</button>}</div>
                </form>

                <div className="rounded-4xl border border-white/10 bg-zinc-950 p-5">
                  <h3 className="text-lg font-semibold text-white">Products</h3>
                  <div className="mt-4 space-y-3">{products.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3"><img src={resolveImageUrl(product.imageUrls?.[0] || product.imageUrl) || PRODUCT_IMAGE_FALLBACK_SRC} alt={product.name} className="h-16 w-14 rounded-xl object-cover" onError={handleProductImageError} /><div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm text-white">{product.name}</p><p className="mt-1 text-xs text-zinc-500">{product.sizes?.join(', ') || 'No sizes'} • {product.colors?.join(', ') || 'No colors'}</p></div><div className="flex gap-2"><button type="button" onClick={() => handleEdit(product)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-300">Edit</button><button type="button" onClick={() => handleDelete(product.id)} className="rounded-full border border-red-500/20 px-3 py-2 text-xs text-red-300"><Trash2 size={14} /></button></div></div>)}</div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && <div className="space-y-4">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminConsoleNext
