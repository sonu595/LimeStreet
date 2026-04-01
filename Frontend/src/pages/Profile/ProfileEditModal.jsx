import React from 'react'
import { Save, X } from 'lucide-react'

const ProfileEditModal = ({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
  message,
  error
}) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Account</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Edit Profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-zinc-400 transition hover:text-white"
            aria-label="Close profile editor"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-5 py-5 sm:px-6">
          {message && <div className="mb-4 border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
          {error && <div className="mb-4 border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Full name</span>
              <input name="name" value={form.name} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Phone number</span>
              <input name="contactNumber" value={form.contactNumber} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Address line 1</span>
              <input name="addressLine1" value={form.addressLine1} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Address line 2</span>
              <input name="addressLine2" value={form.addressLine2} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">City</span>
              <input name="city" value={form.city} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">State</span>
              <input name="state" value={form.state} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Postal code</span>
              <input name="postalCode" value={form.postalCode} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Country</span>
              <input name="country" value={form.country} onChange={onChange} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-70">
                <Save size={15} />
                {saving ? 'Saving...' : 'Save profile'}
              </button>
              <button type="button" onClick={onClose} className="border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditModal
