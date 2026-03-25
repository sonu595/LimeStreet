import React, { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'

const SimpleProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
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
    if (!user) return

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

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
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="border-b border-white/10 bg-gradient-to-r from-zinc-950 via-black to-zinc-950">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6">
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

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
              <p className="mt-1 text-sm text-zinc-400">These details will be used for order approval and delivery.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-red-500/20 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              Logout
            </button>
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
      </div>
    </div>
  )
}

export default SimpleProfilePage
