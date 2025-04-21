import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../lib/api';

const BASE_IMAGE_URL = BASE_URL+'/uploads';
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;

const ProductGrid = ({
  title,
  sellerId = null,
  getFirstImageUrl = (gimage) => {
    if (!gimage) return DEFAULT_IMAGE_PATH;
    const imageName = gimage.includes(',') ? gimage.split(',')[0] : gimage;
    return `${BASE_IMAGE_URL}/${imageName}`;
  },
  onItemClick,
  onAddToCart = () => {},
  cardWidth = 200,
  gap = 16,
}) => {
  const [sortType, setSortType] = useState('daily');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const containerRef = useRef(null);
  const navigate = useNavigate();


  const fetchedMapRef = useRef({});


  const fetchPopularProducts = async (type) => {
    try {
      let url;
      if (sellerId) {
        url = `${import.meta.env.VITE_BACKEND_URL}/seller/products/popular?sellerId=${sellerId}&sortBy=${type}`;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/products/popular?sortBy=${type}`;
      }

      console.log("요청 주소:", url, sellerId)
  
      const res = await axios.get(url);
      setProducts(res.data);
      setCurrentPage(0); // 페이지도 초기화
    } catch (err) {
      console.error('🔥 인기 상품 불러오기 실패:', err);
    }
  };
  

  // ✅ sortType이 바뀌었을 때만 fetch (한 번만)
  useEffect(() => {
    if (!fetchedMapRef.current[sortType]) {
      fetchPopularProducts(sortType);
      fetchedMapRef.current[sortType] = true;
    }
  }, [sortType, sellerId]);

  function getCurrentPageProducts() {
    const start = currentPage * pageSize;
    const end = start + pageSize;

    console.log(products)
    
    return products.slice(start, end);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.floor(products.length / pageSize)) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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

      {/* 정렬 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setSortType('daily')}>일간</button>
        <button onClick={() => setSortType('weekly')}>주간</button>
        <button onClick={() => setSortType('monthly')}>월간</button>
        <button onClick={() => setSortType('all')}>전체</button>
      </div>

      {/* 상품 목록 */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => handlePageChange('prev')}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
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
            padding: '0 40px',
          }}
        >
          {getCurrentPageProducts()?.map((product) => (
            <div
              key={product.productId}
              style={{
                minWidth: cardWidth,
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: 10,
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (onItemClick) {
                  onItemClick(product);
                } else {
                  navigate(`/product/${product.productId}`);
                  window.scrollTo({ top: 0 });
                }
              }}
            >
              <img
                src={getFirstImageUrl(
                  product.gImage || product.gimage || product.g_image || product.g_Image
                )}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
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
                  background: '#5e5e5e',
                  color: '#fff',
                  border: 'none',
                }}
              >
                장바구니 담기
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => handlePageChange('next')}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
          }}
        >
          ▶
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;