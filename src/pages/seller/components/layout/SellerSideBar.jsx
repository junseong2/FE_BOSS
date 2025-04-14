import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  IoLogOutOutline, IoBarChartOutline, IoBriefcaseOutline, IoCartOutline,
  IoCarOutline, IoPersonOutline, IoCardOutline, IoGridOutline, IoStorefront
} from 'react-icons/io5';

function SellerSideBar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // 로그인한 유저 ID
  const [representativeName, setRepresentativeName] = useState('');
  const [storename, setStorename] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/auth/user-info', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.userId) {
          setUserId(data.userId);
        }
      })
      .catch(err => console.error('유저 정보 가져오기 실패', err));
  }, []);

  useEffect(() => {
    async function fetchSellerInfo() {
      try {
        const res = await fetch(`http://localhost:5000/seller/seller-info-byuserid/${userId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log('✅ 판매자 정보:', data);

        setRepresentativeName(data.representativeName); // ✅ 여기 정확히 들어가야 함
        setStorename(data.storename);
      } catch (err) {
        console.error('❌ 판매자 정보 가져오기 실패', err);
      }
    }

    if (userId) fetchSellerInfo();
  }, [userId]);

  return (
    <>
      <div className='transition lg:max-w-[200px] min-w-[60px] max-w-[60px] h-full w-full'></div>
      <div className='transition lg:max-w-[200px] min-w-[60px] max-w-[60px] flex min-h-scree h-full w-full flex-col bg-[#1a2b3e] p-5 text-white fixed top-0'>
        <div>
          <h2 className='flex items-center lg:justify-start justify-center font-bold'>
            <IoStorefront />
            <span className='pl-1 lg:block hidden'>판매자 대시보드</span>
          </h2>
          <hr className='my-2 border-gray-600' />

          {/* 네비게이션 */}
          <div className='mt-4 flex flex-col overflow-hidden justify-center items'>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/dashboard'
            >
              <IoGridOutline /> 대시보드
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 mt-3 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/product'
            >
              <IoBriefcaseOutline /> 상품관리
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 mt-3 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/order'
            >
              <IoCartOutline /> 주문관리
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 mt-3 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/inventory'
            >
              <IoCarOutline /> 재고관리
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 mt-3 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/payment'
            >
              <IoBarChartOutline /> 매출관리
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 mt-3 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/review'
            >
              <IoPersonOutline /> 리뷰관리
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 min-w-64 lg:p-2 p-0 pl-0.5 mt-3 ${isActive ? 'rounded-lg bg-gray-700' : ''}`
              }
              to='/seller/settlement'
            >
              <IoCardOutline /> 정산관리
            </NavLink>
            <hr className='my-2 border-gray-600' />
          </div>
        </div>

        {/* 판매자 프로필 */}
        <div className='mt-auto flex items-center justify-center lg:flex-row flex-col'>
          <IoPersonOutline className='lg:w-7 lg:h-7 w-5 h-5 group' />
          <div className='ml-2 lg:flex flex-col hidden'>
            <p className='m-0 text-sm'>{representativeName || '---'} 사장님</p>
            <span className='text-xs text-gray-400'>{storename + "샵" || '스토어명 없음'}</span>
          </div>

          <button
            className='lg:ml-2 lg:mt-0 mt-3 ml-0 flex items-center justify-center text-white hover:text-gray-400'
            title='로그아웃'
            onClick={() => navigate('/')}
          >
            <IoLogOutOutline />
          </button>
        </div>
      </div>
    </>
  );
}

export default SellerSideBar;
