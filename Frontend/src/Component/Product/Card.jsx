import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const Card = ({ product }) => {
  const [busyAction, setBusyAction] = useState('')
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()

  const currentProduct = product || {}
  const productImage = currentProduct.imageUrls?.[0] || currentProduct.imageUrl
  const sizes = currentProduct.sizes?.length
    ? currentProduct.sizes
    : currentProduct.size
      ? currentProduct.size.split(',').map((item) => item.trim()).filter(Boolean)
      : []
  const colors = currentProduct.colors?.length ? currentProduct.colors : []
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(colors[0] || '')

  useEffect(() => {
    setSelectedSize(sizes[0] || '')
    setSelectedColor(colors[0] || '')
  }, [currentProduct.id])

  if (!product) return null

  const formattedPrice = Number(product.price || 0).toLocaleString('en-IN')
  const formattedOriginalPrice = product.originalPrice
    ? Number(product.originalPrice).toLocaleString('en-IN')
    : null
  const liked = isInWishlist(currentProduct.id)

  const handleWishlistToggle = async (event) => {
    event.stopPropagation()
    setBusyAction('wishlist')

    try {
      await toggleWishlist(currentProduct)
    } finally {
      setBusyAction('')
    }
  }

  const handleAddToCart = async (event) => {
    event.stopPropagation()
    setBusyAction('cart')

    try {
      await addToCart(currentProduct, 1, {
        selectedSize,
        selectedColor
      })
    } finally {
      setBusyAction('')
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <div
        onClick={() => navigate(`/product/${currentProduct.id}`)}
        className="relative h-[240px] overflow-hidden bg-black sm:h-[260px]"
      >
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {product.newArrival && (
            <span className="rounded-full border border-white/15 bg-black/70 px-2 py-1 text-[10px] tracking-[0.2em] text-white">
              NEW
            </span>
          )}
          {product.sale && (
            <span className="rounded-full bg-red-500/85 px-2 py-1 text-[10px] font-medium text-white">
              {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SALE'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={busyAction === 'wishlist'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90 disabled:opacity-60"
        >
          <Heart
            size={16}
            fill={liked ? '#ef4444' : 'none'}
            color={liked ? '#ef4444' : 'white'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">{product.category || 'Streetwear'}</p>
          <h3 className="line-clamp-2 text-sm font-medium text-white sm:text-[15px]">{product.name}</h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-white sm:text-lg">Rs {formattedPrice}</p>
            {formattedOriginalPrice && (
              <p className="text-[11px] text-zinc-500 line-through">Rs {formattedOriginalPrice}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={busyAction === 'cart'}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/7 px-3 py-2 text-[11px] font-medium tracking-wide text-white transition hover:bg-white/12 disabled:opacity-60"
          >
            <ShoppingBag size={13} />
            {busyAction === 'cart' ? 'ADDING' : 'ADD'}
          </button>
        </div>

        {sizes.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] transition ${
                    selectedSize === size ? 'border-white bg-white text-black' : 'border-white/12 text-zinc-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {colors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] transition ${
                    selectedColor === color ? 'border-white bg-white text-black' : 'border-white/12 text-zinc-400 hover:text-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => navigate(`/product/${currentProduct.id}`)}
            className="flex-1 rounded-2xl border border-white/12 px-3 py-2 text-[11px] font-medium text-white transition hover:bg-white/8"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => navigate(`/buy/${currentProduct.id}?size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor)}`)}
            className="flex-1 rounded-2xl bg-white px-3 py-2 text-[11px] font-medium text-black transition hover:bg-zinc-200"
          >
            Buy now
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default Card
