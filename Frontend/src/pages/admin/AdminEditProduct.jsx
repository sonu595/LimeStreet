import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import { useAdmin } from '../../context/AdminContext';

const AdminEditProduct = () => {
  const { id } = useParams();
  const { updateProduct } = useAdmin();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    productApi.getProductById(id).then(res => setProduct(res.data.data));
  }, [id]);

  const handleSubmit = async (data) => {
    await updateProduct(id, data);
    navigate('/admin/products');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <ProductForm product={product} onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default AdminEditProduct;