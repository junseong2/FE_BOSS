import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import axios from 'axios';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [userId, setUserId] = useState(null); // ✅ userId 상태 추가
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query'); // 쿼리 파라미터 가져오기

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('검색 결과를 불러오는 데 실패했습니다.', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  // ✅ 사용자 정보 요청 (로그인 상태 확인)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('로그인 정보 조회 실패');
        }

        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ 사용자 정보 요청 (로그인 상태 확인)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('로그인 정보 조회 실패');
        }

        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ 가격 정렬 함수
  const sortProducts = (order) => {
    const sorted = [...searchResults].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setSearchResults(sorted);
    setSortOrder(order);
  };
  // ✅ 장바구니 추가 함수
  const addToCart = async (event, productId) => {
    event.stopPropagation(); // ✅ 상세 페이지 이동 방지

    if (!productId) {
      console.error('❌ productId가 없음! API 요청 중단');
      return;
    }
    try {
      console.log(`🛒 장바구니 추가 요청: productId=${productId}`);

      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ JWT 쿠키 자동 전송
        body: JSON.stringify({ productId, quantity: 1 }), // ✅ userId 제거
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`장바구니 추가 실패: ${errorText}`);
      }

      const data = await response.json();

      console.log('✅ 장바구니 추가 성공:', data);
      alert('✅ 장바구니에 상품이 추가되었습니다!');
    } catch (error) {
      console.error('❌ 장바구니 추가 오류:', error);
    }
  };
  return (
    <div>
      <h2>검색 결과</h2>

      {/* ✅ 가격 정렬 버튼 */}
      <div className='sort-buttons'>
        <button onClick={() => sortProducts('asc')} disabled={sortOrder === 'asc'}>
          가격 낮은순
        </button>
        <button onClick={() => sortProducts('desc')} disabled={sortOrder === 'desc'}>
          가격 높은순
        </button>
      </div>

      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((product) => (
            <li
              key={product.productId}
              className='product-item'
              onClick={() => navigate(`/product/${product.productId}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={
                  Array.isArray(product.gimage)
                    ? product.gimage[0] || '/default-product.jpg'
                    : product.gimage || '/default-product.jpg'
                }
                alt={product.name}
                style={{
                  width: '400px',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
              <p>상품명: {product.name}</p>
              <p>가격: {product.price.toLocaleString()}원</p>
              <p>설명: {product.description}</p>
              <button onClick={(event) => addToCart(event, product.productId)}>
                장바구니 추가
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default SearchPage;
