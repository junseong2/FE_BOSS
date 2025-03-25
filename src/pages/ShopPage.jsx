import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import MobileHeader from '../components/MobileHeader';
import MobileBanner from '../components/MobileBanner';
import MobileBottomNavigationBar from '../components/MobileBottomNavigationBar';
import MobileGrid from '../components/MobileGrid';
import { useMediaQuery } from 'react-responsive';

const componentsMap = {
  header: Header,
  banner: Banner,
  grid: ProductGrid,
  mobileheader: MobileHeader,
  mobilebanner: MobileBanner,
  mobilegrid: MobileGrid,
  mobilebottomnavigationbar: MobileBottomNavigationBar,
};
const BASE_IMAGE_URL = "http://localhost:5000";

function ShopPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/info/${storename}`);
        if (response.data && response.data.sellerId) {
          setSellerId(response.data.sellerId);
        }
      } catch (error) {
        console.error("sellerId 가져오기 실패:", error);
      }
    };
    if (storename) {
      fetchSellerId();
    }
  }, [storename]);

  useEffect(() => {
    if (!sellerId) return;
    const fetchSellerSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`);
        setSettings(response.data.settings || []);
        setMobileSettings(response.data.mobilesettings || []);

        console.log("📌 업데이트된 웹Settings:", settings);
        console.log("📌 업데이트된 모바일Settings:", mobilesettings);

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
      const url = `http://localhost:5000/product?sellerId=${sellerId}&page=${currentPage}&size=8&sort=${sortOrder}`;
      const response = await axios.get(url);
      const data = response.data;
  
      if (!data.products || data.products.length === 0) {
        setHasMore(false);
        return;
      }
  
      setProducts((prev) => [...prev, ...data.products]); // 기존 데이터에 추가
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
      setProducts([]); // 기존 상품 초기화
      setCurrentPage(0);
      setHasMore(true);
      fetchProducts();
    }
  }, [sellerId, sortOrder]); // ✅ sellerId가 변경될 때마다 실행
    
  const [selectedSettings, setSelectedSettings] = useState([]);

  useEffect(() => {
    const updatedSettings = isMobile ? mobilesettings : settings;
    setSelectedSettings(updatedSettings);

    console.log("📌 업데이트된 현재 웹Settings:", settings);
    console.log("📌 업데이트된 현재 모바일Settings:", mobilesettings);
    console.log("📌 업데이트된 selectedSettings:", updatedSettings);

  }, [isMobile, settings, mobilesettings]); // isMobile이 변경될 때마다 selectedSettings 업데이트
  
  const mobileBottomNav = selectedSettings.find((s) => s.type === "mobilebottomnavigationbar");
  return (
    <div className="container mx-auto p-4">
      {selectedSettings.map((component) => {
        let Component = componentsMap[component.type];
        

        /*
        // 모바일 환경에서는 모바일 전용 컴포넌트 사용
        if (isMobile && componentsMap[`mobile${component.type}`]) {
          Component = componentsMap[`mobile${component.type}`];
        }
          */

        return Component ? (
          <div key={component.properties.id} className="mb-8">
          <Component {...component.properties} products={component.type.includes("grid") || component.type.includes("mobilegrid") ? products : undefined} />
          </div>
        ) : null;
      })}

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