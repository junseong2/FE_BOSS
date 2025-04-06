import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import Header from '../components/Header';
import Header2 from '../components/Header2';
import Blank from '../components/Blank';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import MobileHeader from '../components/MobileHeader';
import MobileBanner from '../components/MobileBanner';
import MobileBottomNavigationBar from '../components/MobileBottomNavigationBar';
import MobileGrid from '../components/MobileGrid';
import Text from '../components/Text';
import ImageBox from '../components/ImageBox';
import Footer from '../components/layout/Footer';

const componentsMap = {
  header: Header,
  header2: Header2,
  banner: Banner,
  grid: ProductGrid,
  blank: Blank,
  text: Text,
  image: ImageBox,
  mobileheader: MobileHeader,
  mobilebanner: MobileBanner,
  mobilegrid: MobileGrid,
  mobilebottomnavigationbar: MobileBottomNavigationBar,
};

function ShopPage() {

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

  // 총 그리드 열 수와 gap 설정 (예: 8열)
  const gridColumns = 8;
  const gridGap = 8;

  const containerRef = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const containerChildren = Array.from(containerRef.current.children);
        const max = containerChildren.reduce((acc, child) => {
          const bottom = child.offsetTop + child.offsetHeight;
          return Math.max(acc, bottom);
        }, 0);
        setMaxHeight(max);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);
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
  useEffect(() => {
    // 모든 요소 렌더링 이후 height 재계산 보장
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const children = Array.from(containerRef.current.children);
        let max = 0;
  
        children.forEach((child) => {
          const offsetTop = child.offsetTop;
          const height = child.offsetHeight;
          max = Math.max(max, offsetTop + height);
        });
  
        setMaxHeight(max);
      }
    }, 100); // 100ms 정도 뒤에 강제 재계산
  
    return () => clearTimeout(timer);
  }, [selectedSettings]);
  
  useEffect(() => {
    if (!sellerId) return;
    const fetchSellerSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`);
        setSettings(response.data.settings || []);
        setMobileSettings(response.data.mobilesettings || []);
      } catch (error) {
        console.error('판매자 settings 불러오기 오류:', error);
      }
    };
    fetchSellerSettings();
  }, [sellerId]);

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
  }, [sellerId, sortOrder]);
  useEffect(() => {
    const updatedSettings = isMobile ? mobilesettings : settings;
    setSelectedSettings(updatedSettings);
  }, [isMobile, settings, mobilesettings]);
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const children = Array.from(containerRef.current.children);
        let max = 0;
  
        children.forEach(child => {
          const rect = child.getBoundingClientRect();
          const offsetTop = child.offsetTop;
          const height = child.offsetHeight;
          max = Math.max(max, offsetTop + height);
        });
  
        setMaxHeight(max);
      }
    };
  
    updateHeight(); // 초기 호출
  
    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(containerRef.current);
  
    return () => {
      observer.disconnect();
    };
  }, []);
  const mobileBottomNav = selectedSettings.find((s) => s.type === "mobilebottomnavigationbar");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 콘텐츠 영역 */}
      <div
  className="relative w-full"
  style={{ minHeight: `${Math.max(maxHeight + 300, 600)}px` }}
>

        <div
          ref={containerRef}
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: `repeat(8, 1fr)`,
            gap: '8px',
            padding: '1rem',
            paddingBottom: isMobile ? '70px' : '0px',
          }}
        >
          {selectedSettings.map((component, index) => {
            const Component = componentsMap[component.type];
            if (!Component || !component.layout) return null;
  
            const height = component.properties?.size?.web?.height || 'auto';
  
            return (
              <div
                key={component.id || index}
                style={{
                  position: 'absolute',
                  top: `${component.layout.top}px`,
                  left: `${((component.layout.column - 1) / 8) * 100}%`,
                  width: `${(component.layout.columnSpan / 8) * 100}%`,
                  height,
                }}
              >
<Component {...component.properties} sellerId={sellerId} top={component.layout.top} />
</div>
            );
          })}
  
          {isMobile && mobileBottomNav && (
            <div className="fixed bottom-0 left-0 w-full z-50">
              <MobileBottomNavigationBar
                backgroundColor={mobileBottomNav.properties.backgroundColor}
                items={mobileBottomNav.properties.items || []}
              />
            </div>
          )}
        </div>
      </div>
  
      {/* Footer 항상 아래에 */}
   
    </div>
  );
  
  
}

export default ShopPage;
