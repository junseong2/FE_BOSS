import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../App.css';
import './topbar.css';
import '../../buttons.css';
import { useCart } from '../../context/CartContext'; // CartContext에서 useCart 훅 import
import fetchUserInfo from '../../utils/api.js'; // API 함수 import
import { IoSearch, IoGiftOutline } from 'react-icons/io5'; // IoSearch 아이콘 import

function Top() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [emails, setEmails] = useState(['']); // 추가된 상태
  const [phones, setPhones] = useState(['']); // 추가된 상태
  const [addresses, setAddresses] = useState([
    {
      address1: '',
      address2: '',
      post: '',
      isDefault: false,
    },
  ]); // 추가된 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartPopup, setShowCartPopup] = useState(false); // 팝업 상태
  const { cartItems, loadCart } = useCart(); // useCart 훅을 통해 cartItems 상태 가져오기
  const [loadingCart, setLoadingCart] = useState(false); // 장바구니 로딩 상태 추가
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUserInfo = async () => {
      await fetchUserInfo(setUserId, setUserName, setEmails, setPhones, setAddresses); // 사용자 정보 불러오기
    };

    getUserInfo(); // 사용자 정보 불러오기
  }, []); // 빈 배열로 수정하여 처음 렌더링될 때만 호출

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);

    await fetch('http://localhost:5000/save-redirect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUrl: currentUrl }),
      credentials: 'include',
    });

    navigate('/signin');
  };

  const handleLogoutClick = async () => {
    await fetch('http://localhost:5000/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });

    setUserId(null);
    setUserName(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMouseEnter = async () => {
    setLoadingCart(true); // 장바구니 로딩 시작
    await loadCart(); // 장바구니 데이터를 불러옵니다.
    setLoadingCart(false); // 로딩 완료
    setShowCartPopup(true); // 팝업 표시
  };

  const handleMouseLeave = () => {
    setShowCartPopup(false); // 팝업 숨김
  };

  const getCartItemList = () => {
    if (cartItems.length === 0) {
      return <p>장바구니가 비어 있습니다.</p>;
    }

    return (
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.productName} - {item.productPrice}원 (수량: {item.quantity})
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='top-bar'>
      <img
        src='src/assets/boss_logo.png' // 이미지 경로를 public 폴더 기준으로 설정
        alt='Boss Logo'
        className='logo'
        onClick={() => navigate('/')} // 로고 클릭 시 홈으로 이동
      />

      <form className='search-form' onSubmit={handleSearch}>
        <input
          type='text'
          className='search-input'
          placeholder='검색어 입력'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type='submit' className='search-button'>
          <IoSearch /> {/* 돋보기 아이콘으로 변경 */}
        </button>
      </form>
      <div className='user-info-container'>
        {userId && userName && (
          <p className='welcome-message'>
            {userName}님, <span>유저 ID: {userId}</span>
          </p>
        )}
      </div>
      <div className='button-container'>
        {userId ? (
          <>
            <button className='TopSigninBt' onClick={handleLogoutClick}>
              로그아웃
            </button>
            <button className='MypageBt' onClick={() => navigate('/mypage')}>
              마이페이지
            </button>
            <button
              className='MypageBt'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/cart')}
            >
              장바구니
            </button>
            {showCartPopup && (
              <div className='cart-popup'>
                {loadingCart ? <p>장바구니 로딩 중...</p> : getCartItemList()}
              </div>
            )}
          </>
        ) : (
          <button className='TopSigninBt' onClick={handleSignInClick}>
            로그인
          </button>
        )}
      </div>
    </div>
  );
}

export default Top;
