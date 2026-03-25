import React, { useEffect, useState } from 'react'
import { Package, Save, ShoppingBag, User2 } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import { useStore } from '../../context/StoreContext'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const TABS = [
  { id: 'overview', label: 'Profile', icon: User2 },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'cart', label: 'Cart', icon: ShoppingBag }
]

const UserProfilePage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, logout, updateProfile } = useAuth()
  const {
    orders,
    cartItems,
    wishlistItems,
    fetchOrders,
    updateCartQuantity,
    removeFromCart,
    moveWishlistToCart,
    removeFromWishlist
  } = useStore()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  })

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'overview')
  }, [searchParams])

  useEffect(() => {
    if (!user) {
      return
    }

    setForm({
      name: user.name || '',
      contactNumber: user.contactNumber || '',
      addressLine1: user.addressLine1 || '',
      addressLine2: user.addressLine2 || '',
      city: user.city || '',
      state: user.state || '',
      postalCode: user.postalCode || '',
      country: user.country || 'India'
    })
  }, [user])

  useEffect(() => {
    fetchOrders()
  }, [])

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await updateProfile(form)
      setMessage('Profile updated successfully.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isProfileComplete = Boolean(
    form.name &&
    form.contactNumber &&
    form.addressLine1 &&
    form.city &&
    form.state &&
    form.postalCode
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-white/10 bg-gradient-to-r from-zinc-950 via-black to-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Account</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{user?.name || 'Profile'}</h1>
            <p className="mt-2 text-sm text-zinc-400">{user?.email}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-300">
            {isProfileComplete ? 'Profile complete' : 'Address details pending'}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-white/10 bg-zinc-950 p-3 lg:sticky lg:top-24 lg:h-fit">
          <div className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  activeTab === id ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border border-red-500/20 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                  <p className="mt-1 text-sm text-zinc-400">These details will be used for order approval and delivery.</p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400">
                  Wishlist: {wishlistItems.length} items
                </div>
              </div>

              {message && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
              {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

              <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Full name</span>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Phone number</span>
                  <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Address line 1</span>
                  <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Address line 2</span>
                  <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">City</span>
                  <input name="city" value={form.city} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">State</span>
                  <input name="state" value={form.state} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Postal code</span>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Country</span>
                  <input name="country" value={form.country} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <div className="md:col-span-2">
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-70">
                    <Save size={15} />
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Order History</h2>
                  <p className="mt-1 text-sm text-zinc-400">Approved orders will show delivery timing here.</p>
                </div>
                <button type="button" onClick={fetchOrders} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:text-white">
                  Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-white/12 bg-black/30 px-6 py-14 text-center">
                  <p className="text-sm text-zinc-400">No orders yet.</p>
                  <Link to="/" className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <article key={order.id} className="rounded-[28px] border border-white/10 bg-black/30 p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Order #{order.id}</p>
                          <p className="mt-1 text-sm text-zinc-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white">{order.status}</span>
                          {order.deliveryDays != null && <span className="rounded-full border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300">ETA {order.deliveryDays} days</span>}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {order.items?.map((item) => (
                          <div key={`${order.id}-${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 rounded-2xl border border-white/8 bg-zinc-950 p-3">
                            <img src={item.productImage} alt={item.productName} className="h-16 w-14 rounded-xl object-cover" />
                            <div className="min-w-0">
                              <p className="line-clamp-2 text-sm text-white">{item.productName}</p>
                              <p className="mt-1 text-xs text-zinc-500">{item.selectedSize || 'One size'} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                              <p className="mt-2 text-sm font-medium text-white">{item.quantity} x {formatPrice(item.unitPrice)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                        <div className="text-sm text-zinc-400">Delivery address: {order.addressLine1}, {order.city}, {order.state} {order.postalCode}</div>
                        <div className="text-base font-semibold text-white">{formatPrice(order.totalAmount)}</div>
                      </div>

                      {order.adminNote && <p className="mt-3 rounded-2xl border border-white/8 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">{order.adminNote}</p>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Quick Cart View</h2>
                <p className="mt-1 text-sm text-zinc-400">You can adjust quantity here or continue to full cart.</p>
              </div>

              <div className="space-y-3">
                {cartItems.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-white/12 bg-black/30 px-6 py-12 text-center text-sm text-zinc-400">
                    Cart is empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-[24px] border border-white/10 bg-black/30 p-3">
                      <img src={item.productImage} alt={item.productName} className="h-20 w-16 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm text-white">{item.productName}</p>
                        <p className="mt-1 text-xs text-zinc-500">{item.selectedSize || 'Default'} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-full border border-white/10 bg-zinc-950 px-1">
                            <button type="button" onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)} className="rounded-full p-2 hover:bg-white/10">-</button>
                            <span className="w-8 text-center text-sm text-white">{item.quantity || 1}</span>
                            <button type="button" onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)} className="rounded-full p-2 hover:bg-white/10">+</button>
                          </div>
                          <button type="button" onClick={() => removeFromCart(item.id)} className="text-xs text-zinc-500 transition hover:text-red-400">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <h3 className="text-sm font-medium text-white">Wishlist</h3>
                  <div className="mt-3 space-y-2">
                    {wishlistItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-zinc-950 px-3 py-2">
                        <p className="line-clamp-1 text-sm text-zinc-300">{item.productName}</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => moveWishlistToCart(item, { selectedSize: item.productSizes?.[0] || '', selectedColor: item.productColors?.[0] || '' })} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-black">Move</button>
                          <button type="button" onClick={() => removeFromWishlist(item.productId)} className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-400">Remove</button>
                        </div>
                      </div>
                    ))}
                    {wishlistItems.length === 0 && <p className="text-sm text-zinc-500">Wishlist is empty.</p>}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <h3 className="text-sm font-medium text-white">Need the full checkout flow?</h3>
                  <p className="mt-2 text-sm text-zinc-400">Open the dedicated cart page to place your order and review totals.</p>
                  <Link to="/cart" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200">
                    Go to cart
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default UserProfilePage
