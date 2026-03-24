import React from 'react';
import { Heart, Package, ShoppingBag } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </div>
      <div className="rounded-2xl border border-white/10 p-3">
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 p-4">
    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{label}</p>
    <p className="mt-2 break-words text-sm font-medium text-white md:text-base">{value || 'Not added yet'}</p>
  </div>
);

const EmptyState = ({ title, description }) => (
  <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950 px-6 py-12 text-center">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400 md:text-base">{description}</p>
  </div>
);

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const ProductList = ({ items, type }) => {
  if (!items.length) {
    return (
      <EmptyState
        title={`No ${type} Items Yet`}
        description={`Jab aap products ${type === 'cart' ? 'cart me add' : 'wishlist me save'} karoge, wahi real data yahan show hoga.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${type}-${item.id}-${item.productId}`} className="rounded-3xl border border-white/10 bg-zinc-950 p-4 md:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={item.productImage}
              alt={item.productName}
              className="h-28 w-full rounded-3xl object-cover sm:w-24"
            />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{item.productCategory || 'Product'}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.productName}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span>Price: Rs {Number(item.price || 0).toLocaleString('en-IN')}</span>
                {type === 'cart' && <span>Qty: {item.quantity || 1}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RIghtSec = ({ user, activeTab, cartItems, wishlistItems, cartCount, wishlistCount }) => {
  const displayName = user?.name || 'Not available';
  const email = user?.email || 'Not available';
  const userId = user?.id ? `#${user.id}` : 'Not available';
  const joinedDate = formatDate(user?.createdAt);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Orders" value="0" />
        <StatCard icon={ShoppingBag} label="Cart Items" value={cartCount} />
        <StatCard icon={Heart} label="Wishlist" value={wishlistCount} />
        <StatCard icon={Package} label="Saved Profile" value={user?.contactNumber ? '1' : '0'} />
      </div>

      <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Personal Details</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Logged-in User Information</h2>
          <p className="mt-2 text-sm text-gray-400">
            Yahan sirf current logged-in account ka real data dikh raha hai.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoRow label="Full Name" value={displayName} />
          <InfoRow label="Email Address" value={email} />
          <InfoRow label="User ID" value={userId} />
          <InfoRow label="Phone Number" value={user?.contactNumber} />
          <InfoRow label="Login Provider" value={user?.provider} />
          <InfoRow label="Role" value={user?.role} />
          <InfoRow label="Member Since" value={joinedDate} />
          <InfoRow label="Status" value="Logged in" />
        </div>
      </section>
    </div>
  );

  const renderCart = () => <ProductList items={cartItems} type="cart" />;

  const renderOrders = () => (
    <EmptyState
      title="No Orders Yet"
      description="Order history abhi empty hai kyunki ordering system abhi build nahi hua. Jab orders aayenge, wahi real data yahan dikhaya jayega."
    />
  );

  const renderWishlist = () => <ProductList items={wishlistItems} type="wishlist" />;

  return (
    <div className="flex-1">
      <div className="rounded-3xl border border-white/10 bg-black p-4 sm:p-6 md:p-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'cart' && renderCart()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'wishlist' && renderWishlist()}
      </div>
    </div>
  );
};

export default RIghtSec;
