import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'
import { formatEstimatedDelivery, getDeliveryCountdown, getOrderDisplayStatus } from '../../utils/orderDelivery'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`
const CUSTOMER_CANCELLABLE_STATUSES = new Set(['PENDING', 'APPROVED', 'PROCESSING'])

const OrdersPage = () => {
  const { orders, ordersError, fetchOrders, storeLoading, cancelOrder } = useStore()
  const [cancelOrderId, setCancelOrderId] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [cancelSuccess, setCancelSuccess] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const sortedOrders = useMemo(() => orders, [orders])

  const startCancel = (order) => {
    setCancelOrderId(order.id)
    setCancelReason(order.cancellationReason || '')
    setCancelError('')
    setCancelSuccess('')
  }

  const resetCancelState = () => {
    setCancelOrderId(null)
    setCancelReason('')
    setCancelError('')
  }

  const submitCancellation = async (orderId) => {
    setCancelling(true)
    setCancelError('')
    setCancelSuccess('')

    try {
      await cancelOrder(orderId, cancelReason.trim())
      setCancelSuccess(`Order #${orderId} was cancelled successfully.`)
      resetCancelState()
    } catch (error) {
      setCancelError(error.message)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Order History</h1>
            <p className="mt-1 text-sm text-zinc-400">Track your active, completed, and cancelled orders in one place.</p>
          </div>
          <button type="button" onClick={fetchOrders} className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:text-white">
            Refresh
          </button>
        </div>

        {ordersError && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {ordersError}
          </div>
        )}

        {cancelSuccess && (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {cancelSuccess}
          </div>
        )}

        {cancelError && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {cancelError}
          </div>
        )}

        {storeLoading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/12 bg-zinc-950 px-6 py-14 text-center">
            <p className="text-sm text-zinc-400">No orders yet.</p>
            <Link to="/" className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const countdownLabel = getDeliveryCountdown(order)
              const expectedDeliveryLabel = formatEstimatedDelivery(order)
              const canCancel = CUSTOMER_CANCELLABLE_STATUSES.has(order.status)
              const isCancelOpen = cancelOrderId === order.id
              const displayStatus = getOrderDisplayStatus(order)

              return (
                <article key={order.id} className="rounded-[28px] border border-white/10 bg-zinc-950 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Order #{order.id}</p>
                      <p className="mt-1 text-sm text-zinc-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white">{displayStatus}</span>
                      {order.deliveryDays != null && <span className="rounded-full border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300">ETA {order.deliveryDays} days</span>}
                      {countdownLabel && <span className="rounded-full border border-sky-500/20 px-3 py-1 text-xs text-sky-300">{countdownLabel}</span>}
                  </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {order.items?.map((item) => (
                      <div key={`${order.id}-${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 rounded-2xl border border-white/8 bg-black/30 p-3">
                        <img
                          src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
                          alt={item.productName}
                          className="h-16 w-14 rounded-xl object-cover"
                          onError={handleProductImageError}
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm text-white">{item.productName}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {item.selectedSize || 'One size'} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                          </p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {item.quantity} x {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                    <div className="text-sm text-zinc-400">
                      Delivery address: {order.addressLine1}, {order.city}, {order.state} {order.postalCode}
                      {expectedDeliveryLabel ? ` • Expected by ${expectedDeliveryLabel}.` : ''}
                    </div>
                    <div className="text-base font-semibold text-white">{formatPrice(order.totalAmount)}</div>
                  </div>

                  {order.adminNote && <p className="mt-3 rounded-2xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-zinc-300">{order.adminNote}</p>}

                  {order.cancellationReason && (
                    <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      Cancellation note: {order.cancellationReason}
                    </p>
                  )}

                  {order.status === 'CANCELLED' && order.cancelledAt && (
                    <p className="mt-3 text-xs text-zinc-500">
                      Cancelled on {new Date(order.cancelledAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  )}

                  {canCancel && (
                    <div className="mt-4">
                      {isCancelOpen ? (
                        <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                          <label className="block">
                            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Cancellation note</span>
                            <textarea
                              value={cancelReason}
                              onChange={(event) => setCancelReason(event.target.value)}
                              rows="3"
                              placeholder="Optional: let us know why you want to cancel this order."
                              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                            />
                          </label>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => submitCancellation(order.id)}
                              disabled={cancelling}
                              className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-400 disabled:opacity-60"
                            >
                              {cancelling ? 'Cancelling...' : 'Confirm cancellation'}
                            </button>
                            <button
                              type="button"
                              onClick={resetCancelState}
                              disabled={cancelling}
                              className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:text-white disabled:opacity-60"
                            >
                              Keep order
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startCancel(order)}
                          className="rounded-2xl border border-red-500/25 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10"
                        >
                          Cancel order
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:text-white"
                    >
                      View tracking details
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
