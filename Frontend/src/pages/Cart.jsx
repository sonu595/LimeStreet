import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { useShop } from '../context/ShopContext';

const Cart = () => {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, clearCart } = useShop();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Your Cart</h1>
            <p className="text-gray-600 mt-2">Items are saved per user account on this browser.</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">
              Clear Cart
            </button>
          )}
        </motion.div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">₹{item.price} each</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 rounded-full border border-gray-300"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}

            <div className="bg-black text-white rounded-2xl p-6 flex items-center justify-between">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
