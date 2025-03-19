import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, User, MapPin } from 'lucide-react'; // 아이콘 라이브러리 사용
import './bottomnavigation.css';
function BottomNavigation() {
  return (
    <nav className='fixed bottom-0 left-0 w-full bg-white shadow-md p-2 flex justify-around items-center border-t'>
      <Link to='/' className='flex flex-col items-center text-gray-700'>
        <Home size={24} />
        <span className='text-xs'>홈</span>
      </Link>
      <Link to='/category' className='flex flex-col items-center text-gray-700'>
        <MapPin size={24} />
        <span className='text-xs'>카테고리</span>
      </Link>
      <Link to='/cart' className='flex flex-col items-center text-gray-700'>
        <ShoppingCart size={24} />
        <span className='text-xs'>장바구니</span>
      </Link>
      <Link to='/mypage' className='flex flex-col items-center text-gray-700'>
        <User size={24} />
        <span className='text-xs'>마이페이지</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;
