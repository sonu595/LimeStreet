import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react'
import useAuth from '../../context/useAuth'
import { buildApiUrl } from '../../utils/api'

const CATEGORY_OPTIONS = ['Quotes', 'Funny', 'Niche-Based', 'Illustration', 'Aesthetic', 'Motivational', 'Pop Culture', 'Desi', 'Couple', 'Spiritual']
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL']
const COLOR_OPTIONS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Beige']

const createProductForm = () => ({
  id: null,
  name: '',
  category: '',
  description: '',
  price: '',
  originalPrice: '',
  sizes: [],
  colors: [],
  newArrival: true,
  sale: false,
  existingImages: [],
  imageFiles: [],
  customSize: '',
  customColor: ''
})

const OrderCard = ({ order, onSave }) => {
  const [status, setStatus] = useState(order.status || 'PENDING')
  const [deliveryDays, setDeliveryDays] = useState(order.deliveryDays ?? '')
  const [adminNote, setAdminNote] = useState(order.adminNote || '')

  return (
    <article className="rounded-[32px] border border-white/10 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Order #{order.id}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{order.customerName}</h3>
          <p className="mt-1 text-sm text-zinc-400">{order.customerEmail} • {order.contactNumber}</p>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300">
          Total Rs {Number(order.totalAmount || 0).toLocaleString('en-IN')}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Delivery Address</p>
            <p className="mt-2 text-sm text-zinc-300">
              {order.addressLine1}, {order.addressLine2 ? `${order.addressLine2}, ` : ''}{order.city}, {order.state} {order.postalCode}, {order.country}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {order.items?.map((item) => (
              <div key={`${order.id}-${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 rounded-2xl border border-white/8 bg-black/30 p-3">
                <img src={item.productImage} alt={item.productName} className="h-16 w-14 rounded-xl object-cover" />
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
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none">
            {['PENDING', 'APPROVED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'REJECTED'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <input value={deliveryDays} onChange={(event) => setDeliveryDays(event.target.value)} type="number" min="0" placeholder="Delivery days" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none" />
          <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows="4" placeholder="Admin note" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"></textarea>
          <button type="button" onClick={() => onSave(order.id, { status, deliveryDays: deliveryDays === '' ? null : Number(deliveryDays), adminNote })} className="w-full rounded-2xl bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
            Save order update
          </button>
        </div>
      </div>
    </article>
  )
}

const AdminConsole = () => {
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
    pendingOrders: orders.filter((order) => order.status === 'PENDING').length,
    approvedOrders: orders.filter((order) => order.status === 'APPROVED').length
  }), [orders, products])

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
    setMessage('')
    setError('')
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toggleOption = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value]
    }))
  }

  const addCustomOption = (key, inputKey) => {
    const value = form[inputKey].trim()
    if (!value || form[key].includes(value)) return
    setForm((current) => ({
      ...current,
      [key]: [...current[key], value],
      [inputKey]: ''
    }))
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4)
    setForm((current) => ({ ...current, imageFiles: files }))
  }

  const handleEdit = (product) => {
    setActiveTab('products')
    setForm({
      id: product.id,
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      sizes: product.sizes?.length ? product.sizes : [],
      colors: product.colors?.length ? product.colors : [],
      newArrival: Boolean(product.newArrival),
      sale: Boolean(product.sale),
      existingImages: product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []),
      imageFiles: [],
      customSize: '',
      customColor: ''
    })
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axiosInstance.delete(`/products/${productId}`)
      await fetchProducts()
      setMessage('Product deleted.')
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
      let imageUrls = form.existingImages

      if (form.imageFiles.length > 0) {
        const uploadForm = new FormData()
        form.imageFiles.forEach((file) => uploadForm.append('files', file))
        const uploadResponse = await axiosInstance.post('/products/upload-images', uploadForm, { headers: { 'Content-Type': 'multipart/form-data' } })
        imageUrls = uploadResponse.data.imageUrls || []
      }

      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        sizes: form.sizes,
        colors: form.colors,
        size: form.sizes.join(', '),
        imageUrls,
        imageUrl: imageUrls[0] || '',
        newArrival: form.newArrival,
        sale: form.sale
      }

      if (form.id) {
        await axiosInstance.put(`/products/${form.id}`, payload)
        setMessage('Product updated successfully.')
      } else {
        await axiosInstance.post('/products', payload)
        setMessage('Product created successfully.')
      }

      resetForm()
      await fetchProducts()
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleOrderUpdate = async (orderId, payload) => {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      await axiosInstance.put(`/orders/${orderId}/review`, payload)
      await fetchOrders()
      setMessage(`Order #${orderId} updated.`)
    } catch (orderError) {
      setError(orderError.response?.data?.message || 'Failed to update order.')
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
          <button type="button" onClick={refreshAll} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:text-white">
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {message && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <div className="mb-5 flex flex-wrap gap-2">
          {['dashboard', 'products', 'orders'].map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm transition ${activeTab === tab ? 'bg-white text-black' : 'border border-white/10 text-zinc-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Products</p><p className="mt-3 text-3xl font-semibold text-white">{stats.totalProducts}</p></div>
                  <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Pending Orders</p><p className="mt-3 text-3xl font-semibold text-white">{stats.pendingOrders}</p></div>
                  <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Approved Orders</p><p className="mt-3 text-3xl font-semibold text-white">{stats.approvedOrders}</p></div>
                </div>
                <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-white" />
                    <div>
                      <h2 className="text-lg font-semibold text-white">Store ready checklist</h2>
                      <p className="text-sm text-zinc-400">Products, orders, and profile-based approval flow are managed from one place.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                <form onSubmit={handleSubmit} className="space-y-4 rounded-[32px] border border-white/10 bg-zinc-950 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{form.id ? 'Edit Product' : 'Add Product'}</h2>
                      <p className="text-sm text-zinc-400">Select multiple sizes and colors for the same product.</p>
                    </div>
                    {form.id && <button type="button" onClick={resetForm} className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-400">Reset</button>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="name" value={form.name} onChange={handleInputChange} placeholder="Product name" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required />
                    <select name="category" value={form.category} onChange={handleInputChange} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required>
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </div>

                  <textarea name="description" value={form.description} onChange={handleInputChange} rows="4" placeholder="Product description" className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="price" type="number" step="0.01" value={form.price} onChange={handleInputChange} placeholder="Selling price" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" required />
                    <input name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={handleInputChange} placeholder="Original price" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {SIZE_OPTIONS.map((size) => <button key={size} type="button" onClick={() => toggleOption('sizes', size)} className={`rounded-full border px-3 py-2 text-xs transition ${form.sizes.includes(size) ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{size}</button>)}
                    </div>
                    <div className="flex gap-2">
                      <input name="customSize" value={form.customSize} onChange={handleInputChange} placeholder="Custom size" className="flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                      <button type="button" onClick={() => addCustomOption('sizes', 'customSize')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">Add</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => <button key={color} type="button" onClick={() => toggleOption('colors', color)} className={`rounded-full border px-3 py-2 text-xs transition ${form.colors.includes(color) ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{color}</button>)}
                    </div>
                    <div className="flex gap-2">
                      <input name="customColor" value={form.customColor} onChange={handleInputChange} placeholder="Custom color" className="flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                      <button type="button" onClick={() => addCustomOption('colors', 'customColor')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">Add</button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-5">
                    <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleInputChange} className="accent-white" />New arrival</label>
                    <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="sale" checked={form.sale} onChange={handleInputChange} className="accent-white" />Sale</label>
                  </div>

                  <div className="space-y-3">
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full rounded-2xl border border-dashed border-white/10 bg-black px-4 py-3 text-sm text-zinc-300" />
                    {(form.existingImages.length > 0 || form.imageFiles.length > 0) && <div className="flex flex-wrap gap-2">{form.existingImages.map((url) => <img key={url} src={url} alt="Existing product" className="h-16 w-16 rounded-2xl object-cover" />)}{form.imageFiles.map((file) => <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 rounded-2xl object-cover" />)}</div>}
                  </div>

                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-70">
                    <Save size={15} />
                    {saving ? 'Saving...' : (form.id ? 'Update product' : 'Create product')}
                  </button>
                </form>

                <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-5">
                  <h3 className="text-lg font-semibold text-white">Products</h3>
                  <div className="mt-4 space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
                        <img src={product.imageUrls?.[0] || product.imageUrl} alt={product.name} className="h-16 w-14 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm text-white">{product.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{product.sizes?.join(', ') || 'No sizes'} • {product.colors?.join(', ') || 'No colors'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEdit(product)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-300">Edit</button>
                          <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full border border-red-500/20 px-3 py-2 text-xs text-red-300"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && <div className="space-y-4">{orders.map((order) => <OrderCard key={order.id} order={order} onSave={handleOrderUpdate} />)}</div>}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminConsole
