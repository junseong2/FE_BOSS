import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/seller-store-page.css';
import './styles/CartPage.css';
const SellerStorePage = () => {
  const { storename } = useParams(); // storename 가져오기
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // 오류 상태 추가
  const navigate = useNavigate();

  console.log('✅ React - useParams() storename:', storename); // 콘솔 출력

  useEffect(() => {
    if (!storename) {
      console.error('❌ storename이 없습니다! URL을 확인하세요.');
      return;
    }

    console.log('✅ Fetch 요청 시작 - storename:', storename);

    // 1️⃣ 판매자 정보 가져오기
    fetch(`http://localhost:5000/store/${storename}/products`)
      .then((res) => res.text()) // 텍스트 형식으로 받기
      .then((data) => {
        console.log('응답 텍스트:', data); // 데이터 확인
        try {
          const jsonData = JSON.parse(data); // 수동으로 JSON 파싱
          setProducts(jsonData);
        } catch (err) {
          console.error('JSON 파싱 오류:', err.message);
        }
      })
      .catch((err) => {
        console.error('데이터 조회 오류:', err.message);
      });
  }, [storename]);

  // 장바구니 추가 함수
  const addToCart = async (event, productId) => {
    event.stopPropagation(); // 상세 페이지 이동 방지

    try {
      console.log(`🛒 장바구니 추가 요청: productId=${productId}`);

      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // JWT 쿠키 자동 전송
        body: JSON.stringify({ productId, quantity: 1 }),
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
    <div className='seller-store-page'>
      {seller ? <h2>{seller.storename}의 상품 목록</h2> : <p>판매자를 찾을 수 없습니다.</p>}
      {error && <p>{error}</p>} {/* 오류 메시지 UI에 출력 */}
      <ul className='product-list'>
        {products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.productId}
              className='product-item'
              onClick={() => navigate(`/product/${product.productId}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.gImage || 'src/assets/default-product.jpg'}
                alt={product.name}
                className='product-image'
                style={{
                  width: '200px',
                  height: 'auto',
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
          ))
        ) : (
          <p>해당 판매자의 상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default SellerStorePage;
