
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoSearch,
  IoClose,
} from 'react-icons/io5';
import fetchUserInfo from '../../utils/api.js';
import { useUserContext } from '../../context/UserContext';
import SignIn from '../../pages/signin/SignIn.jsx';
import SellerRegistrationPage from '../../pages/sellerSignup/SellerRegistrationPage.jsx';
import bossLogo from '../../assets/boss_logo.jpg';
import MenuButton from '../MenuButton.jsx';
import UserNav from './UserNav.jsx';
import { BASE_URL } from "../../lib/api.js"

export default function Top() {
  const { userId, setUserId, userName, setUserName, role, setRole, storeName, setStoreName } =
    useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      await fetchUserInfo(
        setUserId,
        setUserName,
        (role) => {
          setRole(role);
          setTrigger((prev) => !prev); // 👈 트리거 강제 업데이트
        },
        setStoreName,
      );
    };
    getUserInfo();
  }, []);

  const fetchSellerStoreName = async (userId) => {
    try {
      const res = await fetch(BASE_URL+`/seller/seller-info-byuserid/${userId}`);
      const data = await res.json();

      if (data.storename) {
        setStoreName(data.storename);
      } else {
        console.warn('storeName이 없습니다:', data);
      }
    } catch (err) {
      console.error('스토어명 불러오기 실패', err);
    }
  };

  
  useEffect(() => {
    console.log('🧪 useEffect 감지됨:', { role, userId, storeName });

    if (role === 'SELLER' && userId && !storeName) {
      console.log('조건 충족 → fetchSellerStoreName 실행');
      fetchSellerStoreName(userId);
    }
  }, [role, userId]);


  useEffect(() => {
    if (isSellerModalOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setModalAnimation(true), 50);
    } else {
      document.body.style.overflow = '';
      setModalAnimation(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSellerModalOpen]);

  const closeSellerModal = () => {
    setModalAnimation(false);
    setTimeout(() => setIsSellerModalOpen(false), 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* 헤더 */}
      <header className='w-full h-[70px] border-b py-3 border-gray-200  px-4 z-[31] '>
        <div className='max-w-[1200px] w-full mx-auto flex items-center justify-between px-4'>
          <div className='flex items-center gap-3'>
            {/* 카테고리 토글 버튼(메뉴바) */}
            <MenuButton />
            <div className='flex items-center'>
              {/* 사이트 로고 */}
              <h1 className='w-full'>
                <img
                  src={bossLogo}
                  className='min-w-8 min-h-8 max-w-12 max-h-12 cursor-pointer transition-transform hover:scale-105'
                  onClick={() => navigate('/')}
                  alt='Boss Logo'
                />
              </h1>

            </div>

            {/* 검색창 */}
            <form className='hidden md:flex items-center ml-8' onSubmit={handleSearch}>
              <div className='relative'>
                <input
                  type='text'
                  className='w-80 pl-4 pr-10 py-2 border-b-3 border-gray-300 focus:border-gray-500 focus:border-b-4 outline-none transition-all'
                  placeholder='검색어 입력'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type='submit'
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  <IoSearch className='h-5 w-5' />
                </button>
              </div>
            </form>
          </div>
          <UserNav
            userId={userId}
            role={role}
            storeName={storeName}
            userName={userName}
            navigate={navigate}
            setIsModalOpen={setIsModalOpen}
            setRole={setRole}
            setUserId={setUserId}
            setUserName={setUserName}
            setIsSellerModalOpen={setIsSellerModalOpen}
          />
        </div>
      </header>

      <div
        className={`${isModalOpen ? 'visible opacity-100' : 'invisible opacity-0'} fixed inset-0 bg-transparent flex items-center justify-center z-55 transition-all`}
      >
        <div className='absolute inset-0 bg-black opacity-80'></div>
        <div
          className={` bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto`}
        >
          <SignIn
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={() => setTrigger((prev) => !prev)} // 트리거 전달
          />
        </div>
      </div>

      {/* 판매업 등록 모달 */}
      {isSellerModalOpen && (
        <div
          className='fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300'
          style={{ opacity: modalAnimation ? 1 : 0 }}
          onClick={closeSellerModal}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-500 ${
              modalAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className='relative bg-gradient-to-r from-emerald-500 to-blue-500 p-6'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2'></div>
              <div className='absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2'></div>

              <div className='flex justify-between items-center relative z-10'>
                <div>
                  <h2 className='text-2xl font-bold text-white'>판매업 등록</h2>
                  <p className='text-green-50 mt-1'>쉽고 빠르게 판매자가 되어보세요</p>
                </div>
                <button
                  className='text-white hover:text-green-100 transition-colors p-2 rounded-full hover:bg-white/10'
                  onClick={closeSellerModal}
                >
                  <IoClose className='w-6 h-6' />
                </button>
              </div>
            </div>

            {/* 모달 내용 */}
            <div className='overflow-y-auto max-h-[calc(90vh-100px)]'>
              <SellerRegistrationPage onClose={closeSellerModal} />
            </div>

            {/* 모달 푸터 */}
            <div className='p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center'>
              <p className='text-xs text-gray-500'>
                판매자 등록에 문제가 있으신가요?
                <a href='#' className='text-green-600 hover:underline ml-1'>
                  고객센터에 문의하세요
                </a>
              </p>
              <button
                className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors'
                onClick={closeSellerModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
