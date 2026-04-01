import React from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { checkoutSteps, formatPrice, SummaryItems } from './checkoutShared.jsx'

const Stepper = ({ currentStep, loggedIn }) => (
  <div className="border-b border-white/10 px-6 py-5">
    <div className="mx-auto flex max-w-4xl items-start justify-between gap-3">
      {checkoutSteps.map((step, index) => {
        const isCompleted = step.id === 1 ? loggedIn : currentStep > step.id
        const isCurrent = currentStep === step.id

        return (
          <React.Fragment key={step.id}>
            <div className="flex min-w-0 flex-1 flex-col items-center text-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm ${
                isCompleted
                  ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200'
                  : isCurrent
                    ? 'border-white/35 bg-white/10 text-white'
                    : 'border-white/10 bg-black/30 text-zinc-500'
              }`}>
                {isCompleted ? <Check size={16} /> : step.id}
              </div>
              <p className={`mt-2 text-sm font-medium ${isCompleted || isCurrent ? 'text-white' : 'text-zinc-500'}`}>
                {step.label}
              </p>
            </div>
            {index < checkoutSteps.length - 1 && (
              <div className={`mt-5 h-px flex-1 ${currentStep > step.id || (step.id === 1 && loggedIn) ? 'bg-emerald-300/40' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  </div>
)

const CheckoutFrame = ({
  currentStep,
  loggedIn,
  title,
  description,
  backTo,
  error,
  items,
  subtotal,
  deliveryCharge,
  platformFee,
  totalAmount,
  children
}) => (
  <div className="min-h-screen bg-black">
    <Stepper currentStep={currentStep} loggedIn={loggedIn} />

    <div className="min-h-[calc(100vh-92px)] lg:grid lg:grid-cols-[minmax(0,1fr)_380px]">
      <main className="flex min-h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Checkout</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
            {description && <p className="mt-2 text-sm text-zinc-400">{description}</p>}
          </div>
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-white sm:gap-2 sm:text-sm">
            <ChevronLeft size={14} />
            Back
          </Link>
        </div>

        {error && (
          <div className="mx-6 mt-5 border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex-1 px-6 py-6">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center">
            {children}
          </div>
        </div>
      </main>

      <aside className="flex h-full flex-col border-l border-white/10 bg-zinc-950/90">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">Order summary</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <SummaryItems items={items} />
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery</span>
              <span className="text-white">{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Platform fee</span>
              <span className="text-white">{formatPrice(platformFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
)

export default CheckoutFrame
