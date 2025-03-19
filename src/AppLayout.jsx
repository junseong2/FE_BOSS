import { useEffect } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import Top from './components/layout/Top';
import Top5 from './components/layout/Top5';
import MenuBar from './MenuBar';
import MenuBar5 from './MenuBar5';
import MenuBarNull from './MenuBarNull';

function AppLayout({ 
  headerId, sellerId, sheaderId, menuBarId, navigationId, setStorename, sellerMenubarColor 

}) {
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

  let SelectedTop;
  if (headerId === 2) {
    SelectedTop = Top5;
  } else {
    SelectedTop = Top;
  }
  
  let SelectedMenuBar;
  if (menuBarId === 2) {
    SelectedMenuBar = MenuBar5;
  } else if (menuBarId === 0) {
    SelectedMenuBar = MenuBarNull;
  } else {
    SelectedMenuBar = MenuBar;
  }
  


  
  return (
    <div className='flex'>
      {!isAdminPage && <SelectedMenuBar sellerMenubarColor={sellerMenubarColor} />}

      <div className={`flex-1 ${!isAdminPage}`}>
  {!isAdminPage && <SelectedTop sellerMenubarColor={sellerMenubarColor} storename={storename} />}

  <main className="main page mt-[120px] mb-24">

          <p>이곳에서 {headerId ?? 'N/A'}의 제품을 확인하세요. 
            </p><p>
            
            {headerId === null ? '의도치 않게 이 메시지가 보인다면 App.js에서 라우팅 설정을 확인하세요!' : ''}
            
            </p> {/* ✅ headerId 값 확인 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
