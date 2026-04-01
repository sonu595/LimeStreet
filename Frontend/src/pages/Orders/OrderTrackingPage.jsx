import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, MapPin, PackageCheck, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'
import {
  formatEstimatedDelivery,
  getDeliveryCountdown,
  getOrderDisplayStatus,
  getOrderTrackingSteps
} from '../../utils/orderDelivery'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const stepStyles = {
  completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  current: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  upcoming: 'border-white/10 bg-black/30 text-zinc-400',
  cancelled: 'border-red-500/20 bg-red-500/10 text-red-200'
}

const OrderTrackingPage = () => {
  const { id } = useParams()
  const { axiosInstance } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    axiosInstance.get(`/orders/my/${id}`)
      .then((response) => {
        setOrder(response.data)
      })
      .catch((fetchError) => {
        setError(fetchError.response?.data?.message || 'Unable to load this order right now.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [axiosInstance, id])

  const trackingSteps = useMemo(() => getOrderTrackingSteps(order), [order])
  const displayStatus = getOrderDisplayStatus(order)
  const countdownLabel = getDeliveryCountdown(order)
  const expectedDelivery = formatEstimatedDelivery(order)

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-zinc-950 p-6 text-center">
          <p className="text-lg font-semibold text-white">Order unavailable</p>
          <p className="mt-2 text-sm text-zinc-400">{error || 'We could not find this order.'}</p>
          <Link to="/orders" className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
            Back to order history
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
          <ArrowLeft size={15} />
          Back to order history
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Order #{order.id}</p>
                  <h1 className="mt-2 text-2xl font-semibold text-white">Live order tracking</h1>
                  <p className="mt-2 text-sm text-zinc-400">Follow each step of your order from confirmation to delivery.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white">{displayStatus}</span>
                  {countdownLabel && <span className="rounded-full border border-sky-500/20 px-3 py-1.5 text-xs text-sky-300">{countdownLabel}</span>}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {trackingSteps.map((step, index) => (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${stepStyles[step.state]}`}>
                        {index < 2 ? <PackageCheck size={16} /> : <Truck size={16} />}
                      </div>
                      {index < trackingSteps.length - 1 && <div className="mt-2 h-full w-px bg-white/10" />}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-medium text-white">{step.title}</p>
                      <p className="mt-1 text-sm text-zinc-400">{step.description}</p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {step.time.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.status === 'CANCELLED' && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {order.cancellationReason ? `Cancellation note: ${order.cancellationReason}` : 'This order was cancelled before delivery.'}
                </div>
              )}
            </section>

            <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <PackageCheck className="text-white" size={18} />
                <h2 className="text-lg font-semibold text-white">Items in this order</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {order.items?.map((item) => (
                  <div key={`${order.id}-${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 rounded-2xl border border-white/8 bg-black/30 p-3">
                    <img
                      src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
                      alt={item.productName}
                      className="h-20 w-16 rounded-xl object-cover"
                      onError={handleProductImageError}
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-white">{item.productName}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Qty {item.quantity} • {item.selectedSize || 'Default size'} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">{formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">Delivery summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-400">Status</span>
                  <span className="text-white">{displayStatus}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-400">Estimated delivery</span>
                  <span className="text-white text-right">{expectedDelivery || 'Updating soon'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-400">Total paid</span>
                  <span className="text-white">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-white" />
                <h2 className="text-lg font-semibold text-white">Delivery address</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                {order.customerName}<br />
                {order.addressLine1}<br />
                {order.addressLine2 ? <>{order.addressLine2}<br /></> : null}
                {order.city}, {order.state} {order.postalCode}<br />
                {order.country || 'India'}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
