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
  const BASE_IMAGE_URL = 'http://localhost:5000/uploads'; // Spring Boot 서버 URL,차후 배포할때 수정
  const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;
  
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('로그인 정보 조회 실패');
        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error.message);
      }
    };
    fetchUserInfo();
  }, []);

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

  useEffect(() => {
    if (product?.gimage) {
      setCurrentImageIndex(0);
    }
  }, [product]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = async (event) => {
    event.stopPropagation();
    if (!product) return;
    try {

      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product.productId, quantity }),
      });
      if (!response.ok) throw new Error('장바구니 추가 실패');
      alert('✅ 장바구니에 상품이 추가되었습니다!');
    } catch (error) {
      console.error('❌ 장바구니 추가 오류:', error);
    }
  };


  let imageList = [DEFAULT_IMAGE_PATH];

  if (product?.gimage) {
    if (typeof product.gimage === 'string') {
      imageList = product.gimage
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img !== '')
        .map((img) => `${BASE_IMAGE_URL}/${img}`); // 상대 경로 유지
    } else if (Array.isArray(product.gimage)) {
      imageList = product.gimage
        .map((img) => img.trim())
        .filter((img) => img !== '')
        .map((img) => `${BASE_IMAGE_URL}/${img}`);
    }
  }
  
  if (imageList.length === 0) {
    imageList = [DEFAULT_IMAGE_PATH]; // 이미지가 없을 경우 기본 이미지
  }
  
  // 🛠 최종 이미지 리스트 로그 확인
  console.log('📸 최종 이미지 리스트:', imageList);
  
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    },
    onSwipedRight: () => {
      setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  
  // ✅ product가 없을 경우에는 `return` 실행
  if (!product) {
    return <p>상품 정보를 불러오는 중...</p>;
  }
  

  return (
    <div className="flex flex-col items-center p-5 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <div className="w-full max-w-md flex justify-center items-center relative mb-5" {...handlers}>
        <button className="absolute left-2 bg-gray-300 p-2 rounded-full" onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))}>&lt;</button>
        
        
        
        
        <img 
  src={!imageError ? imageList[currentImageIndex % imageList.length] : DEFAULT_IMAGE_PATH}
  alt={product?.name || '상품 이미지'} 
  className="w-full max-h-96 object-cover rounded-lg" 
  onError={() => setImageError(true)} // 이미지 로드 실패 시 상태 업데이트
/>

        
        
        <button className="absolute right-2 bg-gray-300 p-2 rounded-full" onClick={() => 
          setCurrentImageIndex((prev) => (prev + 1) % imageList.length)}>&gt;</button>
      </div>
      <div className="text-center w-full px-4">
        <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
        {product.discountPrice && <p className="text-lg text-red-500 font-bold">{product.discountPrice.toLocaleString()}원</p>}
        <p className="text-xl font-bold text-orange-500 mb-3">{product.price.toLocaleString()}원</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <div className="flex justify-center items-center mb-5">
          <button className="px-4 py-2 bg-gray-300 rounded-l" onClick={decreaseQuantity}>➖</button>
          <span className="px-4 text-lg font-bold">{quantity}</span>
          <button className="px-4 py-2 bg-gray-300 rounded-r" onClick={increaseQuantity}>➕</button>
        </div>
        <button className="w-full max-w-sm py-3 bg-blue-500 text-white rounded-lg mb-3" onClick={addToCart}>장바구니 추가</button>
        <button className="w-full max-w-sm py-3 bg-[#99E6FC] text-white rounded-lg">구매하기</button>
      </div>
      <div className="w-full max-w-lg mt-6 p-4 border-t">
        <h3 className="text-lg font-bold mb-2">배송 및 주문 정보</h3>
        <p>📦 배송기간: {product.deliveryTime || '2~3일 소요'}</p>
        <p>🚚 배송비: {product.deliveryFee ? `${product.deliveryFee.toLocaleString()}원` : '무료 배송'}</p>
        <p>🔄 반품 정책: {product.returnPolicy || '반품 불가'}</p>
        <p>📍 판매자: {product.seller || '알 수 없음'}</p>
      </div>
    </div>
  );
}


export default ProductDetailPage;
