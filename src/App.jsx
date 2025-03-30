import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext.jsx';

import AppLayout from './AppLayout';
import ShopPage from './pages/ShopPage';
import IntroPage from './pages/IntroPage';
import './index.css'; // ✅ Tailwind가 적용된 index.css 사용
import Top from './components/layout/Top';
import MenuBar from './MenuBar';
import BottomNavigation from './components/layout/BottomNavigation';

import SignIn from './pages/SignIn.jsx';
import HomePage from './pages/home/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CameraCapturePage from './pages/CameraCapturePage';
import ContactPage from './pages/ContactPage';
import MyPage from './pages/MyPage';
import EventPage from './pages/EventPage';
import ChatBot from './components/layout/ChatBot';

import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';

import SellerPage from './pages/seller/SellerPage.jsx';
import SellerDashboardPage from './pages/seller/SellerDashboardPage.jsx';
import SellerProductPage from './pages/seller/SellerProductPage.jsx';
import SellerOrderPage from './pages/seller/SellerOrderPage.jsx';
import SellerInventoryPage from './pages/seller/SellerInventoryPage.jsx';
import SellerPaymentPage from './pages/seller/SellerPaymentPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopEditorPage from './pages/editor/ShopEditorPage.jsx';

import MobileShopEditorPage from './pages/editor/MobileShopEditorPage.jsx';
import SellerSignUpPage from './pages/sellerSignup/SellerRegistrationPage.jsx';

import AccountRecoveryPage from './pages/accountRecovery/AccountRecoveryPage.jsx';
import PaymentPage from './pages/PaymentPage';
// import AdminPage from './pages/adminPage';
import AdminPage from './pages/admin/AdminPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminVerificationPage from './pages/admin/AdminVerificationPage.jsx';
import AdminSettlementPage from "./pages/admin/AdminSettlementPage";

import Footer from './components/layout/Footer'; // ✅ Footer import 추가
import SignUpPage from './pages/signup/SignUpPage.jsx';
import SellerSettlementPage from './pages/seller/SellerSettlementPage.jsx';

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [storename, setStorename] = useState(null);
  const [headerId, setHeaderId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [menuBarId, setMenuBarId] = useState(null);
  const [navigationId, setNavigationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerMenubarColor, setSellerMenubarColor] = useState('#ffffff');

  const location = useLocation();
  const isAdminPage =
    location.pathname.toLowerCase().startsWith('/seller') ||
    location.pathname.toLowerCase().startsWith('/admin') ||
    location.pathname.toLowerCase().startsWith('/editor') ||
    location.pathname.toLowerCase().startsWith('/mobileeditor');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (!storename) {
      setLoading(false);
      return;

    }
    const fetchSellerInfo = async () => {
      try {
        const sellerResponse = await fetch(`http://localhost:5000/seller/info/${storename}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!sellerResponse.ok) {
          throw new Error(`API 오류 상태: ${sellerResponse.status}`);
        }

        const sellerData = await sellerResponse.json();

        console.log('📌 [fetchSellerInfo] 응답 데이터:', sellerData);

        setSellerId(sellerData.sellerId ?? null); // sellerId 업데이트
        setHeaderId(sellerData.headerId ?? null);
        setMenuBarId(sellerData.menuBarId ?? null);
        setNavigationId(sellerData.navigationId ?? null);
        setSellerMenubarColor(sellerData.seller_menubar_color ?? '#ffffff');
        console.log("📌 [fetchSellerInfo] 상태 업데이트 후 sellerId:", sellerData.sellerId);

      } catch (error) {
        console.error(' fetchSellerInfo API 호출 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [storename]); // storename이 변경

  useEffect(() => {


    console.log("백엔드 API URL:", import.meta.env.VITE_BACKEND_URL);
    console.log("app.jsx에서 본 sellerId:", sellerId);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  console.log("📌 APP.js 시작:");

  return (
    <CartProvider>
      <UserProvider>
        <div className='relative flex-col min-h-screen'>
          {/* ✅ 관리자 페이지가 아닐 때만 `Top`과 `MenuBar` 렌더링 */}
          {!isAdminPage && <Top />}
          {!isAdminPage && <MenuBar />}

          <ChatBot />

          <div className='flex flex-col min-h-screen'>
            <main className='flex-grow flex-1 min-h-[calc(100vh-150px) ]'>
              {/*150px는 header와 footer높이 합 */}
              <Routes>
                <Route
                  path='/:storename/*'
                  element={
                    <AppLayout
                      sellerId={sellerId}
                      headerId={headerId}
                      menuBarId={menuBarId}
                      navigationId={navigationId}
                      setStorename={setStorename}
                      sellerMenubarColor={sellerMenubarColor}
                    />
                  }
                >
                  <Route
                    path='shop'
                    element={
                      <ShopPage
                        sellerId={sellerId}
                        headerId={headerId}
                        menuBarId={menuBarId}
                        navigationId={navigationId}
                        sellerMenubarColor={sellerMenubarColor}
                      />
                    }
                  />

                  <Route
                    path='intro'
                    element={
                      <IntroPage
                        sellerId={sellerId}
                        headerId={headerId}
                        menuBarId={menuBarId}
                        navigationId={navigationId}
                        sellerMenubarColor={sellerMenubarColor}
                      />
                    }
                  />
                </Route>
                {/* ✅ 일반적인 페이지 경로 유지 */}
                <Route path='/' element={<HomePage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/event' element={<EventPage />} />
                <Route path='/contact/*' element={<ContactPage />} />
                <Route path='/event' element={<EventPage />} />
                <Route path='/camera' element={<CameraCapturePage />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/mypage' element={<MyPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/category/:categoryId' element={<CategoryPage />} />
                <Route path='/search' element={<SearchPage />} />
                <Route path='/paymentpage' element={<PaymentPage />} />
                {/* <Route path="/product/recommend-text" element={<ChatBot />} /> */}
                <Route path='/product/:productId' element={<ProductDetailPage />} />
                <Route path='/seller/signup' element={<SellerSignUpPage />} />

                {/* ✅ 판매자 대시보드 경로 유지 */}
                <Route path='/seller' element={<SellerPage />}>
                  <Route index path='dashboard' element={<SellerDashboardPage />} />
                  <Route path='product' element={<SellerProductPage />} />
                  <Route path='order' element={<SellerOrderPage />} />
                  <Route path='inventory' element={<SellerInventoryPage />} />
                  <Route path='payment' element={<SellerPaymentPage />} />
                  <Route path='settlement' element={<SellerSettlementPage />} />
                </Route>

                <Route path='/editor' element={<ShopEditorPage />}></Route>


                <Route path="/admin" element={<AdminPage />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="verification" element={<AdminVerificationPage />} />
                  <Route path="settlement" element={<AdminSettlementPage />} />
                </Route>


                <Route path='/mobileeditor' element={<MobileShopEditorPage />}></Route>


                {/* 비밀번호/아이디 찾기 */}
                <Route path='/auth/account-recovery' element={<AccountRecoveryPage />}></Route>

              </Routes>

              <div className='h-300'></div>
            </main>


            {/* <Footer /> */}

          </div>

          {!isAdminPage && isMobile && <BottomNavigation />}
        </div>
        {!isAdminPage && <Footer />}
        {/* ✅ 로딩 스피너 */}
        {loading && (
          <div className='fixed inset-0 w-full h-screen bg-white/90 flex justify-center items-center text-lg font-bold z-[9999]'>
            로딩 중...
          </div>
        )}
      </UserProvider>
    </CartProvider>
  );
}

export default App;
