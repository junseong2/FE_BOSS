import { useEffect } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import Top from './components/layout/Top';
import Top5 from './components/layout/Top5';
import Top6 from './components/layout/Top6';
import MenuBar from './MenuBar';
import MenuBar5 from './MenuBar5';
import MenuBarNull from './MenuBarNull';
import Footer from './components/layout/Footer';

function AppLayout({
  headerId,
  sellerId,
  sheaderId,
  menuBarId,
  navigationId,
  setSellerId, // ✅ 추가
  setStorename,
  sellerMenubarColor,
}) {
  const { storename } = useParams();
  const location = useLocation();
  const isAdminPage =
    location.pathname.toLowerCase().startsWith('/seller') ||
    location.pathname.toLowerCase().startsWith('/admin');

  useEffect(() => {
    console.log('📌 [AppLayout] useParams()에서 가져온 storename:', storename);
    if (sellerId) {
      setSellerId(sellerId);
    }
    if (storename) {
      setStorename(storename);
    }
  }, [storename, setStorename, sellerId]);

  useEffect(() => {
    console.log('📌 [AppLayout] useParams()에서 가져온 storename:', storename);
    console.log('📌 [AppLayout] 전달된 sellerId:', sellerId);
  }, [storename, sellerId]);



  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 메뉴바 (관리자 페이지가 아닐 경우) */}
 
      
      {/* 상단 헤더 영역 (선택적 렌더링) */}


      {/* 메인 콘텐츠 영역 */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AppLayout;
