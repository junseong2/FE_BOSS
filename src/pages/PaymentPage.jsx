import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fetchUserInfo from '../utils/api.js'; // API 함수 import

function PaymentPage() {
  const [userId, setUserId] = useState(null);
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [addresses, setAddresses] = useState([
    {
      address1: '',
      address2: '',
      post: '',
      isDefault: false,
    },
  ]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // 카카오페이, 네이버페이, 카드
  const [orderTotal, setOrderTotal] = useState(0); // 주문 총액
  const [cartItems, setCartItems] = useState([]);

  // 사용자 정보 상태
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // 장바구니 정보 가져오기
    const getUserInfo = async () => {
      await fetchUserInfo(setUserId, setUserName, setEmails, setPhones, setAddresses); // 사용자 정보 불러오기
    };

    getUserInfo(); // 사용자 정보 불러오기
    const fetchCart = async () => {
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
        setOrderTotal(
          data.cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0),
        );
      } catch (error) {
        console.error('장바구니 조회 오류:', error.message);
      }
    };

    fetchCart();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          address: address,
          paymentMethod: paymentMethod,
          totalAmount: orderTotal,
          items: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error('결제 실패');
      }

      const data = await response.json();
      alert('결제가 완료되었습니다!');
      navigate('/'); // 홈으로 돌아가기
    } catch (error) {
      console.error('결제 오류:', error.message);
    }
  };

  return (
    <div className='payment-container'>
      <h2>결제</h2>
      <p>사용자 이름: {userName}</p>
      <p>주소: {address}</p>

      {/* 사용자 정보 출력 */}
      {userName && address && (
        <div>
          <p>사용자 이름: {userName}</p>
          <p>전화번호: {address}</p>
        </div>
      )}

      <div className='payment-info'>
        <label htmlFor='address'>배송 주소</label>
        <input
          type='text'
          id='address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='배송지 입력'
        />

        <div>
          <label>결제 수단</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value=''>결제 수단 선택</option>
            <option value='카카오페이'>카카오페이</option>
            <option value='네이버페이'>네이버페이</option>
            <option value='카드'>카드</option>
          </select>
        </div>

        <div>
          <h3>주문 내역</h3>
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>수량</th>
                <th>총 가격</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cartId}>
                  <td>{item.productName}</td>
                  <td>{item.productPrice}원</td>
                  <td>{item.quantity}</td>
                  <td>{item.productPrice * item.quantity}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p>총 결제 금액: {orderTotal}원</p>
        </div>
        <div>
          <button onClick={handlePayment} className='payment-btn'>
            결제하기
          </button>
        </div>

        {/* 카카오페이 버튼 이미지 */}

        <div className='kakao-pay-btn'>
          <button onClick={handlePayment} className='payment-btn'>
            <img
              src='src/assets/kakaopay.png'
              alt='카카오페이 결제'
              style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </button>
        </div>
        <button onClick={() => navigate('/')} className='back-btn'>
          뒤로 가기
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
