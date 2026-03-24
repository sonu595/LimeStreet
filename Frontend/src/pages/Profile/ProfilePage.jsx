// ProfilePage.jsx - Main Profile Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSec from '../../Component/Profile/LeftSec';
import RIghtSec from '../../Component/Profile/RIghtSec';
import useAuth from '../../context/useAuth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-gray-200 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-black md:text-4xl">My Profile</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
            Sirf aapke logged-in account ka real data yahan dikh raha hai. Orders aur baaki sections abhi empty rahenge jab tak system build nahi hota.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <LeftSec 
            user={user} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout} 
          />
          <RIghtSec user={user} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
