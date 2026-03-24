import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSec from '../../Component/Profile/LeftSec';
import RIghtSec from '../../Component/Profile/RIghtSec';
import useAuth from '../../context/useAuth';
import { useStore } from '../../context/StoreContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, axiosInstance } = useAuth();
  const { cartItems, wishlistItems, cartCount, wishlistCount } = useStore();
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
          role: user.role
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axiosInstance, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          <p className="mt-4 text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-white/10 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">My Profile</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400 md:text-base">
            Is page par current logged-in user ka real profile, cart aur wishlist data show ho raha hai.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <LeftSec 
            user={profile || user} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
          <RIghtSec
            user={profile || user}
            activeTab={activeTab}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
