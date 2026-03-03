import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <img 
        src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
        alt={product.name}
        style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '15px'
        }}
      />
      
      <h3 style={{ 
        margin: '0 0 10px 0', 
        fontSize: '16px',
        fontWeight: '600',
        color: '#333'
      }}>
        {product.name}
      </h3>
      
      <p style={{ 
        color: '#666', 
        fontSize: '14px', 
        marginBottom: '10px',
        flex: 1
      }}>
        {product.brand}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#000' 
        }}>
          ₹{product.price}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#f39c12', marginRight: '5px' }}>★</span>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>
      
      {product.stock > 0 ? (
        <p style={{ 
          color: '#27ae60', 
          fontSize: '12px', 
          margin: '0',
          fontWeight: '500'
        }}>
          In Stock
        </p>
      ) : (
        <p style={{ 
          color: '#e74c3c', 
          fontSize: '12px', 
          margin: '0',
          fontWeight: '500'
        }}>
          Out of Stock
        </p>
      )}
    </div>
  );
};

export default ProductCard;