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
  const [storeLoading, setStoreLoading] = useState(false)

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

  const resetStore = () => {
    setCartItems([])
    setWishlistItems([])
  }

  const fetchCart = async () => {
    if (!isAuthenticated || !token) {
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
      const items = readLocalItems('cart')
      setCartItems(items)
      return items
    }
  }

  const fetchWishlist = async () => {
    if (!isAuthenticated || !token) {
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
      const items = readLocalItems('wishlist')
      setWishlistItems(items)
      return items
    }
  }

  const refreshStore = async () => {
    if (!isAuthenticated || !token) {
      resetStore()
      return
    }

    setStoreLoading(true)

    try {
      await Promise.all([fetchCart(), fetchWishlist()])
    } finally {
      setStoreLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && token) {
      refreshStore()
    } else {
      resetStore()
    }
  }, [isAuthenticated, token])

  const normalizeProductInput = (productOrId) =>
    typeof productOrId === 'object' && productOrId !== null
      ? { ...productOrId, id: productOrId.productId || productOrId.id }
      : { id: productOrId }

  const createLocalCartItem = (product, quantity) => ({
    id: `local-cart-${product.id}`,
    productId: product.id,
    quantity,
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
        : []
  })

  const createLocalWishlistItem = (product) => ({
    id: `local-wishlist-${product.id}`,
    productId: product.id,
    productName: product.name || 'Product',
    productImage: product.imageUrls?.[0] || product.imageUrl || '',
    productCategory: product.category || 'Product',
    price: Number(product.price || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    discountPercentage: product.discountPercentage || null
  })

  const addToCart = async (productOrId, quantity = 1) => {
    const product = normalizeProductInput(productOrId)
    const productId = product.id
    try {
      const response = await axiosInstance.post('/cart', { productId, quantity })
      await fetchCart()
      return response.data
    } catch (error) {
      const existingItems = readLocalItems('cart')
      const existingItem = existingItems.find((item) => item.productId === productId)
      const updatedItems = existingItem
        ? existingItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: (item.quantity || 0) + quantity }
              : item
          )
        : [
            createLocalCartItem(product, quantity),
            ...existingItems
          ]

      writeLocalItems('cart', updatedItems)
      setCartItems(updatedItems)
      return null
    }
  }

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return null
    }

    try {
      const response = await axiosInstance.put(`/cart/${productId}`, { quantity })
      await fetchCart()
      return response.data
    } catch (error) {
      const updatedItems = readLocalItems('cart').map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
      writeLocalItems('cart', updatedItems)
      setCartItems(updatedItems)
      return null
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`)
      await fetchCart()
    } catch (error) {
      const updatedItems = readLocalItems('cart').filter((item) => item.productId !== productId)
      writeLocalItems('cart', updatedItems)
      setCartItems(updatedItems)
    }
  }

  const clearCart = async () => {
    try {
      await axiosInstance.delete('/cart')
      await fetchCart()
    } catch (error) {
      writeLocalItems('cart', [])
      setCartItems([])
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
      const existingItems = readLocalItems('wishlist')

      if (!existingItems.some((item) => item.productId === productId)) {
        const updatedItems = [
          createLocalWishlistItem(product),
          ...existingItems
        ]
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

  const moveWishlistToCart = async (productOrId) => {
    const product = normalizeProductInput(productOrId)
    const productId = product.id
    await addToCart(product, 1)
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
        cartCount,
        wishlistCount,
        cartSubtotal,
        storeLoading,
        fetchCart,
        fetchWishlist,
        refreshStore,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
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
