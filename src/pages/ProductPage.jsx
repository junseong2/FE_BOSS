import { Link } from "react-router-dom";
import { Filter, Search, ShoppingBag, User, X } from "lucide-react";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";



const BASE_IMAGE_URL = 'http://localhost:5000/uploads'; // Spring Boot 서버 URL, 차후 배포할 때 수정
const pageSize = 9;
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;


const getFirstImageUrl = (gimage) => {
  if (!gimage) return "/default-product.jpg";
  const imageList = Array.isArray(gimage) ? gimage : gimage.split(",").map(img => img.trim());
  return `${BASE_IMAGE_URL}/${imageList[0]}`;
};


// ✅ 기본 Button 컴포넌트
const Button = ({ children, variant, size, className = "", ...props }) => {
  const baseStyle = "px-4 py-2 border rounded text-sm";
  return (
    <button
      className={`${baseStyle} ${variant === "outline" ? "border-gray-300" : "bg-black text-white"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ 기본 Checkbox 컴포넌트
const Checkbox = ({ id, checked, onChange, className = "" }) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`w-4 h-4 ${className}`}
    />
  );
};

// ✅ Tabs 시스템 구현
const TabsContext = React.createContext();

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

const TabsTrigger = ({ value, children, className = "" }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`${className} ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
    >
      {children}
    </button>
  );
};
export default function ProductListing() {

  const [showFilter, setShowFilter] = useState(true);

const { storename } = useParams();
const [headerSettings, setHeaderSettings] = useState(null);

const navigate = useNavigate();

const [sellerId, setSellerId] = useState(null);
const [products, setProducts] = useState([]);
const [currentPage, setCurrentPage] = useState(0);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [sortOrder, setSortOrder] = useState('recommend'); // 기본값 추천순

const [categoryList, setCategoryList] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/seller/used-categories?sellerId=${sellerId}`);
      setCategoryList(res.data); // [{ id: 1, name: "상의" }, { id: 2, name: "하의" }, ...]
    } catch (err) {
      console.error("❌ 사용된 카테고리 불러오기 실패:", err);
    }
  };

  if (sellerId) {
    fetchCategories();
  }
}, [sellerId]);

const handleCategoryChange = (categoryId) => {
  setSelectedCategory(categoryId);
  setProducts([]);
  setCurrentPage(0);
  setHasMore(true);
};


useEffect(() => {
  const fetchHeaderSettings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`);
      const headerComponent = res.data.settings.find((el) => el.type === "header");
      if (headerComponent) {
        setHeaderSettings(headerComponent.properties);
      }
    } catch (error) {
      console.error("❌ 헤더 설정 불러오기 실패:", error);
    }
  };

  if (sellerId) {
    fetchHeaderSettings();
  }
}, [sellerId]);
useEffect(() => {
  if (sellerId !== null) {
    setProducts([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchProducts();
  }
}, [selectedCategory]);

useEffect(() => {
    if (!sellerId) return;
    setProducts([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchProducts();
  }, [sortOrder]);
useEffect(() => {
    const fetchSellerId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/info/${storename}`);
        if (response.data?.sellerId) setSellerId(response.data.sellerId);
      } catch (error) {
        console.error("❌ sellerId 가져오기 실패:", error);
      }
    };
    if (storename) fetchSellerId();
  }, [storename]);
  
  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading || !sellerId) return;
    setLoading(true);
    try {
      const sortParam = sortOrder && sortOrder !== 'recommend' ? `&sort=${sortOrder}` : '';
      const categoryParam = selectedCategory ? `&categoryId=${selectedCategory}` : '';
const response = await axios.get(
  `http://localhost:5000/seller/products?sellerId=${sellerId}&page=${currentPage}&size=${pageSize}${sortParam}${categoryParam}`
);
      const data = response.data;
      if (!data.products || data.products.length === 0) {
        setHasMore(false);
        return;
      }
      setProducts((prev) => [...prev, ...data.products]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("❌ 상품 불러오기 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [sellerId, currentPage, hasMore, loading, sortOrder, selectedCategory]);
  const handleSortChange = (order) => {
    setSortOrder(order); // 정렬 상태 변경
    setProducts([]);      // 기존 상품 초기화
    setCurrentPage(0);
    setHasMore(true);
  };
  
  useEffect(() => {
    if (sellerId) {
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchProducts();
    }
  }, [sellerId]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        fetchProducts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchProducts]);
  
  return (
    <div className="min-h-screen bg-white">
      {headerSettings && (
  <Header
    backgroundColor={headerSettings.backgroundColor}
    logoUrl={headerSettings.logoUrl}
    menuItems={headerSettings.menuItems}
    fontFamily={headerSettings.fontFamily}
    fontSize={headerSettings.fontSize}
    fontWeight={headerSettings.fontWeight}
    storename={storename}
  />
)}
{categoryList.length > 0 && (
  <div className="container mx-auto px-4 py-2">
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => handleCategoryChange(null)}
      >
        전체
      </Button>
      {categoryList.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  </div>
)}

      {/* Header */}
{/* 

 
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm">
          <Link href="/" className="text-gray-500 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="#" className="text-gray-500 hover:underline">
            남성 컬렉션
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">남성 의류</span>
        </div>
      </div>

   
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">남성 의류</h1>
        <p className="mt-4 text-gray-600 max-w-3xl">
          친환경 소재와 편안한 핏으로 완성된 올버즈 의류 라인업. 자연과 사람을 함께 생각한 디자인으로 스타일리시한
          일상을 만들어줍니다.
        </p>
      </div>

      <div className="container mx-auto px-4 border-b border-gray-200">
        <Tabs defaultValue="의류" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-transparent h-auto">
            <TabsTrigger
              value="의류"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none h-10"
            >
              의류
              <X className="ml-1 h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger
              value="상의"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none h-10"
            >
              상의
            </TabsTrigger>
            <TabsTrigger
              value="하의"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none h-10"
            >
              하의
            </TabsTrigger>
            <TabsTrigger
              value="속옷"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none h-10"
            >
              속옷
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

    
      <div className="container mx-auto px-4 py-4 border-b border-gray-200">
        <div className="flex justify-end">
          <Tabs defaultValue="남성" className="w-full max-w-[200px]">
            <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto">
              <TabsTrigger
                value="남성"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none h-10"
              >
                남성
              </TabsTrigger>
              <TabsTrigger
                value="여성"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none h-10"
              >
                여성
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>




      */}
      {/* Filter Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
        <Button
  variant="outline"
  className="flex items-center gap-2 border-gray-300"
  onClick={() => setShowFilter(!showFilter)}
>
  <Filter className="h-4 w-4" />
  {showFilter ? '필터 닫기' : '필터 열기'}
</Button>
          <div className="text-sm text-gray-500">
  {products.length}개 제품
</div>        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-0 py-6">
      <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}


          


            <div className="space-y-8">

            {showFilter && (
              <div
  className={`transition-all duration-300 ease-in-out overflow-hidden ${
    showFilter ? 'md:w-64 w-full opacity-100 max-h-[1000px]' : 'w-0 opacity-0 max-h-0'
  }`}
>

              {/* Color Filter */}
              <div className="space-y-2">
  <label className="flex items-center space-x-2">
    <Checkbox id="sort-recommend" className="rounded-sm" checked={sortOrder === 'recommend'} 
     
    onChange={() => handleSortChange('default')}

    />
    <span>추천순</span>
  </label>
  <label className="flex items-center space-x-2">
    <Checkbox id="sort-popular" className="rounded-sm" checked={sortOrder === 'popular'} onChange={() => handleSortChange('popular')} />
    <span>판매순</span>
  </label>
  <label className="flex items-center space-x-2">
    <Checkbox id="sort-low" className="rounded-sm" checked={sortOrder === 'low'} onChange={() => handleSortChange('low')} />
    <span>가격 낮은 순</span>
  </label>
  <label className="flex items-center space-x-2">
    <Checkbox id="sort-high" className="rounded-sm" checked={sortOrder === 'high'} onChange={() => handleSortChange('high')} />
    <span>가격 높은 순</span>
  </label>
  <label className="flex items-center space-x-2">
    <Checkbox id="sort-latest" className="rounded-sm" checked={sortOrder === 'latest'} onChange={() => handleSortChange('latest')} />
    <span>최신 등록 순</span>
  </label>
</div>

</div>
)}


            </div>
         


<div className={`flex-1 transition-all duration-300 ${!showFilter ? 'w-full' : ''}`}>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {products.length > 0 ? (
      products.map((product) => (
        <div
          key={product.productId}
          onClick={() => navigate(`/product/${product.productId}`)}
          className="group cursor-pointer p-4 border border-gray-200 rounded-xl bg-white text-center shadow-sm 
                     transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-transform duration-300"
        >
          <img
            src={getFirstImageUrl(product.gimage) || DEFAULT_IMAGE_PATH}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
            className="w-full h-60 object-cover rounded-lg"
          />
          <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
          <p className="text-gray-800 mt-1 font-medium">₩{product.price.toLocaleString()}</p>
        </div>
      ))
    ) : (
      <p className="col-span-full text-center text-gray-500">상품이 없습니다.</p>
    )}
  </div>
</div>





        </div>
      </div>
    </div>
  )
}

