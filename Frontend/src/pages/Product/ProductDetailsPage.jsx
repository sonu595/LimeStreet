import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { getStartingPrice, getVariantPrice } from '../../utils/productPricing'
import { buildApiUrl } from '../../utils/api'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1)

  useEffect(() => {
    setLoading(true)
    axios.get(buildApiUrl(`/products/${id}`))
      .then((response) => {
        const nextProduct = response.data
        setProduct(nextProduct)
        setSelectedSize(nextProduct.sizes?.[0] || '')
        setSelectedColor(nextProduct.colors?.[0] || '')
        setActiveImageIndex(0)
      })
      .finally(() => setLoading(false))
  }, [id])

  const productImages = useMemo(() => {
    if (!product) {
      return []
    }

    const mergedImages = [...(product.imageUrls || []), product.imageUrl]
      .filter(Boolean)
      .map((image) => image.trim())

    return Array.from(new Set(mergedImages)).slice(0, 4)
  }, [product])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">Product not found.</div>
  }

  const liked = isInWishlist(product.id)
  const activePrice = getVariantPrice(product, selectedSize, selectedColor)
  const startingPrice = getStartingPrice(product)
  const currentImage = productImages[activeImageIndex] || product.imageUrl

  const handleSelectImage = (nextIndex) => {
    setSlideDirection(nextIndex >= activeImageIndex ? 1 : -1)
    setActiveImageIndex(nextIndex)
  }

  const handleShiftImage = (step) => {
    if (productImages.length <= 1) {
      return
    }

    setSlideDirection(step > 0 ? 1 : -1)
    setActiveImageIndex((currentIndex) => {
      const totalImages = productImages.length
      return (currentIndex + step + totalImages) % totalImages
    })
  }

  const handleAddToCart = async () => {
    setBusy('cart')
    try {
      await addToCart(product, 1, { selectedSize, selectedColor })
    } finally {
      setBusy('')
    }
  }

  const handleBuyNow = () => {
    navigate(`/buy/${product.id}?size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor)}`)
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="grid gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:items-start">
          <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-176 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
            {productImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => handleSelectImage(index)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[22px] border transition lg:h-24 lg:w-full ${
                  index === activeImageIndex ? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.22)]' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
                aria-label={`Show product image ${index + 1}`}
              >
                <img src={image} alt={`${product.name} preview ${index + 1}`} className="h-full w-full object-cover" />
                {index === activeImageIndex && <div className="absolute inset-x-3 bottom-2 h-1 rounded-full bg-white/90" />}
              </button>
            ))}
          </div>

          <div className="order-1 overflow-hidden rounded-4xl border border-white/10 bg-zinc-950 lg:order-2">
            <div className="relative aspect-4/5 min-h-112 bg-black sm:min-h-136">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={currentImage || 'product-image'}
                  src={currentImage}
                  alt={product.name}
                  initial={{ opacity: 0, x: slideDirection > 0 ? 60 : -60, scale: 1.02 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDirection > 0 ? -60 : 60, scale: 0.985 }}
                  transition={{ duration: 0.30, ease: 'easeOut' }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => handleShiftImage(-1)}
                    className="absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:bg-black/80"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftImage(1)}
                    className="absolute right-8 md:right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:bg-black/80"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                {activeImageIndex + 1} / {Math.max(productImages.length, 1)}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">Gallery view</p>
                  <p className="mt-1 text-sm text-white/85 sm:text-base">Open all uploaded product angles in one place.</p>
                </div>
                <div className="hidden items-center gap-1.5 sm:flex">
                  {productImages.map((image, index) => (
                    <button
                      key={`dot-${image}-${index}`}
                      type="button"
                      onClick={() => handleSelectImage(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeImageIndex ? 'w-9 bg-white' : 'w-3 bg-white/35'
                      }`}
                      aria-label={`Open image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{product.category}</p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-2xl font-semibold text-white">{formatPrice(activePrice)}</p>
            {product.originalPrice && <p className="text-sm text-zinc-500 line-through">{formatPrice(product.originalPrice)}</p>}
          </div>
          {startingPrice !== activePrice && (
            <p className="mt-1 text-xs text-zinc-500">Starting price {formatPrice(startingPrice)}</p>
          )}

          <p className="mt-5 text-sm leading-7 text-zinc-300">{product.description}</p>

          {!!product.sizes?.length && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Select size and check price</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`rounded-full border px-3 py-2 text-xs transition ${selectedSize === size ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!!product.colors?.length && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Select color</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`rounded-full border px-3 py-2 text-xs transition ${selectedColor === color ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-3xl border border-white/8 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Selected variant</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 px-3 py-1.5">{selectedSize || 'Default size'}</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">{selectedColor || 'Default color'}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-black">{formatPrice(activePrice)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={handleAddToCart} disabled={busy === 'cart'} className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8">
              <ShoppingBag size={16} />
              {busy === 'cart' ? 'Adding...' : 'Add to cart'}
            </button>
            <button type="button" onClick={handleBuyNow} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
              Buy now
            </button>
            <button type="button" onClick={() => toggleWishlist(product)} className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8">
              <Heart size={16} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'white'} />
              {liked ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
