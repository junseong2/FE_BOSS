import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import Header from '../components/Header';
import Header2 from '../components/Header2';
import Blank from '../components/Blank';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import ProductGrid2 from '../components/ProductGrid2';
import MobileHeader from '../components/MobileHeader';
import MobileBanner from '../components/MobileBanner';
import MobileBottomNavigationBar from '../components/MobileBottomNavigationBar';
import MobileGrid from '../components/MobileGrid';
import Text from '../components/Text';
import ImageBox from '../components/ImageBox';
import ColorBox from '../components/ColorBox';
import Footer from '../components/layout/Footer';

const componentsMap = {
  header: Header,
  header2: Header2,
  banner: Banner,
  grid: ProductGrid,
  grid2: ProductGrid2,
  blank: Blank,
  text: Text,
  image: ImageBox,
  colorbox: ColorBox,
  mobileheader: MobileHeader,
  mobilebanner: MobileBanner,
  mobilegrid: MobileGrid,
  mobilebottomnavigationbar: MobileBottomNavigationBar,
};

function ShopPage() {
  const [canvasHeight, setCanvasHeight] = useState(0); 
  const [maxHeight, setMaxHeight] = useState(0);
  const { storename } = useParams();
  const [sellerId, setSellerId] = useState(null);
  const [settings, setSettings] = useState([]);
  const [mobilesettings, setMobileSettings] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [selectedSettings, setSelectedSettings] = useState([]);
  
  // 그리드 설정
  const gridColumns = 8;
  const gridGap = 8;
  
  // containerRef: ResizeObserver 등을 위한 참조
  const containerRef = useRef(null);

  // settings 배열 내 요소들로부터 최대 하단값 계산 (layout.top + height)
  const getMaxHeightFromSettings = (elements) => {
    let computedMaxHeight = 0;
    elements.forEach((el) => {
      // layout이 없으면 기본값 적용
      const { top = 0 } = el.layout || {};
      const heightStr = el.properties?.size?.web?.height;
      let height = 0;
      if (heightStr && typeof heightStr === 'string' && heightStr.endsWith('px')) {
        height = parseInt(heightStr.replace('px', ''), 10);
      }
      computedMaxHeight = Math.max(computedMaxHeight, top + height);
    });
    return computedMaxHeight;
  };

  // ResizeObserver로 container의 높이 갱신
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const containerChildren = Array.from(containerRef.current.children);
        const newMax = containerChildren.reduce((acc, child) => {
          const bottom = child.offsetTop + child.offsetHeight;
          return Math.max(acc, bottom);
        }, 0);
        setMaxHeight(newMax);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // storename으로 sellerId 가져오기
  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/info/${storename}`);
        if (response.data?.sellerId) setSellerId(response.data.sellerId);
      } catch (error) {
        console.error("sellerId 가져오기 실패:", error);
      }
    };
    if (storename) fetchSellerId();
  }, [storename]);

  // settings 변화에 따라 canvasHeight 업데이트 (안전한 기본값 포함)
  useEffect(() => {
    if (settings.length > 0) {
      const estimatedHeight = getMaxHeightFromSettings(settings);
      setCanvasHeight(estimatedHeight);
    }
  }, [settings]);

  // 모든 요소 렌더링 후 container의 하위 요소들로부터 높이 재계산
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const children = Array.from(containerRef.current.children);
        let newMax = 0;
        children.forEach((child) => {
          const offsetTop = child.offsetTop;
          const height = child.offsetHeight;
          newMax = Math.max(newMax, offsetTop + height);
        });
        setMaxHeight(newMax);
      }
    }, 100); // 100ms 후 강제 재계산
    return () => clearTimeout(timer);
  }, [selectedSettings]);

  // sellerId로 settings와 mobilesettings 가져오기
  useEffect(() => {
    if (!sellerId) return;
    const fetchSellerSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`);
        // 백엔드 응답에서 settings만 추출 (canvasHeight 등 부가값은 별도)
        setSettings(response.data.settings || []);
        setMobileSettings(response.data.mobilesettings || []);
      } catch (error) {
        console.error('판매자 settings 불러오기 오류:', error);
      }
    };
    fetchSellerSettings();
  }, [sellerId]);

  // 상품 목록 가져오기
  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading || !sellerId) return;
    setLoading(true);
    try {
      const url = `http://localhost:5000/seller/product?sellerId=${sellerId}&page=${currentPage}&size=8&sort=${sortOrder}`;
      const response = await axios.get(url);
      const data = response.data;
      if (!data.products?.length) {
        setHasMore(false);
        return;
      }
      setProducts((prev) => [...prev, ...data.products]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(data.products.length >= 8);
    } catch (error) {
      console.error('❌ 상품 목록 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [sellerId, currentPage, hasMore, loading, sortOrder]);

  useEffect(() => {
    if (sellerId) {
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchProducts();
    }
  }, [sellerId, sortOrder, fetchProducts]);

  // 모바일 여부에 따라 selectedSettings 업데이트
  useEffect(() => {
    const updatedSettings = isMobile ? mobilesettings : settings;
    setSelectedSettings(updatedSettings);
  }, [isMobile, settings, mobilesettings]);

  // ResizeObserver로 container 높이 업데이트 (추가)
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const children = Array.from(containerRef.current.children);
        let newMax = 0;
        children.forEach(child => {
          const offsetTop = child.offsetTop;
          const height = child.offsetHeight;
          newMax = Math.max(newMax, offsetTop + height);
        });
        setMaxHeight(newMax);
      }
    };
    updateHeight(); // 초기 호출
    const observer = new ResizeObserver(() => updateHeight());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const mobileBottomNav = selectedSettings.find((s) => s.type === "mobilebottomnavigationbar");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 콘텐츠 영역 */}
      <div
        className="relative w-full"
        style={{ minHeight: `${Math.max(canvasHeight + 300, 600)}px` }}
      >
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: `${gridGap}px`,
            padding: '1rem',
            paddingBottom: isMobile ? '70px' : '0px',
          }}
        >
          {/* 1. ColorBox – 배경용 */}
          {selectedSettings
            .filter((component) => component.type === 'colorbox' && component.layout)
            .map((component, index) => {
              const Component = componentsMap[component.type];
              const { top, column, columnSpan } = component.layout;
              const height = component.properties?.size?.web?.height || 'auto';
              return (
                <div
                  key={component.id || `colorbox-${index}`}
                  style={{
                    position: 'absolute',
                    zIndex: 0,
                    top: `${top}px`,
                    left: `${((column - 1) / gridColumns) * 100}%`,
                    width: `${(columnSpan / gridColumns) * 100}%`,
                    height,
                  }}
                >
                  <Component {...component.properties} />
                </div>
              );
            })}

          {/* 2. 헤더류 요소 – 제일 위에 */}
          {selectedSettings
            .filter(
              (component) =>
                ['header', 'header2', 'mobileheader'].includes(component.type) &&
                component.layout
            )
            .map((component, index) => {
              const Component = componentsMap[component.type];
              const { top, column, columnSpan } = component.layout;
              const height = component.properties?.size?.web?.height || 'auto';
              return (
                <div
                  key={component.id || `header-${index}`}
                  style={{
                    position: 'absolute',
                    zIndex: 10,
                    top: `${top}px`,
                    left: `${((column - 1) / gridColumns) * 100}%`,
                    width: `${(columnSpan / gridColumns) * 100}%`,
                    height,
                  }}
                >
                  <Component {...component.properties} sellerId={sellerId} top={top} />
                </div>
              );
            })}

          {/* 3. 일반 요소 – 기본 */}
          {selectedSettings
            .filter(
              (component) =>
                !['colorbox', 'header', 'header2', 'mobileheader'].includes(component.type) &&
                component.layout
            )
            .map((component, index) => {
              const Component = componentsMap[component.type];
              const { top, column, columnSpan } = component.layout;
              const height = component.properties?.size?.web?.height || 'auto';
              // Component가 없거나 layout이 없다면 렌더링하지 않음
              if (!Component) return null;
              return (
                <div
                  key={component.id || `${component.type}-${index}`}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: `${top}px`,
                    left: `${((column - 1) / gridColumns) * 100}%`,
                    width: `${(columnSpan / gridColumns) * 100}%`,
                    height,
                  }}
                >
                  <Component {...component.properties} sellerId={sellerId} top={top} />
                </div>
              );
            })}

          {/* 모바일 하단 네비게이션바 */}
          {isMobile && mobileBottomNav && mobileBottomNav.layout && (
            <div className="fixed bottom-0 left-0 w-full z-50">
              <MobileBottomNavigationBar
                backgroundColor={mobileBottomNav.properties.backgroundColor}
                items={mobileBottomNav.properties.items || []}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer (필요시 추가) */}
      {/* <Footer /> */}
    </div>
  );
}

export default ShopPage;
