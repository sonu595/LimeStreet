import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import { useNavigate } from 'react-router-dom';

const AdminAddProduct = () => {
  const { createProduct } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createProduct(data);
    navigate('/admin/products');
  };

  return (
    <AdminLayout>
      <ProductForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default AdminAddProduct;