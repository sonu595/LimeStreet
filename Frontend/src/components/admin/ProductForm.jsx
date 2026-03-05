import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ product = {}, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: product.name || '',
    price: product.price || '',
    stock: product.stock || '',
    tshirtType: product.tshirtType || 'COTTON_TSHIRT',
    designCategory: product.designCategory || 'ANIME',
    brand: product.brand || '',
    imageUrl: product.imageUrl || ''
  });

  const types = ['COTTON_TSHIRT', 'POLO_TSHIRT', 'OVERSIZED_TSHIRT', 'HOODIE'];
  const designs = ['ANIME', 'CARTOON', 'MOVIES', 'MUSIC', 'FUNNY', 'QUOTES'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-light mb-6">{product.id ? 'Edit' : 'Add'} Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({...form, brand: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({...form, stock: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.tshirtType}
            onChange={(e) => setForm({...form, tshirtType: e.target.value})}
            className="p-3 border rounded-lg"
          >
            {types.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>

          <select
            value={form.designCategory}
            onChange={(e) => setForm({...form, designCategory: e.target.value})}
            className="p-3 border rounded-lg"
          >
            {designs.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({...form, imageUrl: e.target.value})}
          className="w-full p-3 border rounded-lg"
          required
        />

        <div className="flex gap-4 pt-4">
          <button type="submit" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
            {product.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-3 border rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;