import { useEffect } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import Top from './components/layout/Top';
import Top5 from './components/layout/Top5';
import MenuBar from './MenuBar';
import MenuBar5 from './MenuBar5';
import MenuBarNull from './MenuBarNull';

function AppLayout({ headerId, sellerId, sheaderId, menuBarId, navigationId, setStorename }) {
  const { storename } = useParams();
  const location = useLocation();
  const isAdminPage =
    location.pathname.toLowerCase().startsWith('/seller') ||
    location.pathname.toLowerCase().startsWith('/admin');

  useEffect(() => {
    console.log('📌 [AppLayout] useParams()에서 가져온 storename:', storename);

    console.log('📌 [AppLayout] 전달된 sellerId:', sellerId); // ✅ sellerId 확인
    if (sellerId) {
      setSellerId(sellerId);
    }
    if (storename) {
      setStorename(storename);
    }
  }, [storename, setStorename]);

  const SelectedTop = headerId === 2 ? Top5 : Top;
  const SelectedMenuBar = menuBarId === 2 ? MenuBar5 : menuBarId === 0 ? MenuBarNull : MenuBar;

  return (
    <div className='flex'>
      {!isAdminPage && <SelectedMenuBar />}
      <div className={`flex-1 ${!isAdminPage ? 'ml-60' : ''}`}>
        {!isAdminPage && <SelectedTop />}
        <main className='main page'>
          <p>이곳에서 {headerId ?? 'N/A'}의 제품을 확인하세요.</p> {/* ✅ headerId 값 확인 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
