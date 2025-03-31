import React, { useRef } from 'react';


const BASE_IMAGE_URL = 'http://localhost:5000/uploads'; // Spring Boot 서버 URL,차후 배포할때 수정

const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;


const ProductGrid = ({
  title,
  products = [],
  getFirstImageUrl = (gimage) => gimage, // ✅ 기본값으로 함수 제공
  onItemClick,
  onAddToCart,
  cardWidth = 200,
  gap = 16,
}) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = cardWidth + gap;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section style={{ padding: 20 }}>
      {title && <h2>{title}</h2>}
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => scroll('left')}
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            zIndex: 1, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer'
          }}
        >
          ◀
        </button>

        <div
          ref={containerRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: gap,
            padding: '0 40px'
          }}
        >
          {products.map(product => (
            <div
              key={product.productId}
              style={{
                minWidth: cardWidth,
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: 10,
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => onItemClick(product.productId)}
            >
              <img
                src={getFirstImageUrl(product.gimage) || DEFAULT_IMAGE_PATH}
                alt={product.name}
                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }}
                onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
              />
              <p style={{ margin: '10px 0', fontWeight: 600 }}>{product.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(e, product.productId);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 4,
                  background: '#f97316',
                  color: '#fff',
                  border: 'none'
                }}
              >
                장바구니 담기
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            zIndex: 1, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer'
          }}
        >
          ▶
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;
