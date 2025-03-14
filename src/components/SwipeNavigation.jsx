import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pages = ['/', '/about'];

const SwipeNavigation = () => {
  const navigate = useNavigate();
  const [startX, setStartX] = useState(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!startX) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 50) {
      navigate(pages[1]); // 오른쪽으로 넘기면 다음 페이지
    } else if (diffX < -50) {
      navigate(pages[0]); // 왼쪽으로 넘기면 이전 페이지
    }
    setStartX(null);
  };

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startX]);

  return null;
};

export default SwipeNavigation;
