import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../App.css';
import './topbar5.css';
import '../../buttons.css';
import logo from '../../assets/nasone.png';
import SignIn from '../../pages/SignIn'; // ✅ SignIn 모달 추가

const sections = [
  { id: 'about', component: <div className='page'>📌 About Page</div> },
  { id: 'contact', component: <div className='page'>📞 Contact Page</div> },
  { id: 'event', component: <div className='page'>🎉 Event Page</div> },
  { id: 'camera', component: <div className='page'>📷 Camera Page</div> },
];

const Top5 = () => {
  const [currentSection, setCurrentSection] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 로그인 모달 상태 추가
  const [searchQuery, setSearchQuery] = useState(''); // ✅ 검색 기능 복구
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRefs = useRef([]);

  useEffect(() => {}, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);

    await fetch('http://localhost:5000/save-redirect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUrl: currentUrl }),
      credentials: 'include',
    });

    setIsModalOpen(true); // ✅ 로그인 버튼 클릭 시 모달 열기
  };

  return (
    <div className='top2'>
      <header className='topbar2'>
        <div className='topbar-content'>
          <img src={logo} alt='로고' className='logo' onClick={() => navigate('/')} />
          <form className='search-form' onSubmit={handleSearch}>
            <input
              type='text'
              className='search-input'
              placeholder='검색어 입력'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type='submit' className='search-button'>
              🔍
            </button>
          </form>
          <div className='user-info-container5'>
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
        </div>
      </header>

      {/* ✅ 로그인 모달 */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <SignIn onClose={() => setIsModalOpen(false)} /> {/* SignIn 모달 렌더링 */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Top5;
