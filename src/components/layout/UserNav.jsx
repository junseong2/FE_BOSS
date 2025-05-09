import { useEffect, useState } from 'react';
import { IoCartOutline, IoHomeOutline, IoLogOutOutline, IoPersonOutline } from 'react-icons/io5';
import { MdDashboard, MdStorefront } from 'react-icons/md';
import { getCartCount } from '../../services/cart.service';
import { useCartStore } from '../../store/cartStore';
import { BASE_URL } from "../../lib/api.js"

export default function UserNav({
  setUserId,
  role,
  storeName,
  setIsSellerModalOpen,
  setIsModalOpen,
  userName,
  setUserName,
  setRole,
  navigate,
  userId,
}) {
  const { setTrigger: cartItemStateTrigger } = useCartStore();
  const [cartTotalCount, setCartTotalCount] = useState(0);
  const [dropdown, setDropdown] = useState(false);

  // 로그인
  const handleSignInClick = () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);
    setIsModalOpen(true);
  };

  // 회원가입
  const handleLogoutClick = async () => {
    const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirmLogout) return;
    await fetch( BASE_URL+'/auth/logout', { method: 'GET', credentials: 'include' });
    setUserId(null);
    setUserName(null);
    setRole(null);
    navigate('/');
    cartItemStateTrigger();
  };

  // 카테고리 아이템 개수 조회
  const getCartCountFetch = async () => {
    const totalCount = await getCartCount();
    console.log(totalCount);
    setCartTotalCount(totalCount);
  };

  // 카테고리 아이템 개수
  useEffect(() => {
    getCartCountFetch();
  }, [cartItemStateTrigger]);

  useEffect(() => {});

  // 유저 Role 에 따른 렌더링 버튼 분기처리
  const renderButtonsByRole = () => {
    switch (role) {
      case 'SELLER':
        return (
          <>
            <IconBtn
              icon={<MdDashboard />}
              label='내 상점 꾸미기'
              visibleLabel={'에디터'}
              onClick={() => navigate('/editor')}
            />
            <IconBtn
              icon={<MdStorefront />}
              label='판매자 대시보드'
              visibleLabel={'대시보드'}
              onClick={() => navigate('/seller/dashboard')}
            />
            <IconBtn
              icon={<IoHomeOutline />}
              label='내 스토어'
              visibleLabel={'내 상점'}
              onClick={() => {
                console.log('🔘 내 스토어 버튼 클릭됨', storeName);
                if (storeName) {
                  navigate(`/${storeName}/shop`);
                } else {
                  alert('스토어 정보가 없습니다.');
                }
              }}
            />
          </>
        );
      case 'ADMIN':
        return (
          <>
            <IconBtn icon={<MdStorefront />} label='관리자' onClick={() => navigate('/admin')} />
          </>
        );
      case 'CUSTOMER':
      default:
        return (
          <>
            <IconBtn
              icon={<MdStorefront />}
              label='판매업 등록'
              visibleLabel={'판매업 등록'}
              onClick={() => setIsSellerModalOpen(true)}
            />
          </>
        );
    }
  };

  return (
    <div className='flex justify-end gap-2'>
      {userId ? (
        <>
          <div
            className='flex items-center relative'
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <p className='text-sm font-medium text-gray-700'>
              <span
                onClick={() => navigate('mypage')}
                className='hover:shadow-[inset_0_-1px_0_0_black] cursor-pointer font-semibold text-black-600'
              >
                {userName}
              </span>
              님
            </p>

            {/* 드롭다운 */}
            <div
              className={`${dropdown ? 'visible opacity-100' : 'invisible opacity-0'} flex flex-col gap-2  absolute top-[50px] transition-all bg-white shadow-xl w-[180px] left-[50%] translate-x-[-50%] rounded-xl right-[5rem] p-2 `}
            >
              {renderButtonsByRole()}
              <IconBtn
                icon={<IoPersonOutline />}
                label='마이페이지'
                visibleLabel={'마이페이지'}
                onClick={() => navigate('/mypage')}
              />
              <IconBtn
                icon={<IoLogOutOutline />}
                label='로그아웃'
                visibleLabel={'로그아웃'}
                onClick={handleLogoutClick}
              />
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center'>
          <button
            className='px-4 py-1 text-sm font-medium hover:bg-gray-100 rounded-xl transition-colors'
            onClick={handleSignInClick}
          >
            로그인
          </button>
          <button
            className='px-4 py-1 text-sm font-medium hover:bg-gray-100 rounded-xl transition-colors'
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>
        </div>
      )}
      <IconBtn
        icon={<IoCartOutline />}
        label='장바구니'
        onClick={() => navigate('/cart')}
        badge={cartTotalCount || 0}
      />
    </div>
  );
}

// 헤더 아이콘 버튼
const IconBtn = ({ icon, label, onClick, badge, visibleLabel }) => (
  <div
    onClick={visibleLabel ? onClick : null}
    className={`${visibleLabel ? 'cursor-pointer hover:bg-gray-200 ' : ''} hover:bg-[rgba(255,255,255,0.5)] flex relative group items-center border border-[rgba(255,255,255,0.3)] rounded-xl p-1 px-2`}
  >
    <button
      className={`${visibleLabel ? '' : 'hover:bg-gray-100'} p-1 px-2 rounded-full  transition-colors relative`}
      onClick={onClick}
    >
      {icon}
      {badge >= 0 && (
        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
          {badge}
        </span>
      )}
    </button>
    {visibleLabel ? (
      <span className='text-[14px]'>{visibleLabel}</span>
    ) : (
      <span className='absolute bottom-[-1.5rem] left-1/2 text-white -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800  text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
        {label}
      </span>
    )}
  </div>
);
