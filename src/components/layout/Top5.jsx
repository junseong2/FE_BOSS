import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Draggable from 'react-draggable';
import SignIn from '../../pages/SignIn';
import { useUser } from '../../context/UserContext'; // ✅ 전역 상태 사용
import { BASE_URL } from '../../lib/api';

const Top5 = ({ sellerMenubarColor, storename }) => {
  const { userId, setUserId, userName, setUserName } = useUser(); // ✅ 전역 상태 사용

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const nodeRef = useRef(null);

  // ✅ 항상 초기 위치를 화면 중앙에 배치
  const getCenterPosition = () => ({
    x: window.innerWidth / 2 - 100, // 가로 중앙 (너비 200px 기준)
    y: window.innerHeight / 2 - 200, // 세로 중앙 (높이 100px 기준)
  });

  const [position, setPosition] = useState(getCenterPosition);

  // ✅ 새로고침 시 화면 중앙으로 리셋
  useEffect(() => {
    setPosition(getCenterPosition());
  }, []);

  // ✅ 드래그 후 위치 저장
  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetch(BASE_URL+'/auth/user-info', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
        setUserName(data.userName);
      }
    };
    getUserInfo();
  }, []);

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search;

    setIsModalOpen(true);
  };

  const handleLogoutClick = async () => {
    await fetch(BASE_URL+'/auth/logout', { method: 'GET', credentials: 'include' });
    setUserId(null);
    setUserName(null);
    navigate('/');
  };

  return (
    <div className='relative'>
      {/* ✅ 네비게이션 바 */}
      <div
        className='absolute top-16 w-full bg-white text-black px-5 py-1 shadow-lg flex items-center justify-between z-50'
        style={{ backgroundColor: sellerMenubarColor }}
      >
        {/* ✅ 중앙 정렬을 위한 컨테이너 */}
        <div className='flex justify-center flex-1'>
          <img
            src={`${BASE_URL}/uploads/nasone.png`}
            alt='로고'
            className='cursor-pointer w-12'
            onClick={() => navigate(`/${storename}`)}
          />
        </div>

        {/* ✅ 버튼 그룹 (우측 정렬) */}
        <div className='flex gap-2'>
          <button
            className='px-3 py-1 bg-transparent hover:bg-gray-300 rounded-md text-xs'
            onClick={() => navigate(`/intro`)}
          >
            Intro
          </button>
          <button
            className='px-3 py-1 bg-transparent hover:bg-gray-300 rounded-md text-xs'
            onClick={() => navigate(`/shop`)}
          >
            Shop
          </button>
        </div>
      </div>

      {/* ✅ 드래거블 유저 정보 박스 */}
      <Draggable
        nodeRef={nodeRef}
        handle='.user-info-container5'
        position={position}
        onStop={handleDragStop}
      >
        <div
          ref={nodeRef}
          className='user-info-container5 fixed p-2 border border-black rounded-lg bg-white shadow-lg w-40 max-w-[200px] h-auto min-h-[250px] z-50'
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {userId && userName ? (
            <div className='user-info flex flex-col items-center text-xs gap-1'>
              <p className='welcome-message font-semibold'>
                {userName}님, <span>유저 ID: {userId}</span>
              </p>
              <button
                className='TopSigninBt mt-1 px-2 py-1 bg-pink-500 text-black rounded-md hover:bg-pink-600 text-xs w-full text-center'
                onClick={handleLogoutClick}
              >
                로그아웃
              </button>
              <button
                className='MypageBt mt-1 px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400 text-xs w-full text-center'
                onClick={() => navigate('/mypage')}
              >
                마이페이지
              </button>
              <button
                className='MypageBt mt-1 px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400 text-xs w-full text-center'
                onClick={() => navigate('/cart')}
              >
                장바구니
              </button>
            </div>
          ) : (
            <button
              className='TopSigninBt px-3 py-1 bg-pink-500 text-black rounded-md hover:bg-pink-600 text-xs w-full text-center'
              onClick={handleSignInClick}
            >
              로그인
            </button>
          )}
        </div>
      </Draggable>

      {/* ✅ 로그인 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <SignIn onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Top5;
