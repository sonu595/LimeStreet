import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { FolderKanban, ImagePlus, LayoutDashboard, Package2, Pencil, Shield, Tags, Trash2, Upload, X, Plus, Save, RefreshCw, Ruler, Palette, Layers, Percent, Sparkles } from 'lucide-react'
import useAuth from '../../context/useAuth'

const CATEGORY_OPTIONS = [
  'Quotes',
  'Funny',
  'Niche-Based',
  'Illustration',
  'Aesthetic',
  'Motivational',
  'Pop Culture',
  'Desi',
  'Couple',
  'Spiritual'
]

const createEmptyForm = () => ({
  id: null,
  name: '',
  category: '',
  description: '',
  price: '',
  originalPrice: '',
  sizes: '',
  colors: '',
  newArrival: true,
  sale: false,
  existingImages: [],
  imageFiles: []
})

const parseCsv = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('en-IN')

const AdminPage = () => {
  const { user, token, axiosInstance } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(createEmptyForm())

  const stats = useMemo(() => ({
    total: products.length,
    arrivals: products.filter((item) => item.newArrival).length,
    sale: products.filter((item) => item.sale).length
  }), [products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/products')
      setProducts(response.data)
    } catch (fetchError) {
      setError('Failed to load products.')
      console.log(fetchError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setForm(createEmptyForm())
    setError('')
    setMessage('')
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4)
    setForm((current) => ({
      ...current,
      imageFiles: files
    }))
  }

  const removeImage = (indexToRemove) => {
    setForm((current) => ({
      ...current,
      imageFiles: current.imageFiles.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  const handleEdit = (product) => {
    setActiveSection('products')
    setMessage('')
    setError('')
    setForm({
      id: product.id,
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      sizes: product.sizes?.length ? product.sizes.join(', ') : (product.size || ''),
      colors: product.colors?.length ? product.colors.join(', ') : '',
      newArrival: Boolean(product.newArrival),
      sale: Boolean(product.sale),
      existingImages: product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []),
      imageFiles: []
    })
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product permanently?')) {
      return
    }

    try {
      setError('')
      setMessage('')
      await axiosInstance.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMessage('Product deleted successfully.')
      fetchProducts()
    } catch (deleteError) {
      console.log(deleteError)
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

        const uploadResponse = await axiosInstance.post('/products/upload-images', uploadForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        imageUrls = uploadResponse.data.imageUrls
      }

      const sizes = parseCsv(form.sizes)
      const colors = parseCsv(form.colors)

      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        sizes,
        colors,
        size: sizes.join(', '),
        imageUrls,
        imageUrl: imageUrls[0] || '',
        newArrival: form.newArrival,
        sale: form.sale
      }

      if (form.id) {
        await axiosInstance.put(`/products/${form.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setMessage('Product updated successfully.')
      } else {
        await axiosInstance.post('/products', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setMessage('Product created successfully.')
      }

      resetForm()
      fetchProducts()
    } catch (submitError) {
      console.log(submitError)
      setError(submitError.response?.data?.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Total Products</p>
          <p className="mt-3 text-4xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">New Arrivals</p>
          <p className="mt-3 text-4xl font-semibold text-white">{stats.arrivals}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Sale Products</p>
          <p className="mt-3 text-4xl font-semibold text-white">{stats.sale}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-white" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Admin Account</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{user?.name || 'Admin'}</h2>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Email</p>
            <p className="mt-2 text-sm text-white md:text-base">{user?.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Role</p>
            <p className="mt-2 text-sm text-white md:text-base">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProductManager = () => {
    // Combine existing and new images for preview
    const allPreviewImages = [
      ...form.existingImages.map((url, idx) => ({ url, type: 'existing', id: `existing-${idx}` })),
      ...form.imageFiles.map((file, idx) => ({ url: URL.createObjectURL(file), type: 'new', id: `new-${idx}`, index: idx }))
    ]

    return (
      <div className="space-y-6">
        {/* Enhanced Product Form */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
          <div className="border-b border-white/10 bg-black/30 px-6 py-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-6 w-6 text-white" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Product Form</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {form.id ? 'Edit Product' : 'Create New Product'}
                </h2>
              </div>
            </div>
            {form.id && (
              <button
                onClick={resetForm}
                className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to New
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Oversized Graphic Tee"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Detailed product description, materials, fit, care instructions..."
                rows="4"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30 resize-y"
                required
              />
            </div>

            {/* Price Section with Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">Selling Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="1999"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">Original Price (₹)</label>
                <input
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="2999"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <label className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-white/5">
                  <input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleChange} className="accent-white" />
                  <Sparkles className="h-4 w-4" />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-white/5">
                  <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} className="accent-white" />
                  <Percent className="h-4 w-4" />
                  Sale
                </label>
              </div>
            </div>

            {/* Sizes and Colors with Live Chips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5 flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" /> Sizes (comma separated)
                </label>
                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL, XXL"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
                {form.sizes && parseCsv(form.sizes).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parseCsv(form.sizes).map((size, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/15 text-xs px-2.5 py-1 rounded-full text-gray-300">
                        {size}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5 flex items-center gap-1">
                  <Palette className="h-3.5 w-3.5" /> Colors (comma separated)
                </label>
                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="Black, White, Navy, Olive"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
                {form.colors && parseCsv(form.colors).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parseCsv(form.colors).map((color, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/15 text-xs px-2.5 py-1 rounded-full text-gray-300">
                        {color}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Area with Preview Grid */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> Product Images (max 4)
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-2xl bg-black/30 p-6 transition hover:border-white/30 hover:bg-black/40">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  id="imageUpload"
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="flex flex-col items-center justify-center cursor-pointer gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-300">Click to upload or drag & drop</span>
                  <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 4 images</span>
                </label>
              </div>

              {allPreviewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Image Preview ({allPreviewImages.length}/4)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {allPreviewImages.map((img, idx) => (
                      <div key={img.id} className="relative group rounded-xl border border-white/15 bg-black overflow-hidden aspect-square">
                        <img src={img.url} alt="preview" className="h-full w-full object-cover" />
                        {img.type === 'new' && (
                          <button
                            type="button"
                            onClick={() => removeImage(img.index)}
                            className="absolute top-1 right-1 bg-black/80 rounded-full p-1 text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {img.type === 'existing' && (
                          <div className="absolute bottom-1 left-1 bg-black/70 text-[10px] px-1.5 py-0.5 rounded-full text-gray-300">
                            saved
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-60"
              >
                {saving ? (
                  'Saving...'
                ) : form.id ? (
                  <>
                    <Save className="h-4 w-4" />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Product
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Product List - Enhanced Cards */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Package2 className="h-6 w-6 text-white" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Inventory</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Manage Products · {products.length} items</h2>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-black transition-all hover:border-white/20 hover:bg-white/5"
                >
                  <div className="p-5 flex flex-col lg:flex-row gap-5">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageUrls?.[0] || product.imageUrl}
                        alt={product.name}
                        className="h-24 w-24 rounded-2xl object-cover border border-white/10 shadow-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                          <p className="text-sm text-gray-400">{product.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10 transition flex items-center gap-1.5"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10 transition flex items-center gap-1.5"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 line-clamp-2">{product.description}</p>

                      {/* Price & Badges */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                        <span className="font-semibold text-white text-lg">₹ {formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">₹ {formatCurrency(product.originalPrice)}</span>
                        )}
                        {product.newArrival && (
                          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white">
                            🔥 NEW
                          </span>
                        )}
                        {product.sale && (
                          <span className="rounded-full bg-white text-[11px] font-bold text-black px-3 py-1">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2">
                          <Ruler className="h-3 w-3" />
                          <span>Sizes: {product.sizes?.join(', ') || product.size || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2">
                          <Palette className="h-3 w-3" />
                          <span>Colors: {product.colors?.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2">
                          <Layers className="h-3 w-3" />
                          <span>Images: {product.imageUrls?.length || (product.imageUrl ? 1 : 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && !loading && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-black px-6 py-16 text-center text-gray-400">
                  <Package2 className="mx-auto h-10 w-10 opacity-50 mb-3" />
                  No products available yet. Create your first product using the form above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-zinc-950 p-5 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Admin Panel</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">LimeStreet Admin</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Streamlined product management with enhanced form layout and inventory control.
          </p>

          <div className="mt-8 space-y-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                activeSection === 'dashboard' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection('products')}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                activeSection === 'products' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              <ImagePlus className="h-4 w-4" />
              Products
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
            >
              <Tags className="h-4 w-4" />
              Manage Discounts
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Signed In As</p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{user?.name}</h2>
                <p className="mt-1 text-sm text-gray-400">{user?.email}</p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                Role: {user?.role}
              </div>
            </div>
          </div>

          {message && (
            <div className="rounded-2xl border border-white/10 bg-white px-5 py-4 text-sm font-medium text-black">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {activeSection === 'dashboard' ? renderDashboard() : renderProductManager()}
        </main>
      </div>
    </div>
  )
}

export default AdminPage