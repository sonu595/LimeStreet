import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Image */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'}
            alt={product.name}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#333' }}>
            {product.name}
          </h1>
          
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
            Brand: {product.brand}
          </p>
          
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
            Category: {product.category}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#f39c12', fontSize: '18px', marginRight: '5px' }}>★</span>
            <span style={{ fontSize: '16px', color: '#333' }}>
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginBottom: '20px' }}>
            ₹{product.price}
          </p>
          
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
            {product.description}
          </p>
          
          {product.stock > 0 ? (
            <>
              <p style={{ color: '#27ae60', marginBottom: '15px' }}>
                In Stock ({product.stock} available)
              </p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{ color: '#333' }}>Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '70px'
                  }}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                >
                  Add to Cart
                </button>
                
                <button
                  style={{
                    padding: '15px 30px',
                    backgroundColor: '#fff',
                    color: '#000',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#000';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  Wishlist
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: '#e74c3c', fontSize: '18px' }}>Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;