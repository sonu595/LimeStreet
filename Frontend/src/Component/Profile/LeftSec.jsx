// LeftSec.jsx - Simple Sidebar Menu
import React from 'react';
import { User, ShoppingBag, MapPin, CreditCard, Heart, LogOut } from 'lucide-react';

const LeftSec = ({ user, activeTab, onTabChange, onLogout }) => {
  const displayName = user?.name || 'Guest User';
  const email = user?.email || 'No email';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { id: 'overview', label: 'Profile Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* User Info */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {avatarLetter}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{displayName}</h3>
            <p className="text-sm text-lime-100">{email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-lime-50 text-lime-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default LeftSec;