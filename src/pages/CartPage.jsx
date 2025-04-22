import {
  Trash2,
  ShoppingCart,
  Home,
  CreditCard,
  Minus,
  Plus,
  RefreshCw,
  ArrowLeft,
  Package,
  Tag,
  AlertCircle,
  Check,
} from 'lucide-react';
import { cva } from 'class-variance-authority';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCartStore } from '../store/cartStore';

import { BASE_URL } from '../lib/api';


// Define the cn utility function
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

// Define the Button component
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';

// Define the Input component
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// Define the Card components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

// Define Separator component
const Separator = React.forwardRef(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';

export default function CartPage() {
  const {trigger,  setTrigger: cartItemStateUpdateTrigger } = useCartStore();

  const { cartItems, setCartItems, loadCart, removeItemFromCart, updateQuantity } = useCart();

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // success or error
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, [trigger]);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL+"/auth/user-info", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error('로그인 정보 조회 실패');
      }

      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);
      await loadCart();
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(BASE_URL+"/cart/clear", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error('장바구니 비우기 실패');
      }

      cartItemStateUpdateTrigger(); // 장바구니 상태 업데이트

      // 장바구니 상태를 빈 배열로 설정
      setCartItems([]);
      setShowConfirmClear(false);
      showNotificationHandler('장바구니가 비워졌습니다', 'success');
    } catch (error) {
      console.error('장바구니 비우기 오류:', error);
      showNotificationHandler('장바구니 비우기에 실패했습니다', 'error');
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
    <div className='bg-gradient-to-b from-gray-50 to-white min-h-screen'>
      {/* 알림 메시지 */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right ${
            notificationType === 'success'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notificationType === 'success' ? (
            <Check className='h-5 w-5 text-blue-500' />
          ) : (
            <AlertCircle className='h-5 w-5 text-red-500' />
          )}
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* 장바구니 비우기 확인 모달 */}
      <div
        aria-hidden={showConfirmClear ? 'false' : 'true'}
        className={`${showConfirmClear ? 'visible opacity-100' : 'invisible opacity-0'} fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 transition`}
      >
        <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-scale-in'>
          <h3 className='text-xl font-bold mb-3 text-gray-900'>장바구니 비우기</h3>
          <p className='text-gray-600 mb-6'>장바구니의 모든 상품이 삭제됩니다. 계속하시겠습니까?</p>
          <div className='flex justify-end gap-3'>
            <Button
              variant='outline'
              className='border-gray-300 text-gray-700 hover:bg-gray-50'
              onClick={() => setShowConfirmClear(false)}
            >
              취소
            </Button>
            <Button className='bg-red-500 hover:bg-red-600 text-white' onClick={clearCart}>
              비우기
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {/* 페이지 헤더 */}
        <div className='max-w-6xl mx-auto mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                <ShoppingCart className='h-8 w-8 text-blue-600' />
                장바구니
              </h1>
              <p className='text-gray-500 mt-1'>
                {cartItems.length > 0
                  ? `${cartItems.length}개의 상품이 장바구니에 있습니다`
                  : '장바구니가 비어 있습니다'}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                className='border-gray-300 text-gray-700 hover:bg-gray-50'
                onClick={() => navigate('/')}
              >
                <Home className='h-4 w-4 mr-2' />
                쇼핑 계속하기
              </Button>
              {cartItems.length > 0 && (
                <Button
                  className='bg-blue-600 hover:bg-blue-700 text-white'
                  onClick={() => navigate('/paymentpage')}
                >
                  <CreditCard className='h-4 w-4 mr-2' />
                  결제하기
                </Button>
              )}
            </div>
          </div>
        </div>

        {!userId && (
          <div className='max-w-6xl mx-auto bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0' />
            <p>로그인이 필요합니다. 로그인 후 장바구니를 이용해주세요.</p>
          </div>
        )}

        {/* 장바구니 내용 */}
        <div className='max-w-6xl mx-auto'>
          {cartItems.length === 0 ? (
            <div className='bg-white rounded-2xl shadow-sm p-8 text-center'>
              <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <ShoppingCart className='h-12 w-12 text-gray-400' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>장바구니가 비어 있습니다</h2>
              <p className='text-gray-500 mb-8 max-w-md mx-auto'>
                원하는 상품을 장바구니에 담고 편리하게 쇼핑을 즐겨보세요.
              </p>
              <Button
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg'
                onClick={() => navigate('/')}
              >
                쇼핑하러 가기
              </Button>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* 장바구니 헤더 */}
              <div className='hidden md:flex bg-gray-100 rounded-lg p-4 text-gray-600 font-medium'>
                <div className='w-1/2'>상품 정보</div>
                <div className='w-1/6 text-center'>단가</div>
                <div className='w-1/6 text-center'>수량</div>
                <div className='w-1/6 text-center'>합계</div>
              </div>

              {/* 장바구니 상품 목록 */}
              <div className='space-y-4'>
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className='bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl shadow-sm overflow-hidden border border-blue-100 hover:shadow-md transition-shadow'
                  >
                    <div className='flex flex-col md:flex-row p-4'>
              {/* 상품 정보 */}
                      <div className='md:w-1/2 flex gap-4 mb-4 md:mb-0'>
                        <div className='w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200'>
                          {item.productThumbnail ? (
                            <img
                              src={item.productThumbnail}
                              alt={item.productName}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <Package className='h-8 w-8 text-gray-300' />
                          )}
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900'>{item.productName}</h3>
                          <p className='text-sm text-gray-500 mt-1'>상품 ID: {item.productId}</p>
                          <button
                            className='text-red-500 hover:text-red-700 text-sm flex items-center mt-2 md:hidden'
                            onClick={() => removeItemFromCart(item.productId)}
                          >
                            <Trash2 className='h-3 w-3 mr-1' />
                            삭제
                          </button>
                        </div>
                      </div>

                      {/* 단가 */}
                      <div className='md:w-1/6 flex justify-between md:justify-center items-center mb-3 md:mb-0'>
                        <span className='text-sm text-gray-500 md:hidden'>단가:</span>
                        <span className='font-medium text-gray-900'>
                          {item.productPrice.toLocaleString()}원
                        </span>
                      </div>

                      {/* 수량 */}
                      <div className='md:w-1/6 flex justify-between md:justify-center items-center mb-3 md:mb-0'>
                        <span className='text-sm text-gray-500 md:hidden'>수량:</span>
                        <div className='flex items-center'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-l-md border-gray-300'
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                          >
                            <Minus className='h-3 w-3' />
                          </Button>
                          <Input
                            type='number'
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = Number.parseInt(e.target.value) || 1;
                              const updatedCart = cartItems.map((cartItem) =>
                                cartItem.productId === item.productId
                                  ? { ...cartItem, quantity: newQuantity }
                                  : cartItem,
                              );
                              setCartItems(updatedCart);
                            }}
                            onBlur={(e) =>
                              updateQuantity(item.productId, Number.parseInt(e.target.value) || 1)
                            }
                            min='1'
                            className='h-8 w-12 rounded-none text-center border-x-0 border-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          />
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-r-md border-gray-300'
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>

                      {/* 합계 */}
                      <div className='md:w-1/6 flex justify-between md:justify-center items-center'>
                        <span className='text-sm text-gray-500 md:hidden'>합계:</span>
                        <span className='font-bold text-blue-700'>
                          {(item.productPrice * item.quantity).toLocaleString()}원
                        </span>
                      </div>

                      {/* 삭제 버튼 (데스크톱) */}
                      <div className='hidden md:flex md:items-center md:justify-center'>
                        <button
                          className='text-gray-400 hover:text-red-500 transition-colors'
                          onClick={() => removeItemFromCart(item.productId)}
                          aria-label='상품 삭제'
                        >
                          <Trash2 className='h-5 w-5' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 주문 요약 */}
              <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-1'>주문 요약</h3>
                    <p className='text-gray-500 text-sm'>총 {cartItems.length}개 상품</p>
                  </div>

                  <div className='flex flex-col items-end'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-gray-600'>상품 금액:</span>
                      <span className='font-medium'>{calculateTotal().toLocaleString()}원</span>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-gray-600'>배송비:</span>
                      <span className='font-medium'>무료</span>
                    </div>
                    <div className='flex items-center gap-2 text-lg mt-2'>
                      <span className='font-medium text-gray-900'>총 결제 금액:</span>
                      <span className='font-bold text-blue-700'>
                        {calculateTotal().toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className='flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4'>
                <Button
                  variant='outline'
                  className='w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50'
                  onClick={() => setShowConfirmClear(true)}
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  장바구니 비우기
                </Button>

                <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                  <Button
                    variant='outline'
                    className='w-full sm:w-auto border-gray-300 text-gray-700'
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    쇼핑 계속하기
                  </Button>
                  <Button
                    className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
                    onClick={() => navigate('/paymentpage')}
                  >
                    <CreditCard className='h-4 w-4 mr-2' />
                    결제하기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
