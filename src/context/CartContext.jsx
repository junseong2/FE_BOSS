import React, { createContext, useState, useContext, useEffect } from 'react';

// CartContext 생성
const CartContext = createContext();

// CartProvider 컴포넌트 (전역 상태를 관리)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart(); // 최초에만 장바구니 불러오기
  }, []); // 빈 배열로 설정하여 최초 렌더링시에만 호출

  // 장바구니 로드
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

  // 장바구니 아이템 삭제
  const removeItemFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/remove?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니에서 아이템 삭제 실패');
      }

      // 장바구니에서 아이템을 제거한 후 상태만 업데이트
      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error('장바구니에서 삭제 오류:', error);
    }
  };

  // 장바구니 수량 업데이트
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

      // 수량을 업데이트한 후 상태만 갱신
      setCartItems(
        cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (error) {
      console.error('수량 업데이트 오류:', error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loadCart, removeItemFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// CartContext 사용을 위한 훅
export const useCart = () => {
  return useContext(CartContext);
};

export { CartContext };
