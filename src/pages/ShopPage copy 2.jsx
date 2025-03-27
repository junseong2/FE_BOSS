import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';

const componentsMap = {
  header: Header,
  banner: Banner,
  grid: ProductGrid,
};
const BASE_IMAGE_URL = "http://localhost:5000"; // ✅ 서버 기본 URL

function ShopPage() {
  const navigate = useNavigate();
  const { storename } = useParams(); // ✅ storename을 가져오기
  const [sellerId, setSellerId] = useState(null);
  const [settings, setSettings] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const pageSize = 8;
  const BASE_IMAGE_URL = 'http://localhost:5000';

  // ✅ 첫 번째 이미지 가져오기 (기본 이미지 포함)
  const getFirstImageUrl = (gimage) => {
    if (!gimage) return '/default-product.jpg';
    const imageList = Array.isArray(gimage) ? gimage : gimage.split(',').map(img => img.trim());
    return `${BASE_IMAGE_URL}/${imageList[0]}`;
  };

  // ✅ storename으로 sellerId 가져오기
  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        console.log(`📌 [fetchSellerId] API 요청: /seller/info/${storename}`);
        const response = await axios.get(`http://localhost:5000/seller/info/${storename}`);
        
        if (response.data && response.data.sellerId) {
          setSellerId(response.data.sellerId);
          console.log("📌 [fetchSellerId] 가져온 sellerId:", response.data.sellerId);
        } else {
          console.warn("📌 해당 storename에 대한 sellerId 없음:", storename);
        }
      } catch (error) {
        console.error("❌ sellerId 가져오기 실패:", error);
      }
    };

    if (storename) {
      fetchSellerId();
    }
  }, [storename]);

  // ✅ sellerId가 설정된 후 settings 정보 가져오기
  useEffect(() => {
    if (!sellerId) return; // ✅ sellerId가 설정된 후에만 실행

    const fetchSellerSettings = async () => {
      try {
        console.log("📌 [fetchSellerSettings] API 요청:", `/api/page-data?seller_id=${sellerId}`);
        const response = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`);
        setSettings(response.data.settings || []);

        console.log("📌 받아온 JSON DATA:", response.data);
      } catch (error) {
        console.error('❌ 판매자 settings 불러오기 오류:', error);
      }
    };

    fetchSellerSettings();
  }, [sellerId]);
  useEffect(() => {
    console.log("📌 현재 settings 상태:", settings);
  }, [settings]);
  // ✅ 상품 가져오기 (무한 스크롤)
  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading || !sellerId) return;
    console.log("📌 [fetchProducts] 실행됨"); // ✅ 실행 로그 추가

    setLoading(true);
    try {
      const url = `http://localhost:5000/seller/product?sellerId=${sellerId}&page=${currentPage}&size=${pageSize}&sort=${sortOrder}`;
      console.log("📌 [fetchProducts] API 요청:", url);
      const response = await axios.get(url);
      const data = response.data;

      if (!data.products || data.products.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...data.products]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(data.products.length >= pageSize);
    } catch (error) {
      console.error('❌ 상품 목록 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [sellerId, currentPage, hasMore, loading, sortOrder]);

  // ✅ settings 데이터가 로드된 후 상품 불러오기 시작
  useEffect(() => {
    if (sellerId) {
      console.log("📌 sellerId가 설정됨. 상품 불러오기 시작");
      setProducts([]); // 기존 상품 초기화
      setCurrentPage(0);
      setHasMore(true);
      fetchProducts();
    }
  }, [sellerId, sortOrder]); // ✅ settings 대신 sellerId 기준으로 실행
  useEffect(() => {
    console.log("📌 현재 상품 목록 상태:", products);
  }, [products]);
  // ✅ 스크롤 감지하여 추가 상품 로드
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        fetchProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchProducts, loading, hasMore]);

  // ✅ 정렬 변경 함수
  const sortProducts = (order) => {
    setSortOrder(order);
    setProducts([]);
    setCurrentPage(0);
    setHasMore(true);
  };

  // ✅ 장바구니 추가
  const addToCart = async (event, productId) => {
    event.stopPropagation();
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error(`장바구니 추가 실패: ${await response.text()}`);
      }

      alert('✅ 장바구니에 상품이 추가되었습니다!');
    } catch (error) {
      console.error('❌ 장바구니 추가 오류:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
{settings.length > 0 ? (
  settings.map((component) => {
    console.log("📌 ShopPage - settings component:", component); // 🔥 디버깅 로그 추가

    const Component = componentsMap[component.type]; // header, banner, grid 매핑
    const { id, imageUrl, title, menuItems } = component.properties || {}; // properties 구조 해체

    if (component.type === "header") {
      console.log("📌 ShopPage - Header Component:", component);
      console.log("📌 헤더로 전달되는 menuItems:", menuItems);
    }

    // ✅ imageUrl이 존재하면 앞에 "http://localhost:5000" 추가
    const fullImageUrl = imageUrl ? `${BASE_IMAGE_URL}${imageUrl}` : null;

    return Component ? (
      <div key={id} className="mb-8">
        <Component {...component.properties} menuItems={menuItems || []} imageUrl={fullImageUrl} />
      </div>
    ) : null;
  })
) : (
  <p className="text-center text-gray-500">페이지를 불러오는 중...</p>
)}







      <h2 className="text-xl font-bold mt-6">상품 목록</h2>

      <div className="sort-buttons flex justify-center gap-4 mt-2">
        <button onClick={() => sortProducts('asc')} disabled={sortOrder === 'asc'}>
          가격 낮은순
        </button>
        <button onClick={() => sortProducts('desc')} disabled={sortOrder === 'desc'}>
          가격 높은순
        </button>
      </div>
      <br />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.productId} onClick={() => navigate(`/product/${product.productId}`)} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white text-center shadow-md transition-transform hover:scale-105">
              <img src={getFirstImageUrl(product.gimage)} alt={product.name} className="w-full max-w-[250px] h-60 object-cover rounded-lg"/>
              <p className="text-lg font-bold mt-3">{product.name}</p>
              <button onClick={(e) => addToCart(e, product.productId)} className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600">
                장바구니 담기
              </button>
            </li>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default ShopPage;
