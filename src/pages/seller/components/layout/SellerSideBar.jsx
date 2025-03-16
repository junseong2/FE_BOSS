import { NavLink } from 'react-router-dom';
import {
  IoLogOutOutline,
  IoBarChartOutline,
  IoBriefcaseOutline,
  IoCartOutline,
  IoCarOutline,
  IoStorefrontOutline,
  IoPersonOutline,
  IoCardOutline,
  IoGridOutline,
} from 'react-icons/io5';

function SellerSideBar() {
  return (
    <div className='flex h-screen w-full max-w-[200px] flex-col bg-[#1a2b3e] p-5 text-white'>
      <div>
        <h2 className='flex items-center text-lg font-bold'>
          <IoStorefrontOutline /> <span className='pl-1'>판매자 대시보드</span>
        </h2>
        <hr className='my-2 border-gray-600' />

        {/* 네비게이션 */}
        <div className='mt-4 flex flex-col'>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 ${isActive ? 'rounded-md bg-gray-700' : ''}`
            }
            to='/seller/dashboard'
          >
            <IoGridOutline /> 대시보드
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 ${isActive ? 'rounded-md bg-gray-700' : ''}`
            }
            to='/seller/product'
          >
            <IoBriefcaseOutline /> 상품관리
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 ${isActive ? 'rounded-md bg-gray-700' : ''}`
            }
            to='/seller/order'
          >
            <IoCartOutline /> 주문관리
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 ${isActive ? 'rounded-md bg-gray-700' : ''}`
            }
            to='/seller/inventory'
          >
            <IoCarOutline /> 재고관리
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 ${isActive ? 'rounded-md bg-gray-700' : ''}`
            }
            to='/seller/sales'
          >
            <IoBarChartOutline /> 매출 관리
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 ${isActive ? 'rounded-md bg-gray-700' : ''}`
            }
            to='/seller/payment'
          >
            <IoCardOutline /> 정산 관리
          </NavLink>
          <hr className='my-2 border-gray-600' />
        </div>
      </div>

      {/* 판매자 프로필 */}
      <div className='mt-auto flex items-center'>
        <IoPersonOutline className='w-7 h-7' />
        <div className='ml-2 flex flex-col'>
          <p className='m-0 text-sm'>홍길동 점주님</p>
          <span className='text-xs text-gray-400'>부산점</span>
        </div>
        <button className='ml-2 text-white hover:text-gray-400' title='로그아웃'>
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}

export default SellerSideBar;
