import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {IoHomeOutline,IoSearch, IoCartOutline, IoPersonOutline, IoLogOutOutline, IoClose } from "react-icons/io5"
import { MdDashboard, MdStorefront } from "react-icons/md"
import { useCart } from "../../context/CartContext"
import fetchUserInfo from "../../utils/api.js"
import { useUser } from "../../context/UserContext"
import SignIn from "../../pages/SignIn"
import SellerRegistrationPage from "../../pages/sellerSignup/SellerRegistrationPage.jsx"
import bossLogo from '../../assets/boss_logo.jpg';
import { BASE_URL } from "../../lib/api.js"

export default function Top() {
  const { userId, setUserId, userName, setUserName, role, setRole, storeName, setStoreName } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emails, setEmails] = useState([""])
  const [phones, setPhones] = useState([""])
  const [addresses, setAddresses] = useState([{ address1: "", address2: "", post: "", isDefault: false }])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { cartItems, loadCart } = useCart()
  const [loadingCart, setLoadingCart] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false)
  const [modalAnimation, setModalAnimation] = useState(false)

  const [trigger, setTrigger] = useState(false);

  const handleAddToCart = async (productId) => {
    await fetch(BASE_URL+`/cart/add`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
  
    // ✅ 장바구니 새로고침
    loadCart();
  };
  useEffect(() => {
    const getUserInfo = async () => {
      await fetchUserInfo(setUserId, setUserName, setEmails, setPhones, setAddresses, (role) => {
        setRole(role)
        setTrigger(prev => !prev) // 👈 트리거 강제 업데이트
      },
      setStoreName 
    )

    }
    getUserInfo()
  }, [])
  const fetchSellerStoreName = async (userId) => {
    try {
      console.log("📦 fetchSellerStoreName 호출됨 - userId:", userId);
      const res = await fetch(BASE_URL+`/seller/seller-info-byuserid/${userId}`);
      const data = await res.json();
      console.log("📦 fetchSellerStoreName 응답:", data);
  
      if (data.storename) {
        setStoreName(data.storename);
        console.log("✅ storeName 저장됨:", data.storename);
      } else {
        console.warn("⚠️ storeName이 없습니다:", data);
      }
    } catch (err) {
      console.error("❌ 스토어명 불러오기 실패", err);
    }
  };
  useEffect(() => {
    console.log("🧪 useEffect 감지됨:", { role, userId, storeName });
  
    if (role === "SELLER" && userId && !storeName) {
      console.log("🟡 조건 충족 → fetchSellerStoreName 실행");
      fetchSellerStoreName(userId);
    }
  }, [role, userId]);
  useEffect(() => {
    // ✅ role이 SELLER이고 userId가 존재할 때만 storeName을 따로 요청
    if (role === "SELLER" && userId && !storeName) {
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

  const handleSignInClick = () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);
    setIsModalOpen(true);
  };

  const handleLogoutClick = async () => {
    const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirmLogout) return;
    await fetch(BASE_URL+'/auth/logout', { method: 'GET', credentials: 'include' });
    setUserId(null);
    setUserName(null);
    setRole(null);
    navigate('/');
  };

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

  const renderButtonsByRole = () => {
    switch (role) {
      case 'SELLER':
        return (
          <>
            <IconBtn icon={<MdDashboard />} label="에디터" onClick={() => navigate("/editor")} />
            <IconBtn icon={<MdStorefront />} label="판매자" onClick={() => navigate("/seller/dashboard")} />
            <IconBtn icon={<IoCartOutline />} label="장바구니" onClick={() => navigate("/cart")} badge={cartItems.length}/>
            <IconBtn
  icon={<IoHomeOutline />}
  label="내 스토어"
  onClick={() => {
    console.log("🔘 내 스토어 버튼 클릭됨", storeName);
    if (storeName) {
      navigate(`/${storeName}/shop`)
    } else {
      alert("스토어 정보가 없습니다.")
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
              onClick={() => setIsSellerModalOpen(true)}
            />
            <IconBtn
              icon={<IoCartOutline />}
              label='장바구니'
              onClick={() => navigate('/cart')}
              badge={cartItems.length}
            />
          </>
        );
    }
  };

  const IconBtn = ({ icon, label, onClick, badge }) => (
    <div className='relative group'>
      <button
        className='p-2 rounded-full hover:bg-gray-100 transition-colors relative'
        onClick={onClick}
      >
        {icon}
        {badge > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
            {badge}
          </span>
        )}
      </button>
      <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
        {label}
      </span>
    </div>
  );

  return (
    <>
      <div className='h-20'></div>
      <header className='fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shadow-sm'>
        <div className='max-w-[1200px] w-full mx-auto flex items-center justify-between px-4'>
          <div className='flex items-center'>
            <img
              src={bossLogo}
              className='w-16 h-auto ml-8 cursor-pointer transition-transform hover:scale-105'
              onClick={() => navigate('/')}
              alt='Boss Logo'
            />
            <form className='hidden md:flex items-center ml-8' onSubmit={handleSearch}>
              <div className='relative'>
                <input
                  type='text'
                  className='w-80 pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
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

          <div className='flex items-center gap-2'>
            {userId ? (
              <>
                <div className='mr-4'>
                  <p className='text-sm font-medium text-gray-700'>
                    <span className='font-semibold text-black-600'>{userName}</span>님
                  </p>
                </div>

                {renderButtonsByRole()}
                <IconBtn
                  icon={<IoPersonOutline />}
                  label='마이페이지'
                  onClick={() => navigate('/mypage')}
                />
                <IconBtn icon={<IoLogOutOutline />} label='로그아웃' onClick={handleLogoutClick} />
              </>
            ) : (
              <button
                className='px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors'
                onClick={handleSignInClick}
              >
                로그인
              </button>
            )}
          </div>
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
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={() => setTrigger((prev) => !prev)} // ✅ 트리거 전달
          />
        </div>
      </div>

      {/* 판매업 등록 모달 */}
      {isSellerModalOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300'
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
