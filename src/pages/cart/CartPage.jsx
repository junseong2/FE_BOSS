import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCartStore } from '../../store/cartStore';

import CartActionButtons from './components/CartActionButtons';
import CartOrderSummary from './components/CartOrderSummary';
import CartItem from './components/CartItem';
import CartItemList from './components/CartItemList';
import {
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { getUserInfo } from '../../services/auth.service';
import { clearCartFetch } from '../../services/cart.service';
import CartHeader from './components/CartHeader';
import CartEmpty from './components/CartEmpty';
import CartListHeader from './components/CartListHeader';
import CartClearConfirmModal from './components/CartClearConfirmModal';
import CartNotification from './components/CartNotification';


export default function CartPage() {
  const { trigger, setTrigger: cartItemStateUpdateTrigger } = useCartStore();

  const { cartItems, setCartItems, loadCart, removeItemFromCart, updateQuantity } = useCart();

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // success or error

  useEffect(() => {
    fetchUserInfo();
  }, [trigger]);


  // 유저의 정보 가져오기
  const fetchUserInfo = async () => {
    setIsLoading(true);

    try {
      const userInfo = await getUserInfo()
      setUserId(userInfo?.userId);
      setUserName(userInfo?.userName);
      await loadCart();
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 장바구니 비우기
  const clearCart = async () => {
    const isClear = await clearCartFetch(); // 장바구니 비우기
    if (isClear) {
      cartItemStateUpdateTrigger(); // 장바구니 상태 업데이트

      // 장바구니 상태를 빈 배열로 설정
      setCartItems([]);
      setShowConfirmClear(false);
      showNotificationHandler('장바구니가 비워졌습니다.', 'success');
    } else {
      showNotificationHandler('장바구니 비우기에 실패하였습니다.', 'error');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  const showNotificationHandler = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='flex flex-col items-center gap-2'>
          <RefreshCw className='h-8 w-8 animate-spin text-blue-600' />
          <p className='text-lg font-medium'>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* 알림 메시지 */}
      {showNotification && (
        <CartNotification notificationMessage={notificationMessage} notificationType={notificationType} />
      )}

      {/* 장바구니 비우기 확인 모달 */}
      <CartClearConfirmModal clearCart={clearCart} showConfirmClear={showConfirmClear} setShowConfirmClear={setShowConfirmClear} />

      <div className='container mx-auto px-4 py-8'>
        {/* 페이지 헤더 */}
        <CartHeader cartItems={cartItems} />

        {!userId && (
          <div className='max-w-6xl mx-auto bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0' />
            <p>로그인이 필요합니다. 로그인 후 장바구니를 이용해주세요.</p>
          </div>
        )}

        {/* 장바구니 내용 */}
        <div className='max-w-6xl mx-auto'>
          {cartItems.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className='space-y-6'>
              <CartListHeader />
              <CartItemList>
                {cartItems.map((item) => (
                  <CartItem cartItems={cartItems} item={item} removeItemFromCart={removeItemFromCart} setCartItems={setCartItems} updateQuantity={updateQuantity} />
                ))}
              </CartItemList>
              <CartOrderSummary calculateTotal={calculateTotal} cartItemCount={cartItems?.length || 0} />
              <CartActionButtons setShowConfirmClear={setShowConfirmClear} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
