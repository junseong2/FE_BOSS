import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './styles/CartPage.css';

function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    loadCart();
  }, []);

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
      setUserName(data.userName);
      loadCart(); // 사용자 ID를 전달하여 장바구니 로드
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
    }
  };
  const handleQuantityChange = (e, productId) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: Number(e.target.value) } : item,
    );
    setCartItems(updatedCart);
  };

  const loadCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/cart', {
        // 쿼리 없이 요청
        method: 'GET',
        credentials: 'include', // 쿠키에서 JWT 자동 전송
      });

      if (!response.ok) {
        throw new Error('장바구니 조회 실패');
      }

      const data = await response.json();
      setCartItems(data.cartItems || []); // 장바구니 데이터를 설정
    } catch (error) {
      console.error('장바구니 조회 오류:', error.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/cart/clear', {
        // userId 제거
        method: 'POST',
        credentials: 'include', // 쿠키에서 JWT 전송
      });

      if (!response.ok) {
        throw new Error('장바구니 비우기 실패');
      }

      setCartItems([]);
    } catch (error) {
      console.error('장바구니 비우기 오류:', error.message);
    }
  };

  const removeItemFromCart = async (productId) => {
    console.log(`🗑️ 삭제 요청 시작: productId=${productId}`); // 함수 호출 확인

    try {
      const response = await fetch(`http://localhost:5000/cart/remove?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include', // JWT 자동 전송
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`장바구니에서 아이템 삭제 실패: ${errorText}`);
      }

      setCartItems(cartItems.filter((item) => item.productId !== productId));
      console.log('✅ 장바구니에서 삭제 성공');
    } catch (error) {
      console.error('❌ 장바구니에서 삭제 오류:', error);
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
        credentials: 'include', // 쿠키에서 JWT 자동 전송
        body: JSON.stringify({
          productId: productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('수량 업데이트 실패');
      }

      const data = await response.json();
      console.log('수량 업데이트 성공:', data);

      // 장바구니 상태 갱신 후 UI 업데이트
      loadCart(); // 갱신된 장바구니 정보를 다시 로드합니다
    } catch (error) {
      console.error('수량 업데이트 오류:', error.message);
    }
  };

  return (
    <div className='cart-container'>
      <h2 className='cart-title'>🛒 장바구니</h2>
      {userId && userName ? (
        <p className='user-info'>
          현재 로그인된 사용자: {userName} (ID: {userId})
        </p>
      ) : (
        <p className='login-prompt'>로그인이 필요합니다.</p>
      )}

      <table className='cartTable'>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>총가격</th>
            <th>삭제</th>
            <th>장바구니 ID</th>
            <th>상품 ID(여긴 이후삭제예정)</th>
          </tr>
        </thead>

        <tbody id='cartTable-sku' className='cart-bundle-list'>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.cartId} className='cart-deal-item'>
                <td className='product-box'>{item.productName}</td>
                <td className='option-price-part'>{item.productPrice}원</td>
                <td>
                  <td>
                    {/* 수량 입력 필드 */}
                    <input
                      type='number'
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(e, item.productId)}
                      min='1'
                      className='quantity-input'
                    />

                    {/* 수량 변경 버튼 */}
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity)} // 입력된 값으로 수량 업데이트
                      className='update-quantity-btn'
                    >
                      변경
                    </button>
                  </td>
                </td>

                <td>{item.productPrice * item.quantity}원</td>
                <td>
                  <button
                    className='remove-item-btn'
                    onClick={() => removeItemFromCart(item.productId)}
                  >
                    삭제
                  </button>
                </td>
                <td>{item.cartId}</td>
                <td>아이디: {item.productId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6'>장바구니가 비어 있습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='cart-actions'>
        <button className='clear-cart-btn' onClick={clearCart}>
          장바구니 비우기
        </button>
        <button className='back-btn' onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
        <button className='payment-btn' onClick={() => navigate('/paymentpage')}>
          결제
        </button>{' '}
      </div>
    </div>
  );
}

export default CartPage;
