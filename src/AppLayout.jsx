import { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';


function AppLayout({
  sellerId,
  setSellerId,
  setStorename,
}) {
  const { storename } = useParams();

  useEffect(() => {
    console.log('📌 [AppLayout] useParams()에서 가져온 storename:', storename);
    if (sellerId) {
      setSellerId(sellerId);
    }
    if (storename) {
      setStorename(storename);
    }
  }, [storename, setStorename, sellerId]);


  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 메뉴바 (관리자 페이지가 아닐 경우) */}
 
      
      {/* 상단 헤더 영역 (선택적 렌더링) */}


      {/* 메인 콘텐츠 영역 */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
       {/* <Footer />*/}
    </div>
  );
}

export default AppLayout;
