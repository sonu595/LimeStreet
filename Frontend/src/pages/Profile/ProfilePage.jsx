import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { useStore } from '../../context/StoreContext';

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, axiosInstance } = useAuth();
  const { 
    cartItems, 
    wishlistItems, 
    cartCount, 
    wishlistCount,
    updateCartQuantity,
    removeFromCart,
    moveWishlistToCart,
    removeFromWishlist
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/users/me');
        setProfile(response.data);
      } catch (error) {
        console.log(error);
        setProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          contactNumber: user.contactNumber,
          createdAt: user.createdAt
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axiosInstance, user]);

  const displayUser = profile || user;
  const displayName = displayUser?.name || 'User';
  const email = displayUser?.email || 'No email available';
  const userId = displayUser?.id ? `#${displayUser.id}` : 'Not available';
  const joinedDate = displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : 'Not available';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'cart', label: 'Cart', count: cartCount },
    { id: 'wishlist', label: 'Wishlist', count: wishlistCount },
    { id: 'orders', label: 'Orders', count: 0 },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          <p className="mt-4 text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ==================== MOBILE LAYOUT ====================
  const MobileLayout = () => (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-4 py-6">
        {/* Profile Header - Compact */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center text-2xl font-medium text-white">
              {avatarLetter}
            </div>
            <div className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
          </div>
          <h1 className="text-xl font-semibold text-white mt-3">{displayName}</h1>
          <p className="text-xs text-gray-400 mt-1">{email}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-zinc-950 rounded-xl border border-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-white">{cartCount}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Cart Items</p>
          </div>
          <div className="bg-zinc-950 rounded-xl border border-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-white">{wishlistCount}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Wishlist</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-zinc-950 rounded-2xl border border-white/10 p-5 min-h-[350px]">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Personal Details</h2>
              <div className="space-y-3">
                <div className="border-b border-white/10 pb-2">
                  <p className="text-[10px] text-gray-500">Full Name</p>
                  <p className="text-sm text-white mt-0.5">{displayName}</p>
                </div>
                <div className="border-b border-white/10 pb-2">
                  <p className="text-[10px] text-gray-500">Email</p>
                  <p className="text-sm text-white mt-0.5 break-all">{email}</p>
                </div>
                <div className="border-b border-white/10 pb-2">
                  <p className="text-[10px] text-gray-500">Phone</p>
                  <p className="text-sm text-white mt-0.5">{displayUser?.contactNumber || 'Not added'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Member Since</p>
                  <p className="text-sm text-white mt-0.5">{joinedDate}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cart' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold text-white">Cart</h2>
                {cartCount > 0 && (
                  <button onClick={() => cartItems.forEach(item => removeFromCart(item.productId))} className="text-xs text-red-400">
                    Clear
                  </button>
                )}
              </div>
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">Empty cart</p>
                  <button onClick={() => navigate('/')} className="mt-3 text-xs text-white bg-white/10 px-4 py-1.5 rounded-full">Shop</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <img src={item.productImage} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-xs text-white line-clamp-1">{item.productName}</p>
                        <p className="text-xs font-semibold text-white mt-0.5">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) - 1)} className="w-5 h-5 rounded-full bg-white/10 text-xs">-</button>
                          <span className="text-xs text-white">{item.quantity || 1}</span>
                          <button onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) + 1)} className="w-5 h-5 rounded-full bg-white/10 text-xs">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-gray-500 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">Empty wishlist</p>
                  <button onClick={() => navigate('/')} className="mt-3 text-xs text-white bg-white/10 px-4 py-1.5 rounded-full">Explore</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <img src={item.productImage} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-xs text-white line-clamp-1">{item.productName}</p>
                        <p className="text-xs font-semibold text-white mt-0.5">{formatPrice(item.price)}</p>
                      </div>
                      <button onClick={() => moveWishlistToCart(item)} className="text-xs text-white bg-white/10 px-2 py-1 rounded-full">Move</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No orders yet</p>
              <button onClick={() => navigate('/')} className="mt-3 text-xs text-white bg-white/10 px-4 py-1.5 rounded-full">Start Shopping</button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full mt-4 py-2.5 rounded-full border border-white/15 text-sm text-gray-400 hover:bg-white/5">
          Logout
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-white/10">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center py-1.5 px-3 rounded-full ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
              <div className="relative">
                {tab.id === 'overview' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                {tab.id === 'cart' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                {tab.id === 'wishlist' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                {tab.id === 'orders' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                {tab.count > 0 && <span className="absolute -top-1 -right-2 bg-white text-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{tab.count}</span>}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== DESKTOP LAYOUT ====================
  const DesktopLayout = () => (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Welcome Back</p>
              <h1 className="text-5xl font-bold text-white mt-2">{displayName}</h1>
              <p className="text-gray-400 mt-2 max-w-xl">{email}</p>
            </div>
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 flex items-center justify-center text-4xl font-medium text-white shadow-2xl">
                {avatarLetter}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-1">
            <div className="sticky top-8 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.id === 'overview' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    {tab.id === 'cart' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                    {tab.id === 'wishlist' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                    {tab.id === 'orders' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white/10 text-gray-300'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
              <div className="pt-8 mt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-3">
            <div className="bg-zinc-950 rounded-3xl border border-white/10 p-8 min-h-[600px]">
              
              {/* Overview */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-b border-white/10 pb-3">
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-base text-white mt-1">{displayName}</p>
                      </div>
                      <div className="border-b border-white/10 pb-3">
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-base text-white mt-1">{email}</p>
                      </div>
                      <div className="border-b border-white/10 pb-3">
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-base text-white mt-1">{displayUser?.contactNumber || 'Not added'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b border-white/10 pb-3">
                        <p className="text-xs text-gray-500">User ID</p>
                        <p className="text-base text-white mt-1">{userId}</p>
                      </div>
                      <div className="border-b border-white/10 pb-3">
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-base text-white mt-1">{joinedDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Status</p>
                        <p className="text-base text-green-500 mt-1">Active ✓</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                    <div className="bg-black/50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-white">{cartCount}</p>
                      <p className="text-xs text-gray-500 mt-1">Items in Cart</p>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-white">{wishlistCount}</p>
                      <p className="text-xs text-gray-500 mt-1">Wishlist Items</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart */}
              {activeTab === 'cart' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>
                    {cartCount > 0 && (
                      <button onClick={() => cartItems.forEach(item => removeFromCart(item.productId))} className="text-sm text-red-400 hover:text-red-300">
                        Clear Cart
                      </button>
                    )}
                  </div>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400">Your cart is empty</p>
                      <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200">Continue Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-black/30 border border-white/10">
                          <img src={item.productImage} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">{item.productCategory}</p>
                            <h3 className="text-base font-medium text-white mt-1">{item.productName}</h3>
                            <div className="flex items-center justify-between mt-3">
                              <div>
                                <p className="text-lg font-semibold text-white">{formatPrice(item.price)}</p>
                                {item.originalPrice && <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                                  <button onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) - 1)} className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center">-</button>
                                  <span className="text-white w-8 text-center">{item.quantity || 1}</span>
                                  <button onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) + 1)} className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.productId)} className="text-gray-500 hover:text-red-400">Remove</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                        <p className="text-gray-400">Subtotal</p>
                        <p className="text-2xl font-bold text-white">{formatPrice(cartItems.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0))}</p>
                      </div>
                      <button className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200">Proceed to Checkout</button>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">My Wishlist</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400">Your wishlist is empty</p>
                      <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200">Explore Products</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-black/30 border border-white/10">
                          <img src={item.productImage} className="w-full h-40 rounded-xl object-cover mb-3" />
                          <p className="text-xs text-gray-500">{item.productCategory}</p>
                          <h3 className="text-sm font-medium text-white mt-1 line-clamp-2">{item.productName}</h3>
                          <p className="text-base font-semibold text-white mt-2">{formatPrice(item.price)}</p>
                          <button onClick={() => moveWishlistToCart(item)} className="w-full mt-3 bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Move to Cart</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders */}
              {activeTab === 'orders' && (
                <div className="text-center py-16">
                  <p className="text-gray-400">No orders placed yet</p>
                  <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200">Start Shopping</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Responsive Layout Switch
  return (
    <>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
    </>
  );
};

export default ProfilePage;