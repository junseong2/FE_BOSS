import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ShopPage({ sellerId }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoryName, setCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // ✅ 중복 요청 방지

  const pageSize = 8;
  const BASE_IMAGE_URL = 'http://localhost:5000/uploads';

  const getFirstImageUrl = (gimage) => {
    if (!gimage) return '/default-product.jpg';
    const imageList = Array.isArray(gimage) ? gimage : gimage.split(',').map(img => img.trim());
    return `${BASE_IMAGE_URL}/${imageList[0]}`;
  };

  // ✅ 사용자 정보 가져오기 (필요하면 유지)
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
        console.log('✅ userdata:', data);
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ 카테고리명 가져오기
  useEffect(() => {
    if (!categoryId) return;
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/category/${categoryId}`);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error('❌ 카테고리 정보를 불러오는 중 오류 발생:', error);
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  // ✅ 상품 가져오기 (스크롤 시 추가 로드)
  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading) return; // ✅ 중복 실행 방지

    setLoading(true);
    try {
      let url = sellerId
        ? `http://localhost:5000/seller/product?sellerId=${sellerId}&page=${currentPage}&size=${pageSize}&sort=${sortOrder}`
        : `http://localhost:5000/products/category/${categoryId}`;

      if (!url) return;

      const response = await axios.get(url);
      const data = response.data;

      if (!data.products || data.products.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...data.products]); // ✅ 기존 데이터 유지하면서 추가
      setCurrentPage((prev) => prev + 1); // ✅ 다음 페이지 설정
      setHasMore(data.products.length >= pageSize);
    } catch (error) {
      console.error('❌ 상품 목록을 불러오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  }, [sellerId, categoryId, currentPage, hasMore, loading, sortOrder]);

  // ✅ 최초 실행
  useEffect(() => {
    fetchProducts();
  }, [sortOrder]); // ✅ 정렬 방식 변경 시 상품 다시 로드

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
    setProducts([]); // ✅ 기존 목록 초기화 후 다시 불러오기
    setCurrentPage(0);
    setHasMore(true);
  };

  // ✅ 장바구니 추가
  const addToCart = async (event, productId) => {
    event.stopPropagation();
    try {
      const response = await fetch('http://localhost:5000/cart/add', {
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
      <h1>상품 목록</h1>
      {categoryName && <h2>카테고리: {categoryName}</h2>}

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
