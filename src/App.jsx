import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // CartProvider import

import './App.css';
import './layout.css';

import Top from './components/layout/Top';
import MenuBar from './MenuBar';
import SignIn from './pages/SignIn.jsx';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CameraCapturePage from './pages/CameraCapturePage';
import ContactPage from './pages/ContactPage';
import MyPage from './pages/MyPage';
import EventPage from './pages/EventPage';
import KakaoMapPage from './pages/KakaoMapPage'; // 경로를 맞게 수정
import ChatBot from "./components/layout/ChatBot"; 

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

function App() {
  const [memberData, setMemberData] = useState(() => {
    return JSON.parse(localStorage.getItem('memberData')) || [];
  });

  useEffect(() => {
    if (memberData.length > 0) {
      localStorage.setItem('memberData', JSON.stringify(memberData));
    }
  }, [memberData]);

  function handleAdd(newMember) {
    setMemberData((prev) => [...prev, newMember]);
  }

  // 현재 경로 가져오기
  const location = useLocation();
  const isAdminPage =
    location.pathname.startsWith('/seller') || location.pathname.startsWith('/admin'); // `/admin`으로 시작하면 true

  return (
    <CartProvider>
      {' '}
      {/* CartContext로 감싸기 */}
      <div className='flex'>
        {/* 관리자 페이지가 아닐 때만 MenuBar와 Top을 렌더링 */}
        {!isAdminPage && <MenuBar />}
        <div className={`flex-1 ${!isAdminPage ? 'ml-60' : ''}`}>
          {!isAdminPage && <Top />}
          <ChatBot />
          <main className='main page'>
            <Routes>
              {/* 일반 페이지 */}
              <Route path='/' element={<HomePage memberData={memberData} onAdd={handleAdd} />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/contact' element={<ContactPage />} />
              <Route path='/event' element={<EventPage />} />

              <Route path='/kakaomap' element={<KakaoMapPage />} />

              <Route path='/camera' element={<CameraCapturePage onAdd={handleAdd} />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/mypage' element={<MyPage />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/category/:categoryId' element={<CategoryPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/productlist' element={<ProductListPage />} />
              <Route path='/product/:productId' element={<ProductDetailPage />} />
              {/* <Route path='/product/recommend-text' element={<ChatBot />} /> */}

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
      </div>
    </CartProvider>
  );
}

export default App;
