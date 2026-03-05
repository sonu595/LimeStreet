import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const ProductTable = ({ products }) => {
  const navigate = useNavigate();
  const { deleteProduct } = useAdmin();

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
                  <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{p.tshirtType?.replace('_', ' ')}</td>
              <td className="px-6 py-4">₹{p.price}</td>
              <td className="px-6 py-4">{p.stock}</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  className="text-blue-600 mr-3"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600"
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