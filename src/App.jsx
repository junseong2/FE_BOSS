import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext.jsx';
import { Toaster } from 'react-hot-toast';

import AppLayout from './AppLayout';
import ShopPage from './pages/ShopPage';
import './index.css';
import '@smastrom/react-rating/style.css';
import Top from './components/layout/Top';
import MenuBar from './MenuBar';
import BottomNavigation from './components/layout/BottomNavigation';
import ScrollToTop from './components/layout/ScrollToTop';

// 기본 페이지
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const CartPage = lazy(() => import('./pages/cart/CartPage'));
const CameraCapturePage = lazy(() => import('./pages/CameraCapturePage'));
const ContactPage = lazy(() => import('./pages/contact/ContactPage.jsx'));
const MyPage = lazy(() => import('./pages/myPage/MyPage'));
const EventPage = lazy(() => import('./pages/event/EventPage'));
const ProductPage = lazy(() => import('./pages/product/ProductPage'));
const ChatBot = lazy(() => import('./components/layout/ChatBot'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProductDetailPage = lazy(() => import('./pages/productDetail/ProductDetailPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const SignUpPage = lazy(() => import('./pages/signup/SignUpPage.jsx'));
const AccountRecoveryPage = lazy(() => import('./pages/accountRecovery/PasswordResetPage.jsx'));

// 홈
const HomePage = lazy(() => import('./pages/home/HomePage'));

// 셀러
const SellerPage = lazy(() => import('./pages/seller/SellerPage.jsx'));
const SellerDashboardPage = lazy(() => import('./pages/seller/SellerDashboardPage.jsx'));
const SellerProductPage = lazy(() => import('./pages/seller/SellerProductPage.jsx'));
const SellerOrderPage = lazy(() => import('./pages/seller/SellerOrderPage.jsx'));
const SellerInventoryPage = lazy(() => import('./pages/seller/SellerInventoryPage.jsx'));
const SellerPaymentPage = lazy(() => import('./pages/seller/SellerPaymentPage.jsx'));
const SellerSettlementPage = lazy(() => import('./pages/seller/SellerSettlementPage.jsx'));
const SellerReviewPage = lazy(() => import('./pages/seller/SellerReviewPage.jsx'));
const SellerSignUpPage = lazy(() => import('./pages/sellerSignup/SellerRegistrationPage.jsx'));

// 에디터
const ShopEditorPage = lazy(() => import('./pages/editor/ShopEditorPage.jsx'));
const MobileShopEditorPage = lazy(() => import('./pages/editor/MobileShopEditorPage.jsx'));

// 관리자
const AdminPage = lazy(() => import('./pages/admin/AdminPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminVerificationPage = lazy(() => import('./pages/admin/AdminVerificationPage.jsx'));
const AdminSettlementPage = lazy(() => import('./pages/admin/AdminSettlementPage'));

// 레이아웃
const Footer = lazy(() => import('./components/layout/Footer'));
import { BASE_URL } from './lib/api.js';
import SuspenseFallback from './components/SuspenseFallback.jsx';

function App() {
  const [storename, setStorename] = useState(null);
  const [headerId, setHeaderId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [menuBarId, setMenuBarId] = useState(null);
  const [navigationId, setNavigationId] = useState(null);
  const [sellerMenubarColor, setSellerMenubarColor] = useState('#ffffff');

  const location = useLocation();
  const isAdminPage =
    location.pathname.toLowerCase().startsWith('/seller') ||
    location.pathname.toLowerCase().startsWith('/admin') ||
    location.pathname.toLowerCase().startsWith('/editor') ||
    location.pathname.toLowerCase().startsWith('/mobileeditor');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user-info`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
          setUserName(data.userName);
        } else {
          console.log('❌ 로그인되지 않은 상태입니다.');
        }
      } catch (err) {
        console.error('❌ 로그인 확인 중 에러 발생', err);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!storename) {
      return;
    }
    const fetchSellerInfo = async () => {
      try {
        const sellerResponse = await fetch(BASE_URL + `/seller/info/${storename}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!sellerResponse.ok) {
          throw new Error(`API 오류 상태: ${sellerResponse.status}`);
        }

        const sellerData = await sellerResponse.json();

        setSellerId(sellerData.sellerId ?? null); // sellerId 업데이트
        setHeaderId(sellerData.headerId ?? null);
        setMenuBarId(sellerData.menuBarId ?? null);
        setNavigationId(sellerData.navigationId ?? null);
        setSellerMenubarColor(sellerData.seller_menubar_color ?? '#ffffff');
      } catch (error) {
        console.error(' fetchSellerInfo API 호출 실패:', error);
      }
    };

    fetchSellerInfo();
  }, [storename]); // storename이 변경

  useEffect(() => {
    console.log('백엔드 API URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('app.jsx에서 본 sellerId:', sellerId);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const reservedPaths = [
    'about',
    'event',
    'contact',
    'camera',
    'signin',
    'mypage',
    'signup',
    'cart',
    'category',
    'search',
    'paymentpage',
    'product',
    'seller',
    'editor',
    'mobileeditor',
    'auth',
  ];
  const firstSegment = location.pathname.split('/')[1] || '';
  const isStorePage = firstSegment && !reservedPaths.includes(firstSegment.toLowerCase());

  return (
    <CartProvider>
      <Toaster position='top-right' containerClassName='mt-[2rem]' />
      <UserProvider>
        <div className='flex flex-col min-h-screen'>
          {/* ✅ 상단 영역 */}
          {!isAdminPage && <Top />}
          {!isAdminPage && <MenuBar />}
          <ChatBot />

          {/* ✅ 메인 콘텐츠 (중복된 min-h-screen 제거됨!) */}
          <main className='flex-grow'>
            {/*150px는 header와 footer높이 합 */}
            <ScrollToTop />
            <Routes>
              <Route
                path='/:storename/*'
                element={
                  <Suspense fallback={<SuspenseFallback message='스토어 불러오는 중...' />}>
                    <AppLayout
                      sellerId={sellerId}
                      setSellerId={setSellerId}
                      headerId={headerId}
                      menuBarId={menuBarId}
                      navigationId={navigationId}
                      setStorename={setStorename}
                      sellerMenubarColor={sellerMenubarColor}
                    />
                  </Suspense>
                }
              >
                <Route
                  path='shop'
                  element={
                    <Suspense fallback={<SuspenseFallback message='상점 불러오는 중...' />}>
                      <ShopPage
                        {...{ sellerId, headerId, menuBarId, navigationId, sellerMenubarColor }}
                      />
                    </Suspense>
                  }
                />
                <Route
                  path='products'
                  element={
                    <Suspense fallback={<SuspenseFallback message='상품 목록 불러오는 중...' />}>
                      <ProductPage
                        {...{ sellerId, headerId, menuBarId, navigationId, sellerMenubarColor }}
                      />
                    </Suspense>
                  }
                />
         
              </Route>

              {/* 일반 페이지 */}
              <Route
                path='/'
                element={
                  <Suspense fallback={<SuspenseFallback message='홈페이지 불러오는 중...' />}>
                    <HomePage />
                  </Suspense>
                }
              />
              <Route
                path='/about'
                element={
                  <Suspense fallback={<SuspenseFallback message='소개 페이지 불러오는 중...' />}>
                    <AboutPage />
                  </Suspense>
                }
              />
              <Route
                path='/event'
                element={
                  <Suspense fallback={<SuspenseFallback message='이벤트 페이지 불러오는 중...' />}>
                    <EventPage />
                  </Suspense>
                }
              />
              <Route
                path='/contact/*'
                element={
                  <Suspense fallback={<SuspenseFallback message='문의 페이지 불러오는 중...' />}>
                    <ContactPage />
                  </Suspense>
                }
              />
              <Route
                path='/camera'
                element={
                  <Suspense fallback={<SuspenseFallback message='카메라 기능 불러오는 중...' />}>
                    <CameraCapturePage />
                  </Suspense>
                }
              />
              <Route
                path='/signup'
                element={
                  <Suspense
                    fallback={<SuspenseFallback message='회원가입 페이지 불러오는 중...' />}
                  >
                    <SignUpPage />
                  </Suspense>
                }
              />
              <Route
                path='/mypage'
                element={
                  <Suspense fallback={<SuspenseFallback message='마이페이지 불러오는 중...' />}>
                    <MyPage />
                  </Suspense>
                }
              />
              <Route
                path='/cart'
                element={
                  <Suspense fallback={<SuspenseFallback message='장바구니 불러오는 중...' />}>
                    <CartPage />
                  </Suspense>
                }
              />
              <Route
                path='/category/:categoryId'
                element={
                  <Suspense
                    fallback={<SuspenseFallback message='카테고리 페이지 불러오는 중...' />}
                  >
                    <CategoryPage />
                  </Suspense>
                }
              />
              <Route
                path='/search'
                element={
                  <Suspense
                    fallback={<SuspenseFallback message='  페이지 불러오는 중...' />}
                  >
                    <SearchPage />
                  </Suspense>
                }
              ></Route>
              <Route
                path='/paymentpage'
                element={
                  <Suspense fallback={<SuspenseFallback message='결제 페이지 불러오는 중...' />}>
                    <PaymentPage />
                  </Suspense>
                }
              />
              <Route
                path='/product/:productId'
                element={
                  <Suspense fallback={<SuspenseFallback message='상품 상세정보 불러오는 중...' />}>
                    <ProductDetailPage />
                  </Suspense>
                }
              />
              <Route
                path='/seller/signup'
                element={
                  <Suspense
                    fallback={<SuspenseFallback message='판매자 가입 페이지 불러오는 중...' />}
                  >
                    <SellerSignUpPage />
                  </Suspense>
                }
              />

              {/* 판매자 */}
              <Route
                path='/seller'
                element={
                  <Suspense fallback={<SuspenseFallback message='판매자 페이지 불러오는 중...' />}>
                    <SellerPage />
                  </Suspense>
                }
              >
                <Route
                  index
                  path='dashboard'
                  element={
                    <Suspense
                      fallback={<SuspenseFallback message='판매자 대시보드 불러오는 중...' />}
                    >
                      <SellerDashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path='product'
                  element={
                    <Suspense fallback={<SuspenseFallback message='상품 관리 불러오는 중...' />}>
                      <SellerProductPage />
                    </Suspense>
                  }
                />
                <Route
                  path='order'
                  element={
                    <Suspense fallback={<SuspenseFallback message='주문 관리 불러오는 중...' />}>
                      <SellerOrderPage />
                    </Suspense>
                  }
                />
                <Route
                  path='inventory'
                  element={
                    <Suspense fallback={<SuspenseFallback message='재고 관리 불러오는 중...' />}>
                      <SellerInventoryPage />
                    </Suspense>
                  }
                />
                <Route
                  path='payment'
                  element={
                    <Suspense fallback={<SuspenseFallback message='정산 내역 불러오는 중...' />}>
                      <SellerPaymentPage />
                    </Suspense>
                  }
                />
                <Route
                  path='settlement'
                  element={
                    <Suspense fallback={<SuspenseFallback message='판매자 정산 불러오는 중...' />}>
                      <SellerSettlementPage />
                    </Suspense>
                  }
                />
                <Route
                  path='review'
                  element={
                    <Suspense fallback={<SuspenseFallback message='리뷰 관리 불러오는 중...' />}>
                      <SellerReviewPage />
                    </Suspense>
                  }
                />
              </Route>

              {/* 에디터 */}
              <Route
                path='/editor'
                element={
                  <Suspense fallback={<SuspenseFallback message='에디터 불러오는 중...' />}>
                    <ShopEditorPage />
                  </Suspense>
                }
              />
              <Route
                path='/mobileeditor'
                element={
                  <Suspense fallback={<SuspenseFallback message='모바일 에디터 불러오는 중...' />}>
                    <MobileShopEditorPage />
                  </Suspense>
                }
              />

              {/* 관리자 */}
              <Route
                path='/admin'
                element={
                  <Suspense fallback={<SuspenseFallback message='관리자 페이지 불러오는 중...' />}>
                    <AdminPage />
                  </Suspense>
                }
              >
                <Route
                  index
                  element={
                    <Suspense
                      fallback={<SuspenseFallback message='관리자 대시보드 불러오는 중...' />}
                    >
                      <AdminDashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path='verification'
                  element={
                    <Suspense fallback={<SuspenseFallback message='인증 요청 불러오는 중...' />}>
                      <AdminVerificationPage />
                    </Suspense>
                  }
                />
                <Route
                  path='settlement'
                  element={
                    <Suspense fallback={<SuspenseFallback message='정산 내역 불러오는 중...' />}>
                      <AdminSettlementPage />
                    </Suspense>
                  }
                />
              </Route>

              {/* 계정 복구 */}
              <Route
                path='/auth/account-recovery'
                element={
                  <Suspense
                    fallback={<SuspenseFallback message='계정 복구 페이지 불러오는 중...' />}
                  >
                    <AccountRecoveryPage />
                  </Suspense>
                }
              />
            </Routes>
          </main>

        </div>

        {!isAdminPage && isMobile && <BottomNavigation />}
        {!isStorePage && !isAdminPage && <Footer />}
      </UserProvider>
    </CartProvider>
  );
}

export default App;
