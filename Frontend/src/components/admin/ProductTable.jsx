import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useState } from 'react';

const ProductTable = ({ products }) => {
  const navigate = useNavigate();
  const { deleteProduct } = useAdmin();
  const [imageErrors, setImageErrors] = useState({});

  // ✅ Function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3ENo%20Image%3C/text%3E%3C/svg%3E";
    }
    
    // If relative path, add base URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    
    return imageUrl;
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  console.log(products);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm">Product</th>
            <th className="px-6 py-4 text-left text-sm">Type</th>
            <th className="px-6 py-4 text-left text-sm">Price</th>
            <th className="px-6 py-4 text-left text-sm">Stock</th>
            <th className="px-6 py-4 text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={imageErrors[p.id] ? getImageUrl(null) : getImageUrl(p.imageUrl)}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={() => handleImageError(p.id)}
                  />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{p.tshirtType?.replace('_', ' ') || '-'}</td>
              <td className="px-6 py-4">₹{p.price}</td>
              <td className="px-6 py-4">{p.stock}</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  className="text-blue-600 mr-3 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;