import React, { useEffect, useState } from 'react'
import { Phone, X } from 'lucide-react'

const createFormState = (details = {}) => ({
  contactNumber: details.contactNumber || '',
  addressLine1: details.addressLine1 || '',
  addressLine2: details.addressLine2 || '',
  city: details.city || '',
  state: details.state || '',
  postalCode: details.postalCode || ''
})

const OrderDetailsModal = ({
  open,
  onClose,
  onConfirm,
  onSkip,
  initialDetails,
  submitting,
  savedDetailsComplete,
  title = 'Confirm delivery details'
}) => {
  const [form, setForm] = useState(createFormState(initialDetails))

  useEffect(() => {
    if (open) {
      setForm(createFormState(initialDetails))
    }
  }, [open, initialDetails])

  if (!open) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const isFormComplete = Boolean(
    form.contactNumber &&
    form.addressLine1 &&
    form.city &&
    form.state &&
    form.postalCode
  )

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/72 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-xl rounded-t-[28px] border border-white/10 bg-zinc-950 p-4 shadow-2xl sm:rounded-[28px] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Delivery</p>
            <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{title}</h2>
            <p className="mt-1 text-xs text-zinc-400">You can update the phone number or address for this order only.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-zinc-400 transition hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/8 bg-black/30 px-3 py-2 text-xs text-zinc-300">
          <Phone size={13} className="text-zinc-500" />
          <span>If you skip this step, we will use your saved profile details.</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Mobile number</span>
            <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Address line 1</span>
            <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Address line 2</span>
            <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">City</span>
            <input name="city" value={form.city} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">State</span>
            <input name="state" value={form.state} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Postal code</span>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onSkip}
            disabled={!savedDetailsComplete || submitting}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => onConfirm(form)}
            disabled={!isFormComplete || submitting}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Placing order...' : 'Use this address'}
          </button>
        </div>

        {!savedDetailsComplete && (
          <p className="mt-3 text-xs text-amber-300">
            Your saved profile is incomplete, so skip is disabled.
          </p>
        )}
      </div>
    </div>
  )
}

export default OrderDetailsModal
