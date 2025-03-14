import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pages = ['/', '/about', '/contact', '/kakaomap']; // 이동할 페이지 목록

const ScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastNavigateTime = useRef(Date.now());
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleScroll = () => {
    const now = Date.now();
    const timeSinceLastNav = now - lastNavigateTime.current;

    if (timeSinceLastNav > 500) {
      // 0.5초 간격
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= documentHeight - 50) {
        // Add some buffer (50 pixels) to determine if scrolled to the bottom
        navigateToPage(currentPageIndex + 1);
      } else if (scrollY <= 50) {
        // Add some buffer (50 pixels) to determine if scrolled to the top
        navigateToPage(currentPageIndex - 1);
      }
      lastNavigateTime.current = now;
    }
  };

  const navigateToPage = (index) => {
    if (index >= 0 && index < pages.length && location.pathname !== pages[index]) {
      setCurrentPageIndex(index);
      navigate(pages[index]);
    }
  };

  useEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-page-index'), 10);
        if (entry.isIntersecting && index !== currentPageIndex) {
          setCurrentPageIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, { threshold: 0 });

    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => observer.observe(section));

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate, currentPageIndex]);

  return (
    <div className='scroll-triggers'>
      <div className='section' data-page-index='0'></div>
      <div className='section' data-page-index='1'></div>
      <div className='section' data-page-index='2'></div>
      <div className='section' data-page-index='3'></div>
    </div>
  );
};

export default ScrollNavigation;
