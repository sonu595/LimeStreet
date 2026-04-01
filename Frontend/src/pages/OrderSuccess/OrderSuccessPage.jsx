import React, { useEffect } from 'react'
import { Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const OrderSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const order = location.state?.order

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/orders', { replace: true })
    }, 3200)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-zinc-950 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-emerald-400/20">
            <Check className="h-9 w-9 text-emerald-300" />
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-emerald-300">Order Confirmed</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Thank you for shopping</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Your order has been placed successfully. You will be redirected to your order history in a moment.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Active orders can be cancelled from your order history before the final delivery stage.
        </p>

        {order && (
          <div className="mt-6 rounded-[24px] border border-white/8 bg-black/30 p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Order #{order.id}</p>
                <p className="mt-1 text-sm text-zinc-400">{order.items?.length || 0} item(s)</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white">
                {formatPrice(order.totalAmount)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderSuccessPage
