import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import './App.css';
import './layout.css';

import Top from './components/layout/Top';
import Top5 from './components/layout/Top5';
import MenuBar from './MenuBar';
import MenuBar5 from './MenuBar5';
import MenuBarNull from './MenuBarNull';
import SignIn from './pages/SignIn.jsx';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CameraCapturePage from './pages/CameraCapturePage';
import ContactPage from './pages/ContactPage';
import MyPage from './pages/MyPage';
import EventPage from './pages/EventPage';
import KakaoMapPage from './pages/KakaoMapPage';

import SignUp from './pages/SignUp';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ProductListPage from './pages/ProductListPage.jsx';
import SellerPage from './pages/sellerDashboard/SellerPage.jsx';
import SellerDashboardPage from './pages/sellerDashboard/SellerDashboardPage.jsx';
import SellerProductPage from './pages/sellerDashboard/SellerProductPage.jsx';
import SellerOrderPage from './pages/sellerDashboard/SellerOrderPage.jsx';
import SellerInventoryPage from './pages/sellerDashboard/SellerInventoryPage.jsx';
import SellerSalesPage from './pages/sellerDashboard/SellerSalesPage.jsx';
import SellerPaymentPage from './pages/sellerDashboard/SellerPaymentPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage';

import ScrollNavigation from './components/ScrollNavigation';
import SwipeNavigation from './components/SwipeNavigation';
import TopbarNavigation from './components/TopbarNavigation';

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigationMode, setNavigationMode] = useState(null); // 페이지 이동 방식 저장
  const navigate = useNavigate();

  useEffect(() => {
    // API에서 userId와 페이지 이동 방식을 가져오기
    const fetchUserInfo = async () => {
      try {
        const userResponse = await fetch('http://localhost:5000/auth/user-info', {
          credentials: 'include',
        });
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUserId(userData.userId);
          setNavigationMode(userData.pageNavigationMode || 'category'); // DB에서 pageNavigationMode 값 가져오기
        } else {
          console.error('🚨 [Error] 로그인 필요:', userData.error);
          setUserId(null);
        }

        // 페이지 이동 방식 가져오기 실패 시 기본값 'category' 설정
      } catch (error) {
        console.error('🚨 [Error] API 호출 실패:', error);
        setNavigationMode('category'); // 기본값 설정
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 현재 경로 가져오기
  const location = useLocation();
  // 이제 `isAdminPage`를 `/seller`와 `/admin` 경로에서만 `true`로 설정

  const isAdminPage =
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/Seller') ||
    location.pathname.startsWith('/admin');
  console.log('어드민페이지:' + location.pathname.startsWith('/seller'));
  // userId 값에 따라 다른 컴포넌트 선택
  let SelectedTop, SelectedMenuBar;

  if (userId === '1') {
    SelectedTop = Top5;
    SelectedMenuBar = MenuBarNull;
  } else {
    SelectedTop = Top;
    SelectedMenuBar = MenuBar;
  }

  return (
    <CartProvider>
      <div className='flex'>
        {/* 로딩 중일 때는 아무것도 표시하지 않음 */}
        {loading ? null : (
          <>
            {/* 관리자 페이지가 아닐 때만 MenuBar와 Top을 렌더링 */}
            {!isAdminPage && <SelectedMenuBar />}
            <div className={`flex-1 ${!isAdminPage ? 'ml-60' : ''}`}>
              {/* 관리자 페이지에서 Top 컴포넌트 렌더링하지 않도록 수정 */}
              {!isAdminPage && <SelectedTop />}
              {/* 네비게이션 방식에 맞는 컴포넌트 렌더링 */}
              {navigationMode === 'scroll' && <ScrollNavigation />}
              {navigationMode === 'swipe' && <SwipeNavigation />}
              {navigationMode === 'topbar' && <TopbarNavigation />}
              {/* 네비게이션 모드를 기본적으로 category 선택으로 설정 */}
              {navigationMode === 'category' && (
                <div className='category-selection'>
                  <h2>이동 방식을 선택하세요</h2>
                  <button onClick={() => setNavigationMode('scroll')}>스크롤 이동</button>
                  <button onClick={() => setNavigationMode('swipe')}>좌우 넘기기</button>
                  <button onClick={() => setNavigationMode('topbar')}>탑바 클릭</button>
                </div>
              )}
              <div className='current-navigation-mode'>
                <h2>
                  현재 이동 방식: <span>{navigationMode}</span>
                </h2>
              </div>{' '}
              <main className='main page'>
                <Routes>
                  {/* 일반 페이지 */}
                  <Route path='/' element={<HomePage />} />
                  <Route path='/about' element={<AboutPage />} />
                  <Route path='/contact' element={<ContactPage />} />
                  <Route path='/event' element={<EventPage />} />
                  <Route path='/kakaomap' element={<KakaoMapPage />} />
                  <Route path='/camera' element={<CameraCapturePage />} />
                  <Route path='/signin' element={<SignIn />} />
                  <Route path='/mypage' element={<MyPage />} />
                  <Route path='/signup' element={<SignUp />} />
                  <Route path='/cart' element={<CartPage />} />
                  <Route path='/category/:categoryId' element={<CategoryPage />} />
                  <Route path='/search' element={<SearchPage />} />
                  <Route path='/productlist' element={<ProductListPage />} />
                  <Route path='/product/:productId' element={<ProductDetailPage />} />

                  <Route path='/seller' element={<SellerPage />}>
                    <Route index path='dashboard' element={<SellerDashboardPage />} />
                    <Route path='product' element={<SellerProductPage />} />
                    <Route path='order' element={<SellerOrderPage />} />
                    <Route path='inventory' element={<SellerInventoryPage />} />
                    <Route path='sales' element={<SellerSalesPage />} />
                    <Route path='payment' element={<SellerPaymentPage />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </>
        )}
      </div>
    </CartProvider>
  );
}

export default App;
