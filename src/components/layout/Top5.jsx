import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Draggable from 'react-draggable'; // ✅ react-draggable 추가
import '../../App.css';
import './topbar5.css';

import logo from '../../assets/nasone.png';
import SignIn from '../../pages/SignIn'; // ✅ SignIn 모달 추가

const Top5 = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [position, setPosition] = useState(null); // ✅ 초기값을 null로 설정
  const nodeRef = useRef(null); // ✅ nodeRef 추가

  useEffect(() => {
    const savedPosition = localStorage.getItem('dragPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleDragStop = (e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem('dragPosition', JSON.stringify(newPosition)); // ✅ 드래그 후 위치 저장
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = async () => {
    await fetch('http://localhost:5000/auth/logout', { method: 'GET', credentials: 'include' });
    setUserId(null);
    setUserName(null);
    navigate('/');
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        credentials: 'include',
      });
      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);
    };
    getUserInfo();
  }, []);

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);

    await fetch('http://localhost:5000/save-redirect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUrl: currentUrl }),
      credentials: 'include',
    });

    setIsModalOpen(true);
  };

  return (
    <div className='top5'>
      <header className='topbar5'>
        <div className='topbar5-content'>
          <img src={logo} alt='로고' className='logo' onClick={() => navigate('/{storename}')} />
        </div>
      </header>

      {/* ✅ 드래그 가능하게 설정 (전체 화면 이동 가능) */}
      <Draggable
        nodeRef={nodeRef} // ✅ nodeRef 설정
        handle='.user-info-container5'
        position={position} // ✅ 사용자가 이동한 위치 반영
        defaultPosition={{ x: 100, y: 100 }} // ✅ 기본 위치 설정 (처음 화면에 나타나는 위치)
        onStop={handleDragStop}
      >
        <div ref={nodeRef} className={`user-info-container5 ${isSticky ? 'sticky' : ''}`}>
          {userId && userName ? (
            <div className='user-info'>
              <p className='welcome-message'>
                {userName}님, <span>유저 ID: {userId}</span>
              </p>
              <button className='TopSigninBt' onClick={handleLogoutClick}>
                로그아웃
              </button>
              <button className='MypageBt' onClick={() => navigate('/mypage')}>
                마이페이지
              </button>
              <button className='MypageBt' onClick={() => navigate('/cart')}>
                장바구니
              </button>
            </div>
          ) : (
            <button className='TopSigninBt' onClick={handleSignInClick}>
              로그인
            </button>
          )}
        </div>
      </Draggable>

      {/* ✅ 로그인 모달 */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <SignIn onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Top5;
