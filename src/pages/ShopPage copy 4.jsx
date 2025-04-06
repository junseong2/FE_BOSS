import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

import Header from '../components/Header';
import Blank from '../components/Blank';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import MobileHeader from '../components/MobileHeader';
import MobileBanner from '../components/MobileBanner';
import MobileBottomNavigationBar from '../components/MobileBottomNavigationBar';
import MobileGrid from '../components/MobileGrid';
import Text from '../components/Text';
import ImageBox from '../components/ImageBox';

const componentsMap = {
  header: Header,
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

  const containerRef = useRef(null);

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

  const [selectedSettings, setSelectedSettings] = useState([]);

  useEffect(() => {
    const updatedSettings = isMobile ? mobilesettings : settings;
    setSelectedSettings(updatedSettings);
  }, [isMobile, settings, mobilesettings]);

  const mobileBottomNav = selectedSettings.find((s) => s.type === "mobilebottomnavigationbar");

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      document.body.style.minHeight = containerRef.current.scrollHeight + 'px';
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [selectedSettings]);

  return (
    <div className="w-full px-4 min-h-screen pb-32" ref={containerRef}>
      <div className="flex flex-col gap-6">
        {selectedSettings.map((component, index) => {
          const Component = componentsMap[component.type];
          if (!Component || !component.layout) return null;

          const width = component.properties?.size?.web?.width || '100%';
          const height = component.properties?.size?.web?.height || 'auto';

          return (
            <div
              key={component.id || index}
              style={{ width, height, margin: '0 auto', display: 'block' }}
              className="relative"
            >
              <Component
                {...component.properties}
                products={component.type.includes("grid") ? products : undefined}
                storename={component.type === "header" ? storename : undefined}
                style={{ height, width }}
              />
            </div>
          );
        })}
      </div>

      {isMobile && mobileBottomNav && (
        <div className="fixed bottom-0 left-0 w-full z-50">
          <MobileBottomNavigationBar
            backgroundColor={mobileBottomNav.properties.backgroundColor}
            items={mobileBottomNav.properties.items || []}
          />
        </div>
      )}
    </div>
  );
}

export default ShopPage;
