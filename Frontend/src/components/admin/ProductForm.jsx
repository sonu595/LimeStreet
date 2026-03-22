import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ product = {}, onSubmit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [convertingImage, setConvertingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(product.imageUrl || '');
  
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
    imageBase64: '',        // Base64 string for new image
    imageUrl: product.imageUrl || ''  // Existing URL
  });

  const [errors, setErrors] = useState({});

  const types = ['COTTON_TSHIRT', 'POLO_TSHIRT', 'OVERSIZED_TSHIRT', 'HOODIE', 'SWEATSHIRT'];
  const designs = ['ANIME', 'CARTOON', 'MOVIES', 'MUSIC', 'FUNNY', 'QUOTES', 'ABSTRACT', 'NATURE', 'RETRO', 'MINIMALIST'];
  const categories = ['MEN', 'WOMEN', 'KIDS', 'ACCESSORIES'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const fabrics = ['Cotton', 'Polyester', 'Linen', 'Wool', 'Silk', 'Blend'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Navy', 'Brown'];

  // ✅ Convert File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    setConvertingImage(true);
    
    try {
      // Convert file to Base64
      const base64String = await fileToBase64(file);
      
      setForm({
        ...form,
        imageBase64: base64String,
        imageUrl: ''  // Clear old URL if any
      });
      
      // Preview
      setImagePreview(base64String);
      
    } catch (error) {
      console.error('Error converting file:', error);
      alert('Failed to process image');
    } finally {
      setConvertingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required';
    if (!form.stock || form.stock < 0) newErrors.stock = 'Valid stock is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.imageBase64 && !form.imageUrl) newErrors.image = 'Product image is required';
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
      // ✅ Prepare JSON data
      const submitData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        tshirtType: form.tshirtType,
        designCategory: form.designCategory,
        fabric: form.fabric,
        size: form.size,
        color: form.color,
        brand: form.brand,
        // Send Base64 if new image, otherwise send existing URL
        imageBase64: form.imageBase64,
        imageUrl: form.imageUrl
      };
      
      // Remove empty fields
      if (!submitData.imageBase64) delete submitData.imageBase64;
      if (!submitData.imageUrl) delete submitData.imageUrl;
      
      await onSubmit(submitData);
      
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
              placeholder="e.g., Nike, Adidas"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {types.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Design Category and Fabric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design Category
            </label>
            <select
              value={form.designCategory}
              onChange={(e) => setForm({...form, designCategory: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
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
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows="3"
            placeholder="Product description, features, care instructions..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image *
          </label>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setForm({...form, imageBase64: '', imageUrl: ''});
                  setImagePreview('');
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={convertingImage}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          
          {convertingImage && (
            <p className="text-blue-500 text-sm mt-1">Converting image to Base64...</p>
          )}
          
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, GIF, WebP. Max size: 5MB. Image will be sent as Base64
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || convertingImage}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : (product.id ? 'Update Product' : 'Create Product')}
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