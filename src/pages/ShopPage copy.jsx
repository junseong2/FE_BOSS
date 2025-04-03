import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
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

  const gridColumns = 8;
  const gridGap = 8;

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

  return (
    <div className="w-full p-2">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          // gridAutoRows를 제거하여 각 컴포넌트의 height 스타일에 따라 렌더링되도록 함
          gap: `${gridGap}px`,
          alignItems: 'start',
        }}
      >
        {selectedSettings.map((component, index) => {
          const Component = componentsMap[component.type];
          if (!Component || !component.layout) return null;

          const { row, column } = component.layout;
          // size의 height가 있다면 이를 사용하여 높이를 고정합니다.
          const height = component.properties?.size?.web?.height;

          return (
            <div
              key={component.id || index}
              style={{
                gridColumn: `${column}`,
                // gridRow는 레이아웃 위치를 위해 필요하다면 그대로 사용하고,
                // 높이는 명시적으로 size의 height 값으로 설정합니다.
                height: height || 'auto',
              }}
              className="w-full"
            >
              <Component
                {...component.properties}
                products={component.type.includes("grid") ? products : undefined}
                storename={component.type === "header" ? storename : undefined}
                style={{ height: height || 'auto' }}
              />
            </div>
          );
        })}
      </div>

      {isMobile && mobileBottomNav && (
        <MobileBottomNavigationBar
          backgroundColor={mobileBottomNav.properties.backgroundColor}
          items={mobileBottomNav.properties.items || []}
        />
      )}
    </div>
  );
}

export default ShopPage;
