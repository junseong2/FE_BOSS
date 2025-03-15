import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AppLayout from './AppLayout'; // ✅ AppLayout import 추가
import ShopPage from './pages/ShopPage';

import './App.css';
import './layout.css';
import Top from './components/layout/Top';
import MenuBar from './MenuBar';
import BottomNavigation from './components/layout/BottomNavigation';

import SignIn from './pages/SignIn.jsx';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CameraCapturePage from './pages/CameraCapturePage';
import ContactPage from './pages/ContactPage';
import MyPage from './pages/MyPage';
import EventPage from './pages/EventPage';
import ChatBot from './components/layout/ChatBot';

import SignUp from './pages/SignUp';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import SellerPage from './pages/seller/SellerPage.jsx';
import SellerDashboardPage from './pages/seller/SellerDashboardPage.jsx';
import SellerProductPage from './pages/seller/SellerProductPage.jsx';
import SellerOrderPage from './pages/seller/SellerOrderPage.jsx';
import SellerInventoryPage from './pages/seller/SellerInventoryPage.jsx';
import SellerSalesPage from './pages/seller/SellerSalesPage.jsx';
import SellerPaymentPage from './pages/seller/SellerPaymentPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopEditorPage from './pages/editor/ShopEditorPage.jsx';

import Footer from './components/layout/Footer'; // ✅ Footer import 추가

function App() {
  const [storename, setStorename] = useState(null);
  const [headerId, setHeaderId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [menuBarId, setMenuBarId] = useState(null);
  const [navigationId, setNavigationId] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isAdminPage =
    location.pathname.toLowerCase().startsWith('/editor') || // `/admin`으로 시작하면 true
    location.pathname.toLowerCase().startsWith('/seller') ||
    location.pathname.toLowerCase().startsWith('/admin');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // ✅ 모바일 여부 체크

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

        console.log('📌 [fetchSellerInfo] 응답 데이터:', sellerData); // ✅ API 응답 확인

        setSellerId(sellerData.sellerData ?? null);
        setHeaderId(sellerData.headerId ?? null);
        setMenuBarId(sellerData.menuBarId ?? null);
        setSellerId(sellerData.sellerId ?? null);
        setNavigationId(sellerData.navigationId ?? null);

        console.log('seller:' + sellerData);
      } catch (error) {
        console.error('API 호출 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [storename]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <CartProvider>
      <div className='app-container'>
        {/* ✅ 관리자 페이지가 아닐 때만 `Top`과 `MenuBar` 렌더링 */}
        {!isAdminPage && <Top />}
        {!isAdminPage && <MenuBar />}

        <div className={`flex-1 ${!isAdminPage ? 'ml-60' : ''}`}>
          <ChatBot />

          <div className='main-content'>
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
                    />
                  }
                />
              </Route>

              {/* ✅ 일반적인 페이지 경로 유지 */}
              <Route path='/' element={<HomePage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/contact/*' element={<ContactPage />} />
              <Route path='/event' element={<EventPage />} />
              <Route path='/camera' element={<CameraCapturePage />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/mypage' element={<MyPage />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/category/:categoryId' element={<CategoryPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/product/:productId' element={<ProductDetailPage />} />
              {/* <Route path="/product/recommend-text" element={<ChatBot />} /> */}

              {/* ✅ 판매자 대시보드 경로 유지 */}
              <Route path='/seller' element={<SellerPage />}>
                <Route index path='dashboard' element={<SellerDashboardPage />} />
                <Route path='product' element={<SellerProductPage />} />
                <Route path='order' element={<SellerOrderPage />} />
                <Route path='inventory' element={<SellerInventoryPage />} />
                <Route path='sales' element={<SellerSalesPage />} />
                <Route path='payment' element={<SellerPaymentPage />} />
              </Route>

              <Route path='/editor' element={<ShopEditorPage />}></Route>
            </Routes>
          </div>

          {/* <Footer /> */}
        </div>

        {!isAdminPage && isMobile && <BottomNavigation />}
      </div>
    </CartProvider>
  );
}

export default App;
