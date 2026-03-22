import { createContext, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

const EMPTY_STATE = { wishlist: [], cart: [] };
const getStorageKey = (email) => (email ? `shop_state_${email}` : 'shop_state_guest');

const readState = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return EMPTY_STATE;

    const parsed = JSON.parse(raw);
    return {
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
    };
  } catch (error) {
    console.error('Failed to read shop state', error);
    return EMPTY_STATE;
  }
};

const writeState = (key, state) => {
  localStorage.setItem(key, JSON.stringify(state));
};

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = useMemo(() => getStorageKey(user?.email), [user?.email]);

  const [stores, setStores] = useState(() => ({
    [storageKey]: readState(storageKey),
  }));

  const activeStore = stores[storageKey] || EMPTY_STATE;
  const wishlist = activeStore.wishlist;
  const cart = activeStore.cart;

  const updateStore = (updater) => {
    setStores((prev) => {
      const current = prev[storageKey] || readState(storageKey);
      const next = updater(current);
      writeState(storageKey, next);
      return { ...prev, [storageKey]: next };
    });
  };

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product.id);

    updateStore((current) => ({
      ...current,
      wishlist: exists
        ? current.wishlist.filter((item) => item.id !== product.id)
        : [...current.wishlist, product],
    }));

    if (exists) {
      toast('Removed from wishlist');
    } else {
      toast.success('Added to wishlist');
    }
  };

  const addToCart = (product) => {
    const exists = cart.some((item) => item.id === product.id);

    updateStore((current) => {
      const existing = current.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          ...current,
          cart: current.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...current,
        cart: [...current.cart, { ...product, quantity: 1 }],
      };
    });

    if (exists) {
      toast.success('Quantity updated in cart');
    } else {
      toast.success('Added to cart');
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    updateStore((current) => {
      if (quantity <= 0) {
        return {
          ...current,
          cart: current.cart.filter((item) => item.id !== productId),
        };
      }

      return {
        ...current,
        cart: current.cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  };

  const removeFromCart = (productId) => {
    updateStore((current) => ({
      ...current,
      cart: current.cart.filter((item) => item.id !== productId),
    }));
    toast('Item removed from cart');
  };

  const clearCart = () => {
    updateStore((current) => ({
      ...current,
      cart: [],
    }));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        cartTotal,
        isInWishlist,
        toggleWishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};
