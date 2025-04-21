
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { BASE_URL } from '../lib/api';

// CartContext 생성
const CartContext = createContext();

// CartProvider 컴포넌트 (전역 상태를 관리)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const {setTrigger: cartItemStateUpdateTrigger} = useCartStore()

  useEffect(() => {
    console.log("📌 CartProvider 마운트됨");

    loadCart();
  }, []);

  // 장바구니 로드
  const loadCart = async () => {
    try {
     // const backendUrl = import.meta.env.VITE_BACKEND_URL; // ✅ 환경 변수 할당
      const response = await fetch(BASE_URL+`/cart`, {
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
     // const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(BASE_URL+`/cart/remove?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니에서 아이템 삭제 실패');
      }

      setCartItems(cartItems.filter((item) => item.productId !== productId));
      cartItemStateUpdateTrigger() // 장바구니 담긴 아이템 개수 상태 업데이트
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
      
      const response = await fetch(BASE_URL + `/cart/updatequantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('수량 업데이트 실패');
      }

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
    <CartContext.Provider 
    
    value={{ cartItems, setCartItems, loadCart, removeItemFromCart, updateQuantity }}

    
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

export { CartContext };
