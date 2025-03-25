import { useState, useEffect } from 'react';

export default function PageLayout() {
  const [settings, setSettings] = useState({ headerColor: "#ffffff", navBarColor: "#ffffff" });

  // 서버에서 설정을 가져오는 함수
  const fetchSettings = async () => {
    try {
      const response = await fetch('/UI/sellers/{sellerId}');  // sellerId를 바꾸세요.
      const data = await response.json();
  
      // ❗ settings가 null일 가능성 방지
      const settingsData = data.settings || {};
  
      const headerColor = settingsData['header-backgroundColor'] || "#ffffff"; // 기본값 추가
      const navBarColor = settingsData['bottomNavigationBar-backgroundColor'] || "#ffffff";
  
      setSettings({ headerColor, navBarColor });
    } catch (error) {
      console.error('설정 정보를 불러오는 데 실패했습니다.', error);
      setSettings({ headerColor: "#ffffff", navBarColor: "#ffffff" }); // 오류 발생 시 기본값 설정
    }
  };
  
  useEffect(() => {
    fetchSettings();
  }, []);  // 처음 렌더링 시 한 번만 호출
  return (
    <div>
      {settings && settings.headerColor && settings.navBarColor ? (
        <>


          {settings.headerColor && (
            <header style={{ backgroundColor: settings.headerColor }}>
              <h1>Header Content</h1>
            </header>
          )}
  
          {settings.navBarColor && (
            <footer style={{ backgroundColor: settings.navBarColor }}>
              <p>Bottom Navigation Bar</p>
            </footer>
          )}
        </>
      ) : (
        <p>설정을 불러오는 중...</p> // ❗ 로딩 메시지 추가 (옵션)
      )}
    </div>
  );
  
}
