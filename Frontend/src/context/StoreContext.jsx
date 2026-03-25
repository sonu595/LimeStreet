/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import useAuth from './useAuth'

const StoreContext = createContext(null)

export const useStore = () => {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }

  return context
}

export const StoreProvider = ({ children }) => {
  const { isAuthenticated, token, axiosInstance, user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState('')
  const [storeLoading, setStoreLoading] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)

  const getUserStorageKey = (type) => {
    const identifier = user?.id || user?.email || 'guest'
    return `limeStreet:${type}:${identifier}`
  }

  const readLocalItems = (type) => {
    try {
      const raw = localStorage.getItem(getUserStorageKey(type))
      return raw ? JSON.parse(raw) : []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const writeLocalItems = (type, items) => {
    localStorage.setItem(getUserStorageKey(type), JSON.stringify(items))
  }

  const isServerSession = Boolean(isAuthenticated && token)

  const resetStore = () => {
    setCartItems([])
    setWishlistItems([])
    setOrders([])
    setOrdersError('')
  }

  const fetchCart = async () => {
    if (!isServerSession) {
      setCartItems([])
      return []
    }

    try {
      const response = await axiosInstance.get('/cart')
      const items = Array.isArray(response.data) ? response.data : []
      setCartItems(items)
      writeLocalItems('cart', items)
      return items
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const fetchWishlist = async () => {
    if (!isServerSession) {
      setWishlistItems([])
      return []
    }

    try {
      const response = await axiosInstance.get('/wishlist')
      const items = Array.isArray(response.data) ? response.data : []
      setWishlistItems(items)
      writeLocalItems('wishlist', items)
      return items
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const fetchOrders = async () => {
    if (!isServerSession) {
      setOrders([])
      setOrdersError('')
      return []
    }

    try {
      const response = await axiosInstance.get('/orders/my')
      const nextOrders = Array.isArray(response.data) ? response.data : []
      setOrders(nextOrders)
      setOrdersError('')
      return nextOrders
    } catch (error) {
      console.log(error)
      setOrders([])
      setOrdersError(error.response?.data?.message || 'Unable to load your orders right now.')
      return []
    }
  }

  const refreshStore = async () => {
    if (!isServerSession) {
      resetStore()
      return
    }

    setStoreLoading(true)

    try {
      await Promise.all([fetchCart(), fetchWishlist(), fetchOrders()])
    } finally {
      setStoreLoading(false)
    }
  }

  useEffect(() => {
    if (isServerSession) {
      refreshStore()
    } else {
      resetStore()
    }
  }, [isServerSession])

  const normalizeProductInput = (productOrId) =>
    typeof productOrId === 'object' && productOrId !== null
      ? { ...productOrId, id: productOrId.productId || productOrId.id }
      : { id: productOrId }

  const createLocalCartItem = (product, quantity, options = {}) => ({
    id: `local-cart-${product.id}-${options.selectedSize || 'default'}-${options.selectedColor || 'default'}`,
    productId: product.id,
    quantity,
    selectedSize: options.selectedSize || product.sizes?.[0] || '',
    selectedColor: options.selectedColor || product.colors?.[0] || '',
    productName: product.name || 'Product',
    productImage: product.imageUrls?.[0] || product.imageUrl || '',
    productCategory: product.category || 'Product',
    price: Number(product.price || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    discountPercentage: product.discountPercentage || null,
    productSizes: product.sizes?.length
      ? product.sizes
      : product.size
        ? product.size.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    productColors: product.colors?.length ? product.colors : []
  })

  const createLocalWishlistItem = (product) => ({
    id: `local-wishlist-${product.id}`,
    productId: product.id,
    productName: product.name || 'Product',
    productImage: product.imageUrls?.[0] || product.imageUrl || '',
    productCategory: product.category || 'Product',
    price: Number(product.price || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    discountPercentage: product.discountPercentage || null,
    productSizes: product.sizes?.length
      ? product.sizes
      : product.size
        ? product.size.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    productColors: product.colors?.length ? product.colors : []
  })

  const addToCart = async (productOrId, quantity = 1, options = {}) => {
    const product = normalizeProductInput(productOrId)
    const payload = {
      productId: product.id,
      quantity,
      selectedSize: options.selectedSize || product.sizes?.[0] || '',
      selectedColor: options.selectedColor || product.colors?.[0] || ''
    }

    try {
      const response = await axiosInstance.post('/cart', payload)
      await fetchCart()
      return response.data
    } catch (error) {
      if (isServerSession) {
        console.log(error)
        await fetchCart()
        return null
      }

      const existingItems = readLocalItems('cart')
      const existingItem = existingItems.find((item) =>
        item.productId === product.id &&
        item.selectedSize === payload.selectedSize &&
        item.selectedColor === payload.selectedColor
      )

      const updatedItems = existingItem
        ? existingItems.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: (item.quantity || 0) + quantity }
              : item
          )
        : [createLocalCartItem(product, quantity, payload), ...existingItems]

      writeLocalItems('cart', updatedItems)
      setCartItems(updatedItems)
      return null
    }
  }

  const updateCartQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return null
    }

    try {
      const response = await axiosInstance.put(`/cart/${cartItemId}`, { quantity })
      await fetchCart()
      return response.data
    } catch (error) {
      if (isServerSession) {
        console.log(error)
        await fetchCart()
        return null
      }

      const updatedItems = readLocalItems('cart').map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
      writeLocalItems('cart', updatedItems)
      setCartItems(updatedItems)
      return null
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await axiosInstance.delete(`/cart/${cartItemId}`)
      await fetchCart()
    } catch (error) {
      if (isServerSession) {
        console.log(error)
        await fetchCart()
        return
      }

      const updatedItems = readLocalItems('cart').filter((item) => item.id !== cartItemId)
      writeLocalItems('cart', updatedItems)
      setCartItems(updatedItems)
    }
  }

  const clearCart = async () => {
    try {
      await axiosInstance.delete('/cart')
      await fetchCart()
    } catch (error) {
      if (isServerSession) {
        console.log(error)
        await fetchCart()
        return
      }

      writeLocalItems('cart', [])
      setCartItems([])
    }
  }

  const placeOrder = async (deliveryDetails = null) => {
    setPlacingOrder(true)

    try {
      const response = await axiosInstance.post('/orders/checkout', deliveryDetails || {})
      await Promise.all([fetchCart(), fetchOrders()])
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }

  const buyNowOrder = async ({ productId, quantity = 1, selectedSize = '', selectedColor = '', deliveryDetails = null }) => {
    setPlacingOrder(true)

    try {
      const response = await axiosInstance.post('/orders/buy-now', {
        productId,
        quantity,
        selectedSize,
        selectedColor,
        ...(deliveryDetails || {})
      })
      await fetchOrders()
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.productId === productId)

  const addToWishlist = async (productOrId) => {
    const product = normalizeProductInput(productOrId)
    const productId = product.id

    try {
      const response = await axiosInstance.post('/wishlist', { productId })
      await fetchWishlist()
      return response.data
    } catch (error) {
      if (isServerSession) {
        console.log(error)
        await fetchWishlist()
        return null
      }

      const existingItems = readLocalItems('wishlist')

      if (!existingItems.some((item) => item.productId === productId)) {
        const updatedItems = [createLocalWishlistItem(product), ...existingItems]
        writeLocalItems('wishlist', updatedItems)
        setWishlistItems(updatedItems)
      }

      return null
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`)
      await fetchWishlist()
    } catch (error) {
      if (isServerSession) {
        console.log(error)
        await fetchWishlist()
        return
      }

      const updatedItems = readLocalItems('wishlist').filter((item) => item.productId !== productId)
      writeLocalItems('wishlist', updatedItems)
      setWishlistItems(updatedItems)
    }
  }

  const toggleWishlist = async (productOrId) => {
    const product = normalizeProductInput(productOrId)
    const productId = product.id

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
      return false
    }

    await addToWishlist(product)
    return true
  }

  const moveWishlistToCart = async (productOrId, options = {}) => {
    const product = normalizeProductInput(productOrId)
    const productId = product.id
    await addToCart(product, 1, options)
    await removeFromWishlist(productId)
  }

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
  const wishlistCount = wishlistItems.length
  const cartSubtotal = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0)

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        wishlistItems,
        orders,
        ordersError,
        cartCount,
        wishlistCount,
        cartSubtotal,
        storeLoading,
        placingOrder,
        fetchCart,
        fetchWishlist,
        fetchOrders,
        refreshStore,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        buyNowOrder,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveWishlistToCart,
        isInWishlist
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreContext
