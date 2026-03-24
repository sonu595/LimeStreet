import React from 'react';
import { CreditCard, Heart, MapPin, Package } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-black">{value}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 p-3">
        <Icon className="h-5 w-5 text-black" />
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 p-4">
    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{label}</p>
    <p className="mt-2 break-words text-sm font-medium text-black md:text-base">{value}</p>
  </div>
);

const EmptyState = ({ title, description }) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
    <h3 className="text-xl font-semibold text-black">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 md:text-base">{description}</p>
  </div>
);

const RIghtSec = ({ user, activeTab }) => {
  const displayName = user?.name || 'Not available';
  const email = user?.email || 'Not available';
  const userId = user?.id ? `#${user.id}` : 'Not available';

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Orders" value="0" />
        <StatCard icon={MapPin} label="Addresses" value="0" />
        <StatCard icon={CreditCard} label="Payments" value="0" />
        <StatCard icon={Heart} label="Wishlist" value="0" />
      </div>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Personal Details</p>
          <h2 className="mt-2 text-2xl font-semibold text-black">Logged-in User Information</h2>
          <p className="mt-2 text-sm text-gray-600">
            Yahan sirf current logged-in account ka real data dikh raha hai.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoRow label="Full Name" value={displayName} />
          <InfoRow label="Email Address" value={email} />
          <InfoRow label="User ID" value={userId} />
          <InfoRow label="Status" value="Logged in" />
        </div>
      </section>
    </div>
  );

  const renderOrders = () => (
    <EmptyState
      title="No Orders Yet"
      description="Order history abhi empty hai kyunki ordering system abhi build nahi hua. Jab orders aayenge, wahi real data yahan dikhaya jayega."
    />
  );

  const renderAddresses = () => (
    <EmptyState
      title="No Saved Addresses"
      description="Address management abhi connected nahi hai. Future me user ke real saved addresses yahin show honge."
    />
  );

  const renderPayments = () => (
    <EmptyState
      title="No Payment Methods"
      description="Payment methods abhi add nahi hue hain. Is section ko intentionally clean aur empty rakha gaya hai."
    />
  );

  const renderWishlist = () => (
    <EmptyState
      title="Wishlist Is Empty"
      description="Wishlist feature abhi active nahi hai, isliye koi sample products ya fake data show nahi kiya gaya."
    />
  );

  return (
    <div className="flex-1">
      <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'addresses' && renderAddresses()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'wishlist' && renderWishlist()}
      </div>
    </div>
  );
};

export default RIghtSec;
