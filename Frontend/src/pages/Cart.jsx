import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useShop } from '../context/ShopContext';
import { formatCurrency, getImageUrl } from '../utils/shop';

const Cart = () => {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, clearCart, isSyncing } = useShop();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-28 pb-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Your Cart</h1>
            <p className="text-slate-600 mt-2">
              {isSyncing ? 'Syncing your latest cart changes...' : 'Your cart is now ready across sessions for signed-in users.'}
            </p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="px-4 py-2 rounded-full border border-slate-300 hover:bg-white bg-white/70">
              Clear Cart
            </button>
          )}
        </motion.div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[28px] p-10 text-center shadow-sm text-slate-600 border border-slate-200">
            <p>Your cart is empty.</p>
            <Link to="/products" className="inline-block mt-5 px-6 py-3 rounded-full bg-slate-900 text-white">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6 items-start">
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[28px] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="h-24 w-20 rounded-2xl object-cover bg-slate-100"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-slate-500 text-sm mt-1">{item.category || item.brand || 'Apparel'}</p>
                      <p className="text-slate-700 text-sm mt-2">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="h-9 w-9 rounded-full border border-slate-300"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="h-9 w-9 rounded-full border border-slate-300"
                    >
                      +
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-2 sm:ml-4 text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-900 text-white rounded-[28px] p-6 md:p-7 sticky top-24">
              <p className="text-sm uppercase tracking-[0.24em] text-white/60 mb-3">Order Summary</p>
              <div className="flex items-center justify-between text-white/80 mb-3">
                <span>Items</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-white/80 mb-6">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-lg">Total</span>
                <span className="text-2xl font-semibold">{formatCurrency(cartTotal)}</span>
              </div>
              <button className="mt-6 w-full rounded-full bg-white text-slate-900 py-3 font-medium">
                Checkout Soon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
