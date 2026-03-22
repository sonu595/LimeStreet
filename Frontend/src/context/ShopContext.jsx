import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { shopApi } from '../services/shopApi';
import {
  EMPTY_STATE,
  getStorageKey,
  mergeShopStates,
  normalizeShopState,
  readState,
  writeState,
} from '../utils/shop';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = useMemo(() => getStorageKey(user?.email), [user?.email]);
  const hasMergedGuestState = useRef(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [stores, setStores] = useState(() => ({
    [storageKey]: normalizeShopState(readState(storageKey)),
  }));

  const activeStore = stores[storageKey] || EMPTY_STATE;
  const wishlist = activeStore.wishlist;
  const cart = activeStore.cart;

  const persistState = async (nextState) => {
    if (user?.email) {
      setIsSyncing(true);
      try {
        const response = await shopApi.updateState(nextState);
        const normalized = normalizeShopState(response.data.data);
        writeState(storageKey, normalized);
        setStores((prev) => ({ ...prev, [storageKey]: normalized }));
        return normalized;
      } catch (error) {
        console.error('Failed to sync shop state', error);
        toast.error('Failed to sync your cart. Please try again.');
        throw error;
      } finally {
        setIsSyncing(false);
      }
    }

    writeState(storageKey, nextState);
    setStores((prev) => ({ ...prev, [storageKey]: nextState }));
    return nextState;
  };

  useEffect(() => {
    let ignore = false;

    const loadStore = async () => {
      if (!user?.email) {
        hasMergedGuestState.current = false;
        const guestState = normalizeShopState(readState(storageKey));
        setStores((prev) => ({ ...prev, [storageKey]: guestState }));
        return;
      }

      setIsSyncing(true);
      try {
        const response = await shopApi.getState();
        const remoteState = normalizeShopState(response.data.data);
        const guestState = hasMergedGuestState.current
          ? EMPTY_STATE
          : normalizeShopState(readState(getStorageKey()));
        const mergedState = mergeShopStates(remoteState, guestState);

        if (ignore) return;

        writeState(storageKey, mergedState);
        setStores((prev) => ({ ...prev, [storageKey]: mergedState }));

        if (JSON.stringify(mergedState) !== JSON.stringify(remoteState)) {
          await shopApi.updateState(mergedState);
        }

        if (!hasMergedGuestState.current && (guestState.cart.length || guestState.wishlist.length)) {
          writeState(getStorageKey(), EMPTY_STATE);
        }

        hasMergedGuestState.current = true;
      } catch (error) {
        console.error('Failed to fetch shop state', error);
        if (!ignore) {
          const fallback = normalizeShopState(readState(storageKey));
          setStores((prev) => ({ ...prev, [storageKey]: fallback }));
        }
      } finally {
        if (!ignore) {
          setIsSyncing(false);
        }
      }
    };

    loadStore();

    return () => {
      ignore = true;
    };
  }, [storageKey, user?.email]);

  const updateStore = (updater) => {
    const current = activeStore || normalizeShopState(readState(storageKey));
    const next = normalizeShopState(updater(current));
    setStores((prev) => ({ ...prev, [storageKey]: next }));

    persistState(next).catch(() => {
      setStores((prev) => ({ ...prev, [storageKey]: current }));
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

  const addToCart = (product, quantity = 1) => {
    const exists = cart.some((item) => item.id === product.id);

    updateStore((current) => {
      const existing = current.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          ...current,
          cart: current.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...current,
        cart: [...current.cart, { ...product, quantity }],
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
        isSyncing,
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
