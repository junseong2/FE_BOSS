import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fetchUserInfo from '../utils/api.js';

function PaymentPage() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 403) {
          console.warn('❌ 로그인 정보 없음. 로그인 페이지로 이동.');
          navigate('/signin');
          return;
        }

        if (!response.ok) {
          throw new Error('로그인 정보 조회 실패');
        }

        const data = await response.json();
        console.log('📌 [fetchUserInfo] 불러온 사용자 정보:', data);

        setUserId(data.userId);
        setUserName(data.userName);
        setEmail(data.email || '');
        setAddress(data.address || '주소 없음');
      } catch (error) {
        console.error('❌ 사용자 정보 조회 오류:', error.message);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
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
      const token = localStorage.getItem('jwt');

      console.log('🟡 결제 요청 시작');
      console.log('🟡 JWT 토큰:', token);
      console.log('🟡 전송할 이메일:', email);

      if (!email || !email.includes('@')) {
        console.error('❌ [오류] 이메일이 유효하지 않음:', email);
        alert('사용자 이메일을 가져오지 못했습니다. 다시 로그인해주세요.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/payment/toss',
        {
          amount: orderTotal,
          orderName: '테스트 주문',
          userEmail: email,
          paymentMethod: 'TOSS',
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('🟢 결제 요청 성공:', response.data);
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('🔴 결제 오류:', error.response?.data || error.message);
    }
  };

  return (
    <div className='payment-container'>
      <h2>결제</h2>
      <p>사용자 이름: {userName}</p>
      <p>이메일: {email}</p>
      <p>주소: {address}</p>

      <div className='payment-info'>
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
        <p>총 결제 금액: {orderTotal}원</p>
        <button onClick={handlePayment} className='payment-btn'>
          Toss 결제하기
        </button>
      </div>
      <button onClick={() => navigate('/')} className='back-btn'>
        뒤로 가기
      </button>
    </div>
  );
}

export default PaymentPage;
