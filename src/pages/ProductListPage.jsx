import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 스타일 적용
import useCart from '../hooks/useCart'; // useCart 훅 import

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null); // 사용자 ID 상태
  const navigate = useNavigate();
  const { loadCart } = useCart(); // useCart 훅에서 loadCart 함수 가져오기

  useEffect(() => {
    fetchUserInfo(); // 사용자 정보 가져오기
    fetchProducts(); // 하드코딩된 상품 목록 불러오기
  }, []);

  // 사용자 정보 요청
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
      setUserId(data.userId); // 사용자 ID 설정
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
    }
  };

  // 하드코딩된 상품 목록 불러오기
  const fetchProducts = () => {
    const hardcodedProducts = [
      { productId: 1, name: '상품 A', price: 10000 },
      { productId: 2, name: '상품 B', price: 20000 },
      { productId: 3, name: '상품 C', price: 30000 },
    ];
    setProducts(hardcodedProducts);
  };

  // 장바구니에 상품 추가
  const addToCart = async (product) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/add?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: 1, // 기본 수량 1로 설정
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // 서버의 에러 메시지 확인
        throw new Error(`장바구니 추가 실패: ${errorText}`);
      }
      // 장바구니 정보를 다시 로드
      loadCart(); // 장바구니 정보 업데이트
      // 응답을 JSON으로 파싱
      const responseData = await response.json();
      console.log('장바구니에 추가됨:', responseData);

      // 성공적으로 추가된 경우 사용자에게 알림
      alert(responseData.message); // 서버에서 받은 메시지 출력

      // 장바구니 정보를 다시 로드
      loadCart(); // 장바구니 정보 업데이트
    } catch (error) {
      console.error('장바구니 추가 오류:', error.message);
      alert('장바구니 추가에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className='product-container'>
      <h2>🛍️ 상품 1목록</h2>

      <ul className='product-list'>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.productId} className='product-item'>
              <p>상품명: {product.name}</p>
              <p>가격: {product.price}원</p>
              <button onClick={() => addToCart(product)}>장바구1니 추가</button>
            </li>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </ul>

      {/* 장바구니 페이지 이동 */}
      <button className='cart-btn' onClick={() => navigate('/cart')}>
        장바구니 보기
      </button>
    </div>
  );
}

export default ProductListPage;
