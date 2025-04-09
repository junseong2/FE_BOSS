import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const BASE_IMAGE_URL = 'http://localhost:5000/uploads';
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;

const getFirstImageUrl = (product) => {
  const gimage = product.gImage || product.gimage || product.g_image;
  if (!gimage) return DEFAULT_IMAGE_PATH;
  const list = Array.isArray(gimage) ? gimage : gimage.split(',').map((img) => img.trim());
  return `${BASE_IMAGE_URL}/${list[0]}`;
};

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');

  // 사용자 정보
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

  // 검색 결과 가져오기
  const fetchSearchResults = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products/search?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('검색 결과를 불러오는 데 실패했습니다.', error);
    }
  }, [query]);

  useEffect(() => {
    if (query) fetchSearchResults();
  }, [query, fetchSearchResults]);

  // 정렬 함수
  const sortProducts = (order) => {
    const sorted = [...searchResults].sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    setSearchResults(sorted);
    setSortOrder(order);
  };

  // 장바구니 추가
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
    <div className="min-h-screen px-4 py-6 bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">🔍 검색 결과: <span className="text-orange-600">{query}</span></h2>

      {/* 정렬 버튼 */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => sortProducts('asc')}
          disabled={sortOrder === 'asc'}
          className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
        >
          가격 낮은순
        </button>
        <button
          onClick={() => sortProducts('desc')}
          disabled={sortOrder === 'desc'}
          className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
        >
          가격 높은순
        </button>
      </div>

      {/* 검색 결과 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div
              key={product.productId}
              onClick={() => navigate(`/product/${product.productId}`)}
              className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={getFirstImageUrl(product)}
                alt={product.name}
                onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
                className="w-full h-60 object-cover rounded-md"
              />
              <p className="mt-3 text-lg font-bold">{product.name}</p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
              <p className="text-lg font-semibold mt-2">{product.price.toLocaleString()}원</p>
              <button
                onClick={(e) => addToCart(e, product.productId)}
                className="mt-3 px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
              >
                장바구니 담기
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
