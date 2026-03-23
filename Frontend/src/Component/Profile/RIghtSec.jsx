// RIghtSec.jsx - Main Profile Content
import React, { useState } from 'react';
import { MapPin, CreditCard, Package, Calendar, Truck, CheckCircle } from 'lucide-react';

// Sample Order Data
const sampleOrders = [
  {
    id: '#ORD-001',
    date: '2024-01-15',
    total: 2499,
    status: 'Delivered',
    items: 2,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop'
  },
  {
    id: '#ORD-002',
    date: '2024-01-20',
    total: 3999,
    status: 'Processing',
    items: 1,
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=100&h=100&fit=crop'
  },
  {
    id: '#ORD-003',
    date: '2024-02-01',
    total: 1599,
    status: 'Shipped',
    items: 3,
    image: 'https://images.unsplash.com/photo-1562155955-1cb2d73488d7?w=100&h=100&fit=crop'
  }
];

// Sample Addresses
const sampleAddresses = [
  {
    id: 1,
    name: 'Home',
    address: '123 Main Street, Apartment 4B, New York, NY 10001',
    isDefault: true
  },
  {
    id: 2,
    name: 'Office',
    address: '456 Business Park, Floor 3, New York, NY 10002',
    isDefault: false
  }
];

// Sample Payment Methods
const samplePayments = [
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiry: '12/2025',
    isDefault: true
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '5555',
    expiry: '08/2024',
    isDefault: false
  }
];

const RIghtSec = ({ user, activeTab }) => {
  const displayName = user?.name || 'Guest User';
  const email = user?.email || 'No email';
  const memberSince = user?.createdAt || 'January 2024';

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'Processing': return 'text-yellow-600 bg-yellow-50';
      case 'Shipped': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Profile Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
            <Package className="w-8 h-8 text-lime-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
            <Heart className="w-8 h-8 text-lime-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reward Points</p>
              <p className="text-2xl font-bold text-gray-800">450</p>
            </div>
            <Star className="w-8 h-8 text-lime-500" />
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="font-semibold text-gray-800">Personal Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-medium text-gray-800">{displayName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email Address</label>
              <p className="font-medium text-gray-800">{email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <p className="font-medium text-gray-800">+91 98765 43210</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Member Since</label>
              <p className="font-medium text-gray-800">{memberSince}</p>
            </div>
          </div>
          <button className="text-sm text-lime-600 hover:text-lime-700 font-medium">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  // Orders Tab
  const renderOrders = () => (
    <div className="space-y-4">
      {sampleOrders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-800">{order.date}</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex gap-4">
            <img src={order.image} alt="Product" className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">Order Summary</p>
              <p className="text-sm text-gray-500">{order.items} items</p>
              <p className="text-sm font-medium text-gray-800 mt-1">₹{order.total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button className="block mt-2 text-sm text-lime-600 hover:text-lime-700">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <button className="w-full py-3 text-center text-lime-600 hover:text-lime-700 font-medium">
        View All Orders
      </button>
    </div>
  );

  // Addresses Tab
  const renderAddresses = () => (
    <div className="space-y-4">
      <button className="w-full bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition">
        + Add New Address
      </button>
      
      {sampleAddresses.map((address) => (
        <div key={address.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800">{address.name}</h4>
                  {address.isDefault && (
                    <span className="text-xs bg-lime-100 text-lime-600 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{address.address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Payment Methods Tab
  const renderPayments = () => (
    <div className="space-y-4">
      <button className="w-full bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition">
        + Add Payment Method
      </button>
      
      {samplePayments.map((payment) => (
        <div key={payment.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800">{payment.type} ending in {payment.last4}</h4>
                  {payment.isDefault && (
                    <span className="text-xs bg-lime-100 text-lime-600 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Expires {payment.expiry}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              <button className="text-sm text-red-500 hover:text-red-700">Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Wishlist Tab
  const renderWishlist = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <img 
              src={`https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`}
              alt="Product"
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <h4 className="font-medium text-gray-800">Premium Cotton Shirt</h4>
              <p className="text-sm text-gray-500 mt-1">₹1,299</p>
              <button className="w-full mt-3 bg-lime-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-lime-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'addresses' && renderAddresses()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'wishlist' && renderWishlist()}
      </div>
    </div>
  );
};

// Import missing icons
import { Heart, Star } from 'lucide-react';

export default RIghtSec;