import { useState, useEffect } from 'react';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/cart', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니 조회 실패');
      }

      const data = await response.json();
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('장바구니 조회 오류:', error.message);
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/remove?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니에서 아이템 삭제 실패');
      }

      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error('장바구니에서 삭제 오류:', error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      alert('수량은 1개 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/cart/updatequantity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('수량 업데이트 실패');
      }

      loadCart(); // 갱신된 장바구니 정보 다시 로드
    } catch (error) {
      console.error('수량 업데이트 오류:', error.message);
    }
  };

  return { cartItems, loadCart, removeItemFromCart, updateQuantity };
};

export default useCart;
