import React, { useEffect, useMemo, useState } from 'react'
import { Edit3, LogOut, Mail, MapPin, Phone, User2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import ProfileEditModal from './ProfileEditModal'

const SimpleProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
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
      setIsEditOpen(false)
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

  const profileSections = useMemo(
    () => [
      {
        label: 'Full name',
        value: form.name || 'Add your full name',
        icon: User2
      },
      {
        label: 'Email address',
        value: user?.email || 'Email not available',
        icon: Mail
      },
      {
        label: 'Phone number',
        value: form.contactNumber || 'Add your contact number',
        icon: Phone
      },
      {
        label: 'Delivery address',
        value: [form.addressLine1, form.addressLine2, form.city, form.state, form.postalCode, form.country]
          .filter(Boolean)
          .join(', ') || 'Add your delivery address',
        icon: MapPin
      }
    ],
    [form, user]
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
              <h2 className="text-xl font-semibold text-white">Profile details</h2>
              <p className="mt-1 text-sm text-zinc-400">Keep your contact and delivery information up to date for a smoother checkout experience.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMessage('')
                  setError('')
                  setIsEditOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                <Edit3 size={16} />
                Edit profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {message && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
          {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            {profileSections.map((section) => {
              const Icon = section.icon

              return (
                <div key={section.label} className="rounded-[28px] border border-white/10 bg-black/60 p-4 sm:p-5">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Icon size={18} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{section.label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">{section.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <ProfileEditModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        form={form}
        onChange={handleChange}
        onSubmit={handleSave}
        saving={saving}
        message={message}
        error={error}
      />
    </div>
  )
}

export default SimpleProfilePage
