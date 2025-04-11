"use client"
import { Filter } from "lucide-react"
import React from "react"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../components/Header"

const BASE_IMAGE_URL = "http://localhost:5000/uploads" // Spring Boot 서버 URL, 차후 배포할 때 수정
const pageSize = 9
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`

const getFirstImageUrl = (product) => {
  console.log("상품 정보:", product)

  const gimage = product.gImage || product.gimage || product.g_image || product.g_Image
  if (!gimage) return DEFAULT_IMAGE_PATH
  const imageList = Array.isArray(gimage) ? gimage : gimage.split(",").map((img) => img.trim())
  return `${BASE_IMAGE_URL}/${imageList[0]}`
}

// ✅ 기본 Button 컴포넌트
const Button = ({ children, variant, size, className = "", ...props }) => {
  const baseStyle = "px-4 py-2 border rounded text-sm"
  return (
    <button
      className={`${baseStyle} ${variant === "outline" ? "border-gray-300" : "bg-black text-white"} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// ✅ 기본 Checkbox 컴포넌트
const Checkbox = ({ id, checked, onChange, className = "" }) => {
  return <input id={id} type="checkbox" checked={checked} onChange={onChange} className={`w-4 h-4 ${className}`} />
}

// ✅ Tabs 시스템 구현
const TabsContext = React.createContext()

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
}

const TabsList = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>
}

const TabsTrigger = ({ value, children, className = "" }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`${className} ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
    >
      {children}
    </button>
  )
}

export default function ProductListing() {
  const [showFilter, setShowFilter] = useState(true)
  const { storename } = useParams()
  const [headerSettings, setHeaderSettings] = useState(null)
  const navigate = useNavigate()
  const [sellerId, setSellerId] = useState(null)
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState("recommend") // 기본값 추천순
  const [categoryList, setCategoryList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  // 정렬 옵션 정의
  const sortOptions = [
    { id: "recommend", label: "추천순" },
    { id: "popular", label: "판매순" },
    { id: "low", label: "가격 낮은 순" },
    { id: "high", label: "가격 높은 순" },
    { id: "latest", label: "최신 등록 순" },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/seller/used-categories?sellerId=${sellerId}`)
        setCategoryList(res.data) // [{ id: 1, name: "상의" }, { id: 2, name: "하의" }, ...]
      } catch (err) {
        console.error("❌ 사용된 카테고리 불러오기 실패:", err)
      }
    }

    if (sellerId) {
      fetchCategories()
    }
  }, [sellerId])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setProducts([])
    setCurrentPage(0)
    setHasMore(true)
  }

  useEffect(() => {
    const fetchHeaderSettings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/seller/page-data?seller_id=${sellerId}`)
        const headerComponent = res.data.settings.find((el) => el.type === "header")
        if (headerComponent) {
          setHeaderSettings(headerComponent.properties)
        }
      } catch (error) {
        console.error("❌ 헤더 설정 불러오기 실패:", error)
      }
    }

    if (sellerId) {
      fetchHeaderSettings()
    }
  }, [sellerId])

  useEffect(() => {
    if (sellerId !== null) {
      setProducts([])
      setCurrentPage(0)
      setHasMore(true)
      fetchProducts()
    }
  }, [selectedCategory])

  useEffect(() => {
    if (!sellerId) return
    setProducts([])
    setCurrentPage(0)
    setHasMore(true)
    fetchProducts()
  }, [sortOrder])

  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/info/${storename}`)
        if (response.data?.sellerId) setSellerId(response.data.sellerId)
      } catch (error) {
        console.error("❌ sellerId 가져오기 실패:", error)
      }
    }
    if (storename) fetchSellerId()
  }, [storename])

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore || !sellerId) return

    setLoading(true)
    try {
      const sortParam = sortOrder && sortOrder !== "recommend" ? `&sort=${sortOrder}` : ""
      const categoryParam = selectedCategory ? `&categoryId=${selectedCategory}` : ""
      const response = await axios.get(
        `http://localhost:5000/seller/productslist?sellerId=${sellerId}&page=${currentPage}&size=${pageSize}${sortParam}${categoryParam}`,
      )

      const data = response.data
      console.log("상품 목록 데이터:", data)

      if (data.length === 0) {
        setHasMore(false)
        return
      }

      setProducts((prev) => [...prev, ...data]) // 기존 상품 목록에 새 상품 추가
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      console.error("❌ 상품 불러오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [sellerId, currentPage, hasMore, loading, sortOrder, selectedCategory])

  const handleSortChange = (order) => {
    setSortOrder(order) // 정렬 상태 변경
    setProducts([]) // 기존 상품 초기화
    setCurrentPage(0)
    setHasMore(true)
  }

  useEffect(() => {
    if (sellerId) {
      setProducts([])
      setCurrentPage(0)
      setHasMore(true)
      fetchProducts()
    }
  }, [sellerId])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        fetchProducts()
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [fetchProducts])

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

      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="h-4 w-4" />
            {showFilter ? "필터 닫기" : "필터 열기"}
          </Button>
          <div className="text-sm text-gray-500">{products.length}개 제품</div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar for Categories and Filters */}
          <div className={`transition-all duration-300 ${showFilter ? "md:w-64 w-full" : "w-0 overflow-hidden"}`}>
            <div className="sticky top-4 space-y-8">
              {/* Categories Section */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4 border-b pb-2">카테고리</h3>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer p-2 rounded ${selectedCategory === null ? "bg-black text-white" : "hover:bg-gray-200"}`}
                    onClick={() => handleCategoryChange(null)}
                  >
                    전체
                  </div>
                  {categoryList.map((category) => (
                    <div
                      key={category.id}
                      className={`cursor-pointer p-2 rounded ${selectedCategory === category.id ? "bg-black text-white" : "hover:bg-gray-200"}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options Section */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4 border-b pb-2">정렬</h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-200 rounded"
                    >
                      <input
                        type="radio"
                        name="sortOrder"
                        checked={sortOrder === option.id}
                        onChange={() => handleSortChange(option.id)}
                        className="w-4 h-4"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className={`flex-1 transition-all duration-300 ${!showFilter ? "w-full" : ""}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => navigate(`/product/${product.productId}`)}
                    className="group cursor-pointer p-4 border border-gray-200 rounded-xl bg-white text-center shadow-sm 
                    transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                  >
                    <img
                      src={getFirstImageUrl(product) || "/placeholder.svg"}
                      alt={product.name}
                      onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                    <p className="text-gray-800 mt-1 font-medium">₩{product.price.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">상품이 없습니다.</p>
              )}
            </div>

            {loading && (
              <div className="text-center py-4">
                <p>로딩 중...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
