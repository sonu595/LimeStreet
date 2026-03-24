import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { FolderKanban, ImagePlus, LayoutDashboard, Package2, Pencil, Shield, Tags, Trash2, Upload } from 'lucide-react'
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
    if (!window.confirm('Delete this product?')) {
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

  const renderProductManager = () => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.3fr]">
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
        <div className="mb-6 flex items-center gap-3">
          <FolderKanban className="h-6 w-6 text-white" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Product Form</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {form.id ? 'Edit Product' : 'Create Product'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
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

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            rows="4"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Selling price"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
              required
            />
            <input
              name="originalPrice"
              type="number"
              value={form.originalPrice}
              onChange={handleChange}
              placeholder="Original price"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="Sizes e.g. S, M, L, XL"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            />
            <input
              name="colors"
              value={form.colors}
              onChange={handleChange}
              placeholder="Colors e.g. Black, White, Olive"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-black px-4 py-4 text-sm text-gray-300">
            <Upload className="h-5 w-5 text-white" />
            <span>Upload up to 4 product images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(form.imageFiles.length > 0
              ? form.imageFiles.map((file) => file.name)
              : form.existingImages
            ).map((image, index) => (
              <div key={`${image}-${index}`} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-xs text-gray-400">
                {typeof image === 'string' ? image.split('/').pop() : image}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleChange} />
              New Arrival
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} />
              Sale
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-60"
            >
              {saving ? 'Saving...' : form.id ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Package2 className="h-6 w-6 text-white" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Products</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Manage Existing Products</h2>
          </div>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-white/10 bg-black p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <img
                    src={product.imageUrls?.[0] || product.imageUrl}
                    alt={product.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-400">{product.category}</p>
                    <p className="mt-2 text-sm text-gray-300">Rs {formatCurrency(product.price)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.newArrival && (
                        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white">NEW</span>
                      )}
                      {product.sale && (
                        <span className="rounded-full bg-white text-[11px] font-medium text-black px-3 py-1">
                          {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SALE'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-gray-400 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 px-3 py-3">
                  Sizes: {product.sizes?.join(', ') || product.size || 'N/A'}
                </div>
                <div className="rounded-xl border border-white/10 px-3 py-3">
                  Colors: {product.colors?.join(', ') || 'N/A'}
                </div>
                <div className="rounded-xl border border-white/10 px-3 py-3">
                  Images: {product.imageUrls?.length || (product.imageUrl ? 1 : 0)}
                </div>
              </div>
            </div>
          ))}

          {!loading && products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-black px-6 py-12 text-center text-gray-400">
              No products available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-zinc-950 p-5 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Admin Panel</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">LimeStreet Admin</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Simple black dashboard for product management, discounts, images, sizes, and colors.
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
              onClick={() => setActiveSection('products')}
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
