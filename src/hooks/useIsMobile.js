import { useState, useEffect } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent), // 모바일 기기 체크
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent), // 브라우저 크기 조정과 무관하게 모바일 감지
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useIsMobile;
