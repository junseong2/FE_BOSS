import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';

function CategoryPage() {
  const { categoryId } = useParams(); // URL에서 categoryId 가져오기
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // ✅ 가격 정렬 상태 추가
  const [categoryName, setCategoryName] = useState(''); // ✅ 카테고리 이름 저장
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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

  // ✅ 카테고리 이름 가져오기
  useEffect(() => {
    console.log(`🔍 Fetching category name for ID: ${categoryId}`);
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/category/${categoryId}`);
        console.log('✅ Category Name Fetched:', response.data);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error('❌ 카테고리 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  // ✅ 카테고리별 상품 조회
  useEffect(() => {
    console.log(`🔍 Fetching products for category ID: ${categoryId}`);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/category/${categoryId}`);
        console.log('✅ Category Products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('❌ 상품 목록을 불러오는 중 오류 발생:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // ✅ 가격 정렬 함수
  const sortProducts = (order) => {
    const sorted = [...products].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setProducts(sorted);
    setSortOrder(order);
  };

  const addToCart = async (event, productId) => {
    event.stopPropagation(); // ✅ 상세 페이지 이동 방지
  
    try {
      console.log(`🛒 장바구니 추가 요청: productId=${productId}`);
  
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ JWT 쿠키 자동 전송
        body: JSON.stringify({ productId, quantity: 1 }), // ✅ 기존 장바구니 API
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`장바구니 추가 실패: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('✅ 장바구니 추가 성공:', data);
  
      // ✅ 사용자 벡터 업데이트 API 호출
      if (!userId) {
        console.warn('⚠️ userId가 없어 벡터 업데이트 생략');
      } else {
        const updateRes = await fetch(`http://localhost:5000/vector/update?userId=${userId}&productId=${productId}`, {
          method: 'POST',
          credentials: 'include', // ✅ 반드시 추가 (쿠키 포함)
        });
  
        const updateText = await updateRes.text();
        console.log('✅ 사용자 벡터 업데이트:', updateText);
      }
  
      alert('✅ 장바구니에 상품이 추가되었습니다!');
    } catch (error) {
      console.error('❌ 장바구니 추가 오류:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center">상품 목록</h1>
      {categoryName && <h2 className="text-xl text-center mt-2">카테고리: {categoryName}</h2>}

      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={() => sortProducts('asc')} 
          disabled={sortOrder === 'asc'}
          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50"
        >가격 낮은순</button>
        <button 
          onClick={() => sortProducts('desc')} 
          disabled={sortOrder === 'desc'}
          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50"
        >가격 높은순</button>
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
                src={product.gimage?.[0] || '/default-product.jpg'}
                alt={product.name}
                className="w-full max-w-[250px] h-60 object-cover rounded-lg"
                onError={(e) => (e.target.src = 'http://localhost:5173/src/assets/default-product.jpg')}
              />
              <p className="text-lg font-bold mt-3">{product.name}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              <p className="text-lg font-semibold text-gray-800 mt-2">{product.price.toLocaleString()}원</p>
              {product.expiry_date && <p className="text-sm text-red-500">유통기한: {product.expiry_date}</p>}
              <button 
                onClick={(e) => addToCart(e, product.productId)} 
                className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
              >장바구니 담기</button>
            </li>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}


export default CategoryPage;
