import { useNavigate } from 'react-router-dom';
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

function ShopPage({ sellerId }) {  // ✅ props로 sellerId 받기
  const navigate = useNavigate();

  const [settings, setSettings] = useState([]); // ✅ 페이지 레이아웃 정보
  const [products, setProducts] = useState([]); // ✅ 상품 목록
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageSize = 8;
  const BASE_IMAGE_URL = 'http://localhost:5000/uploads';

  // ✅ 첫 번째 이미지 가져오기 (기본 이미지 포함)
  const getFirstImageUrl = (gimage) => {
    if (!gimage) return '/default-product.jpg';
    const imageList = Array.isArray(gimage) ? gimage : gimage.split(',').map(img => img.trim());
    return `${BASE_IMAGE_URL}/${imageList[0]}`;
  };

  // ✅ 판매자의 settings 정보 가져오기 (페이지 레이아웃 결정)
  useEffect(() => {
    if (!sellerId) return; // ✅ sellerId가 없으면 요청하지 않음

    const fetchSellerSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`);
        setSettings(response.data.settings || []);
      } catch (error) {
        console.error('❌ 판매자 settings 불러오기 오류:', error);
      }
    };

    fetchSellerSettings();
  }, [sellerId]);

  // ✅ 상품 가져오기 (무한 스크롤)
  const fetchProducts = useCallback(async () => {
    if (!sellerId || !hasMore || loading) return;

    setLoading(true);
    try {
      const url = `http://localhost:5000/api/seller/products?sellerId=${sellerId}&page=${currentPage}&size=${pageSize}&sort=${sortOrder}`;
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
    if (settings.length > 0) {
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchProducts();
    }
  }, [settings, sortOrder]);

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
    <div>
      {settings.length > 0 ? (
        settings.map((component, index) => {
          const Component = componentsMap[component.type];
          return Component ? <Component key={component.properties.id} {...component.properties} /> : null;
        })
      ) : (
        <p>페이지를 불러오는 중...</p>
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
            <li
              key={product.productId}
              onClick={() => navigate(`/product/${product.productId}`)}
              className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white text-center shadow-md transition-transform hover:scale-105"
            >
              <img
                src={getFirstImageUrl(product.gimage)}
                alt={product.name}
                className="w-full max-w-[250px] h-60 object-cover rounded-lg"
                onError={(e) => (e.target.src = "http://localhost:5173/src/assets/default-product.jpg")}
              />
              <p className="text-lg font-bold mt-3">{product.name}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              <p className="text-lg font-semibold text-gray-800 mt-2">가격: {product.price.toLocaleString()}원</p>
              {product.expiry_date && <p className="text-sm text-red-500">유통기한: {product.expiry_date}</p>}
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
