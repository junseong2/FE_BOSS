import { useParams, useNavigate } from 'react-router-dom'; // 이 부분은 그대로 두세요
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'; // useContext는 React에서 import해야 함

import { CartContext } from '../context/CartContext'; // CartContext 사용

//import useCart from '../hooks/useCart'; // useCart 훅 import

function CategoryPage() {
  const { categoryId } = useParams(); // URL에서 categoryId 가져오기
  const [products, setProducts] = useState([]);
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
    console.log(`🔍 Fetching category name for ID: ${categoryId}`); // 디버깅용 로그
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/category/${categoryId}`);
        console.log('✅ Category Name Fetched:', response.data);
        setCategoryName(response.data.name); // ✅ 카테고리 이름 설정
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

  const { cartItems, loadCart, removeItemFromCart, updateQuantity } = useContext(CartContext); // CartContext에서 가져오기

  //const { cartItems, loadCart, removeItemFromCart, updateQuantity } = useCart();

  const addToCart = async (productId) => {
    try {
      console.log(`🛒 장바구니 추가 요청: productId=${productId}`);

      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ JWT 쿠키 자동 전송
        body: JSON.stringify({ productId, quantity: 1 }), // ✅ userId 제거
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`장바구니 추가 실패: ${errorText}`);
      }

      const data = await response.json();

      console.log('✅ 장바구니 추가 성공:', data);
    } catch (error) {
      console.error('❌ 장바구니 추가 오류:', error);
    }
  };

  return (
    <div className='product-container'>
      <h2>카테고리: {categoryName}</h2> {/* ✅ 제목을 카테고리 이름으로 변경 */}
      <ul className='product-list'>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.productId} className='product-item'>
              <p>상품명: {product.name}</p>
              <p>가격: {product.price}원</p>
              <p>설명: {product.description}</p>

              <button onClick={() => addToCart(product.productId)}>장바구니 추가2</button>
            </li>
          ))
        ) : (
          <p>해당 카테고리에 상품이 없습니다.</p>
        )}
      </ul>
      <button className='cart-btn' onClick={() => navigate('/cart')}>
        장바구니 보기
      </button>
    </div>
  );
}

export default CategoryPage;
