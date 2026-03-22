export const EMPTY_STATE = { wishlist: [], cart: [] };

export const getStorageKey = (email) => (email ? `shop_state_${email}` : 'shop_state_guest');

export const readState = (key) => {
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

export const writeState = (key, state) => {
  localStorage.setItem(key, JSON.stringify(state));
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  }

  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:8080${imageUrl}`;
  }

  return imageUrl;
};

export const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const normalizeWishlistItem = (item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  color: item.color,
  brand: item.brand,
  imageUrl: item.imageUrl,
  rating: item.rating,
  reviewCount: item.reviewCount,
  stock: item.stock,
});

const normalizeCartItem = (item) => ({
  ...normalizeWishlistItem(item),
  quantity: item.quantity || 1,
});

export const normalizeShopState = (state = EMPTY_STATE) => ({
  wishlist: Array.isArray(state.wishlist) ? state.wishlist.map(normalizeWishlistItem) : [],
  cart: Array.isArray(state.cart) ? state.cart.map(normalizeCartItem) : [],
});

export const mergeShopStates = (baseState, incomingState) => {
  const base = normalizeShopState(baseState);
  const incoming = normalizeShopState(incomingState);

  const wishlistMap = new Map(base.wishlist.map((item) => [item.id, item]));
  incoming.wishlist.forEach((item) => wishlistMap.set(item.id, item));

  const cartMap = new Map(base.cart.map((item) => [item.id, item]));
  incoming.cart.forEach((item) => {
    const existing = cartMap.get(item.id);
    cartMap.set(item.id, existing ? { ...item, quantity: existing.quantity + item.quantity } : item);
  });

  return {
    wishlist: [...wishlistMap.values()],
    cart: [...cartMap.values()],
  };
};
