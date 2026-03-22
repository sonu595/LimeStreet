import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Navbar from '../components/layout/Navbar';
import { useShop } from '../context/ShopContext';
import { formatCurrency, getImageUrl } from '../utils/shop';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 md:mb-8 text-sm md:text-base text-slate-600 hover:text-slate-950 transition"
          >
            Back to Products
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-6 md:gap-10 items-start">
            <div className="bg-gradient-to-br from-stone-100 via-white to-emerald-50 rounded-[32px] overflow-hidden border border-stone-200">
              <img
                src={imageError ? getImageUrl('') : getImageUrl(product.imageUrl)}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-[420px] sm:h-[560px] object-cover"
              />
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-7 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {product.category || 'Apparel'}
                </span>
                {product.brand && (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                    {product.brand}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 mb-4">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <p className="text-2xl sm:text-3xl font-semibold text-slate-900">{formatCurrency(product.price)}</p>
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-700">
                  <span>Rating</span>
                  <span>{product.rating || 0}</span>
                  <span className="text-amber-500">/</span>
                  <span>{product.reviewCount || 0} reviews</span>
                </div>
              </div>

              <p className="text-slate-600 leading-7 mb-6">
                {product.description || 'A clean everyday essential built for comfort and repeat wear.'}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Color</p>
                  <p className="text-sm font-medium text-slate-700">{product.color || 'Classic tone'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Fabric</p>
                  <p className="text-sm font-medium text-slate-700">{product.fabric || 'Premium cotton blend'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Fit</p>
                  <p className="text-sm font-medium text-slate-700">{product.size || 'Regular fit'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Delivery</p>
                  <p className="text-sm font-medium text-slate-700">Ships in 2-4 days</p>
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-slate-200 p-4">
                {product.stock > 0 ? (
                  <p className="text-emerald-600 font-medium">In stock ({product.stock} available)</p>
                ) : (
                  <p className="text-red-500 font-medium">Out of Stock</p>
                )}
              </div>

              {product.stock > 0 && (
                <>
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <label className="block text-slate-700 font-medium">Quantity</label>
                    <div className="inline-flex items-center rounded-full border border-slate-300 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="h-10 w-10 rounded-full text-lg text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="min-w-12 text-center font-semibold text-slate-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                        className="h-10 w-10 rounded-full text-lg text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => addToCart(product, quantity)}
                      className="flex-1 px-6 py-3.5 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition"
                    >
                      Add {quantity} to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`px-6 py-3.5 rounded-full border transition ${
                        isInWishlist(product.id)
                          ? 'border-rose-200 bg-rose-50 text-rose-600'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-900'
                      }`}
                    >
                      {isInWishlist(product.id) ? 'Saved' : 'Save to Wishlist'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
