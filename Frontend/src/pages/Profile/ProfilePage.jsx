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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your profile, orders and preferences</p>
        </div>

        {/* Profile Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
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