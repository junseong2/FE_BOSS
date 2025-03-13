import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // ✅ product가 바뀌면 currentImageIndex 초기화
  useEffect(() => {
    if (product?.gImage && product.gImage.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [product]);

  // ✅ 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // ✅ 수량 감소 함수 (최소 1)
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = async (event, productId) => {
    event.stopPropagation(); // ✅ 상세 페이지 이동 방지

    if (!productId) {
      console.error('❌ productId가 없음! API 요청 중단');
      return;
    }

    console.log(`🛒 장바구니 추가 요청: productId=${productId}, quantity=${quantity}`);

    try {
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ JWT 쿠키 자동 전송
        body: JSON.stringify({ productId, quantity }),
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
    console.log("🚀 상품 정보가 없음! 데이터를 불러오는 중...");
  };


  const imageList = product?.gimage && product.gimage.length > 0 ? product.gimage : ["/default-product.jpg"];


  // ✅ 스와이프 기능 추가
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!imageList || imageList.length === 0) return;
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    },
    onSwipedRight: () => {
      if (!imageList || imageList.length === 0) return;
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
      );
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    console.log("📸 현재 이미지 인덱스:", currentImageIndex);
  }, [currentImageIndex]);

  if (!product) {
    return <p>상품 정보를 불러오는 중...</p>;
  }

  return (
    <div className='product-detail-container'>
      <div className="image-carousel" {...handlers}>
        <img
          src={encodeURI(imageList[currentImageIndex])}
          alt={product?.name || "상품 이미지"}
          className="product-image"
          onError={(e) => (e.target.src = "/default-product.jpg")}
          style={{
            width: "400px",
            height: "auto",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
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

        <button onClick={(event) => addToCart(event, product.productId)}>
          장바구니 추가
        </button>
        <button className='back-btn' onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
