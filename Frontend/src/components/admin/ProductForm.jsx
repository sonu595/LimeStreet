import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ product = {}, onSubmit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    stock: product.stock || '',
    category: product.category || 'MEN',
    tshirtType: product.tshirtType || 'COTTON_TSHIRT',
    designCategory: product.designCategory || 'ANIME',
    fabric: product.fabric || 'Cotton',
    size: product.size || 'M',
    color: product.color || 'Black',
    brand: product.brand || '',
    imageUrl: product.imageUrl || ''
  });

  const [errors, setErrors] = useState({});

  const types = ['COTTON_TSHIRT', 'POLO_TSHIRT', 'OVERSIZED_TSHIRT', 'HOODIE', 'SWEATSHIRT'];
  const designs = ['ANIME', 'CARTOON', 'MOVIES', 'MUSIC', 'FUNNY', 'QUOTES', 'ABSTRACT', 'NATURE', 'RETRO', 'MINIMALIST'];
  const categories = ['MEN', 'WOMEN', 'KIDS', 'ACCESSORIES'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const fabrics = ['Cotton', 'Polyester', 'Linen', 'Wool', 'Silk', 'Blend'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Navy', 'Brown'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required';
    if (!form.stock || form.stock < 0) newErrors.stock = 'Valid stock is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // ✅ Ensure numeric fields are numbers
      const submitData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      };
      
      await onSubmit(submitData);
      // Success - navigate will happen in parent
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save product. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-light mb-6">
        {product.id ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Anime Printed T-Shirt"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand *
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({...form, brand: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.brand ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Nike, Adidas, Local Brand"
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>
        </div>

        {/* Row 2: Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({...form, price: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 999"
              min="0"
              step="1"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({...form, stock: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 100"
              min="0"
              step="1"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Row 3: Category and T-Shirt Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              T-Shirt Type
            </label>
            <select
              value={form.tshirtType}
              onChange={(e) => setForm({...form, tshirtType: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {types.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Design Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design Category
            </label>
            <select
              value={form.designCategory}
              onChange={(e) => setForm({...form, designCategory: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {designs.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fabric
            </label>
            <select
              value={form.fabric}
              onChange={(e) => setForm({...form, fabric: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {fabrics.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Size and Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={form.size}
              onChange={(e) => setForm({...form, size: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {sizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <select
              value={form.color}
              onChange={(e) => setForm({...form, color: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {colors.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            rows="3"
            placeholder="Product description, features, care instructions..."
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL *
          </label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({...form, imageUrl: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
              errors.imageUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          
          {/* Image Preview */}
          {form.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={form.imageUrl} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                }}
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              product.id ? 'Update Product' : 'Create Product'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;