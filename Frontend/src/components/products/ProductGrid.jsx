import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error }) => {
  
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        color: '#e74c3c'
      }}>
        <p style={{ fontSize: '16px' }}>{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>No products found</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
      padding: '20px 0'
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;