import React from 'react';
import { Heart, LogOut, ShoppingBag, User } from 'lucide-react';

const LeftSec = ({ user, activeTab, onTabChange, onLogout, cartCount, wishlistCount }) => {
  const displayName = user?.name || 'User';
  const email = user?.email || 'No email available';
  const userId = user?.id ? `#${user.id}` : 'Not available';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { id: 'overview', label: 'Profile', icon: User, count: null },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, count: cartCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: 0 },
  ];

  return (
    <aside className="w-full lg:sticky lg:top-6 lg:w-80">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
        <div className="bg-black px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-lg font-semibold">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">{displayName}</h2>
              <p className="truncate text-sm text-gray-300">{email}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">User ID</p>
            <p className="mt-2 text-sm font-medium text-white">{userId}</p>
          </div>
        </div>

        <div className="p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {typeof item.count === 'number' && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${isActive ? 'bg-black text-white' : 'bg-white/10 text-gray-300'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LeftSec;
