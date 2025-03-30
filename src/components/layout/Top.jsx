import { useNavigate, useLocation } from 'react-router-dom';
import bossLogo from '../../assets/boss_logo.png';
import { useCart } from '../../context/CartContext';
import fetchUserInfo from '../../utils/api.js';
import { useUser } from '../../context/UserContext'; // ✅ 전역 상태 사용
import { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import SignIn from '../../pages/SignIn';

import { IoSearch, IoGiftOutline } from 'react-icons/io5';

function Top() {
  const BASE_URL = 'http://localhost:5000';

  const { userId, setUserId, userName, setUserName } = useUser(); // ✅ 전역 상태 사용
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodeRef = useRef(null);

  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [addresses, setAddresses] = useState([
    { address1: '', address2: '', post: '', isDefault: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartPopup, setShowCartPopup] = useState(false);
  const { cartItems, loadCart } = useCart();
  const [loadingCart, setLoadingCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      await fetchUserInfo(setUserId, setUserName, setEmails, setPhones, setAddresses);
    };
    getUserInfo();
  }, []);

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);

    setIsModalOpen(true);
  };

  const handleLogoutClick = async () => {
    await fetch('http://localhost:5000/auth/logout', { method: 'GET', credentials: 'include' });
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
    setLoadingCart(true);
    await loadCart();
    setLoadingCart(false);
    setShowCartPopup(true);
  };

  const handleMouseLeave = () => {
    setShowCartPopup(false);
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
    <>
      <div className='h-20'></div>
      <div className="fixed top-0 left-0 w-full h-20 bg-blue-200 flex items-center justify-between px-4 z-950">

        <div className="flex items-center justify-start w-full px-4">
          <div className="w-8 h-16 bg-transparent"></div> {/* 오른쪽 박스 */}

          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/boss_logo.png`} className="w-16 h-auto max-w-16 max-h-16 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        <form className="hidden md:flex items-center gap-2 ml-8" onSubmit={handleSearch}>
          <input
            type="text"
            className="w-80 p-2 border border-gray-400 bg-white rounded-md text-lg"
            placeholder="검색어 입력"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="p-2 text-gray-600 text-3xl">
            <IoSearch />
          </button>
        </form>


        {/* 유저 정보 */}
        <div className='ml-auto flex flex-col items-end px-6 '>
          {userId && userName && (
            <p className='text-sm font-semibold'>
              {userName}님 <span>유저 ID: {userId}</span>
            </p>
          )}
        </div>
        <div className='flex gap-2 mt-2'>
          {userId ? (
            <>
              <div className='flex justify-center space-x-2 mt-0'>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-0 text-sm font-bold w-38 h-14 hover:scale-105 transition-transform duration-300'
                  onClick={() => navigate('/editor')}
                >
                  editor
                </button>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-0 text-sm font-bold w-38 h-14 hover:scale-105 transition-transform duration-300'
                  onClick={() => navigate('/seller')}
                >
                  Seller
                </button>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-0 text-sm font-bold w-38 h-14 hover:scale-105 transition-transform duration-300'
                  onClick={() => navigate('/seller/signup')}
                >
                  SellerSignup
                </button>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-0 text-sm font-bold w-38 h-14 hover:scale-105 transition-transform duration-300'
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </button>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-0 text-sm font-bold w-38 h-14 hover:scale-105 transition-transform duration-300'
                  onClick={() => navigate('/mypage')}
                >
                  마이페이지
                </button>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-3 text-sm font-bold w-38 h-14  hover:scale-105 transition-transform duration-300'
                  onClick={handleLogoutClick}
                >
                  로그아웃
                </button>
                <button
                  className='bg-transparent text-black rounded-full px-6 py-3 text-sm font-bold w-38 h-14 hover:scale-105 transition-transform duration-300'
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => navigate('/cart')}
                >
                  장바구니
                </button>
              </div>

              {showCartPopup && (
                <div className='absolute top-20 right-4 bg-white border border-gray-400 rounded-md p-2 w-40 shadow-lg'>
                  {loadingCart ? <p>장바구니 로딩 중...</p> : getCartItemList()}
                </div>
              )}
            </>
          ) : (
            <button
              className='border-2 border-black rounded-md px-3 py-1 text-xs font-bold'
              onClick={handleSignInClick}
            >
              로그인
            </button>
          )}
        </div>

        {/* ✅ 로그인 모달 */}
        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <SignIn onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Top;