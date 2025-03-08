import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductDetailPage() {
  const { productId } = useParams(); // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [quantity, setQuantity] = useState(1); // ✅ 수량 상태 추가
  const navigate = useNavigate();

  // ✅ 로그인 정보 가져오기
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

  // ✅ 상품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('상품 정보를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // ✅ 수량 감소 함수 (최소 1)
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // ✅ 장바구니 추가 함수
  const addToCart = async () => {
    if (!userId) {
      alert('로그인이 필요합니다!');
      navigate('/signin');
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
        body: JSON.stringify({ productId, quantity }), // ✅ userId 제거
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

  if (!product) {
    return <p>상품 정보를 불러오는 중...</p>;
  }

  return (
    <div className='product-detail-container'>
      <div className='product-image'>
        {/* ✅ 이미지 표시 */}
        <img src={product.imageUrl || '/default-product.jpg'} alt={product.name} />
      </div>
      <div className='product-info'>
        <h2>{product.name}</h2>
        <p className='price'>{product.price.toLocaleString()}원</p>
        <p className='description'>{product.description}</p>

        {/* ✅ 수량 조절 UI */}
        <div className='quantity-selector'>
          <button onClick={decreaseQuantity}>➖</button>
          <span>{quantity}</span>
          <button onClick={increaseQuantity}>➕</button>
        </div>

        <button className='add-to-cart-btn' onClick={addToCart}>
          장바구니 추가
        </button>
        <button className='back-btn' onClick={() => navigate(-1)}>
          뒤로 가기
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
