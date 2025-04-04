import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { portoneRequest, updatePaymentStatus } from '../services/payment.service';
import { createOrders } from '../services/order.service';

function PaymentPage() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('totalpay'); // 기본값 카카오페이
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [channelKey, setChannelKey] = useState('');

  // ✅ 포트원 SDK 동적 추가
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    script.onload = () => console.log('✅ 포트원 SDK 로드 완료');
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (response.status === 403) {
          console.warn('❌ 로그인 필요. 로그인 페이지로 이동.');
          navigate('/signin');
          return;
        }

        if (!response.ok) throw new Error('로그인 정보 조회 실패');

        const data = await response.json();
        setUserId(data.userId);
        setUserName(data.userName);
        setEmail(data.email || '');
        setAddress(data.address || '주소 없음');
      } catch (error) {
        console.error('❌ 사용자 정보 조회 오류:', error.message);
        setErrorMessage('사용자 정보를 불러오는 중 오류 발생.');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/cart', {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error('장바구니 조회 실패');

        const data = await response.json();
        setCartItems(data.cartItems || []);

        const total = data.cartItems.reduce(
          (sum, item) => sum + (Number(item.productPrice) || 0) * (Number(item.quantity) || 0),
          0,
        );
        setOrderTotal(total);
      } catch (error) {
        console.error('장바구니 조회 오류:', error.message);
        setErrorMessage('장바구니 정보를 불러오는 중 오류 발생.');
      }
    };

    fetchCart();
  }, [userId]);

  useEffect(() => {
    const fetchChannelKey = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/payment/channel-key/${selectedPaymentMethod}`,
        );
        if (!response.ok) throw new Error('채널 키 가져오기 실패');

        const data = await response.json();
        setChannelKey(data.channelKey);
      } catch (error) {
        console.error('채널 키 로드 오류:', error);
      }
    };

    fetchChannelKey();
  }, [selectedPaymentMethod]);

  const handlePayment = async () => {
    if (!channelKey) {
      setErrorMessage('결제 채널 정보를 불러오지 못했습니다.');
      return;
    }

    if (!userId) {
      setErrorMessage('사용자 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/signin');
      return;
    }

    if (!cartItems.length) {
      setErrorMessage('장바구니가 비어 있습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      // ✅ 1. 주문 생성 (Order)
      const order = { userId, totalPrice: orderTotal };


      const orderId = await createOrders(order);
      console.log('✅ 주문 생성 완료:', orderId);

      const IMP = window.IMP;
      if (!IMP) throw new Error('포트원 SDK 로드 실패');

      IMP.init('imp85011465');

      const impUid = `imp_${Date.now()}`;

      // ✅ 2. 결제 요청
      IMP.request_pay(
        {
          channelKey, // ✅ API에서 가져온 채널 키 사용
          pay_method: 'card',
          merchant_uid: impUid,
          name: '상품 결제',
          amount: orderTotal,
          buyer_email: email,
          buyer_name: userName,
          buyer_tel: '010-1234-5678',
          buyer_addr: address,
          m_redirect_url: 'http://localhost:5173',
        },
        async (rsp) => {
          if (rsp.success) {
            console.log('✅ 결제 성공:', rsp);

            // ✅ 3. 결제 정보 저장 (Payment)
            const paymentData = {
              userId,
              orderId, // ✅ 위에서 생성한 orderId 사용
              totalAmount: orderTotal,
              paymentMethod: selectedPaymentMethod,
              impUid: rsp.imp_uid,
            };

            console.log('📩 [DEBUG] 전송할 결제 데이터:', paymentData);

            await portoneRequest(paymentData); // 포트원 결제 정보 저장

            // ✅ 4. 결제 상태 업데이트 (PAID)
            const statusData = { impUid: rsp.imp_uid, status: 'PAID' };
            await updatePaymentStatus(statusData); // 상태 업데이트

            try {
              await fetch('http://localhost:5000/cart/clear', {
                method: 'POST',
                credentials: 'include',
              });
              console.log('🧹 장바구니 비우기 완료');
            } catch (clearError) {
              console.warn('⚠️ 장바구니 비우기 실패:', clearError.message);
            }
          

            navigate('/');
          } else {
            setErrorMessage('결제에 실패했습니다.');

            const statusData = { impUid: rsp.imp_uid, status: 'FAILED' };
            await updatePaymentStatus(statusData); // 상태 업데이트
          }
        },
      );
    } catch (error) {
      setErrorMessage('결제 요청 중 오류 발생: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-lg bg-white p-8 rounded-xl shadow-lg'>
        <h2 className='text-3xl font-extrabold text-center text-gray-800 mb-4'>💳 결제</h2>

        {errorMessage && (
          <p className='bg-red-100 text-red-600 font-medium text-center py-2 rounded-lg mb-4 border border-red-400'>
            ❌ {errorMessage}
          </p>
        )}

        <div className='bg-gray-50 p-6 rounded-lg shadow-sm mb-6'>
          <p className='text-lg font-semibold text-gray-700'>총 결제 금액</p>
          <p className='text-2xl font-bold text-gray-900'>{orderTotal.toLocaleString()} 원</p>
        </div>

        <div className='mt-4'>
          <p className='text-gray-700 font-semibold mb-2'>결제 방법</p>
          <div className='grid grid-cols-2 gap-2'>
            {['totalpay', 'kakaopay', 'tosspay', 'paycopay'].map((method) => (
              <button
                key={method}
                className={`p-3 text-center rounded-lg font-semibold border transition ${
                  selectedPaymentMethod === method
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethod(method)}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePayment} // ✅ 정상적으로 클릭 이벤트 설정
          className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md disabled:bg-gray-400'
          disabled={isLoading}
        >
          {isLoading ? '⏳ 처리 중...' : '💰 결제하기'}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;