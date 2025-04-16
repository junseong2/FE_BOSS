import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { IoFilterOutline, IoGridOutline, IoListOutline, IoCartOutline, IoSearchOutline } from "react-icons/io5"
import noimage from '../assets/noimage.jpg';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([])
  const [sortOrder, setSortOrder] = useState("asc")
  const [userId, setUserId] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // 그리드/리스트 뷰 모드
  const [isFilterOpen, setIsFilterOpen] = useState(false) // 필터 패널 상태
  const [loading, setLoading] = useState(true) // 로딩 상태
  const [showNotification, setShowNotification] = useState(false) // 알림 상태 관리
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search).get("query") // 쿼리 파라미터 가져오기
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')


  const fetchSearchResults = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/products/search?query=${query}`)
      let filtered = response.data

      // 가격 필터 적용
      const min = minPrice !== '' ? parseInt(minPrice) : 0
      const max = maxPrice !== '' ? parseInt(maxPrice) : Infinity
      filtered = filtered.filter((product) => product.price >= min && product.price <= max)

      setSearchResults(filtered)
    } catch (error) {
      console.error("검색 결과를 불러오는 데 실패했습니다.", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (query) {
      fetchSearchResults()
    }
  }, [query, minPrice, maxPrice])


  // 사용자 정보 요청 (로그인 상태 확인)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/user-info", {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("로그인 정보 조회 실패")
        }

        const data = await response.json()
        setUserId(data.userId)
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error.message)
      }
    }

    fetchUserInfo()
  }, [])

  // 가격 정렬 함수
  const sortProducts = (order) => {
    const sorted = [...searchResults].sort((a, b) => {
      return order === "asc" ? a.price - b.price : b.price - a.price
    })
    setSearchResults(sorted)
    setSortOrder(order)
  }

  // 장바구니 추가 함수
  const addToCart = async (event, productId) => {
    event.stopPropagation() // 상세 페이지 이동 방지

    if (!productId) {
      console.error("❌ productId가 없음! API 요청 중단")
      return
    }
    try {
      console.log(`🛒 장바구니 추가 요청: productId=${productId}`)

      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // JWT 쿠키 자동 전송
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`장바구니 추가 실패: ${errorText}`)
      }

      await response.json()

      // 성공 알림 표시
      setShowNotification(true)

      // 3초 후 알림 숨기기
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    } catch (error) {
      console.error("❌ 장바구니 추가 오류:", error)
    }
  }

  // 필터 토글
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }




  return (
    <div className="min-h-screen bg-gray-100"> {/* 배경을 연하게 조정 */}
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-8 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            "{query}" 검색 결과
          </h1>
          <p className="text-center text-blue-200 text-sm sm:text-base">
            {searchResults.length > 0 ? `${searchResults.length}개의 상품을 찾았습니다` : "검색 결과가 없습니다"}
          </p>
        </div>
      </div>

      {/* 필터 및 정렬 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={toggleFilter}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
            >
              <IoFilterOutline className="mr-1" /> 필터
            </button>
            <div className="flex border-l border-gray-200 pl-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-l-md ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
                aria-label="그리드 보기"
              >
                <IoGridOutline />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-r-md ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
                aria-label="리스트 보기"
              >
                <IoListOutline />
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => sortProducts("asc")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${sortOrder === "asc" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              가격 낮은순
            </button>
            <button
              onClick={() => sortProducts("desc")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${sortOrder === "desc" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              가격 높은순
            </button>
          </div>
        </div>
      </div>

      {/* 필터 패널 (모바일에서는 슬라이드 업) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 z-50 transition-transform duration-300 transform ${isFilterOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">필터</h3>
            <button onClick={toggleFilter} className="text-gray-600 hover:text-gray-800">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* 필터 내용 - 실제 구현은 백엔드 연동에 따라 달라질 수 있음 */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">가격 필터</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="minPrice" className="text-sm font-medium text-gray-600 mb-1 block">
                  최소 가격
                </label>
                <input
                  id="minPrice"
                  type="number"
                  placeholder="₩0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="text-sm font-medium text-gray-600 mb-1 block">
                  최대 가격
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  placeholder="₩999,999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <button
              onClick={() => {
                toggleFilter()
                fetchProducts()
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-md font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              가격 적용하기
            </button>
          </div>

        </div>
      </div>

      {/* 검색 결과 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          // 로딩 상태
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : searchResults.length > 0 ? (
          viewMode === "grid" ? (
            // 그리드 뷰
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => navigate(`/product/${product.productId}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                      <img
                        src={
                          Array.isArray(product.gimage)
                            ? product.gimage[0] || noimage
                            : product.gimage || noimage
                        }
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null // 무한 루프 방지
                          e.target.src = noimage
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => addToCart(e, product.productId)}
                      className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
                      aria-label="장바구니에 추가"
                    >
                      <IoCartOutline className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 h-8 sm:h-10">
                      {product.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm sm:text-base font-bold text-blue-600">
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 리스트 뷰
            <div className="space-y-4">
              {searchResults.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => navigate(`/product/${product.productId}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row"
                >
                  <div className="sm:w-1/4 relative">
                    <div className="aspect-w-16 aspect-h-9 sm:aspect-w-1 sm:aspect-h-1 w-full overflow-hidden bg-gray-100">
                      <img
                        src={
                          Array.isArray(product.gimage)
                            ? product.gimage[0] || noimage
                            : product.gimage || noimage
                        }
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null // 무한 루프 방지
                          e.target.src = noimage
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:w-3/4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between">
                      <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString()}원</p>

                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        {product.expiry_date && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full flex items-center">
                            유통기한: {product.expiry_date}
                          </span>
                        )}
                        <button
                          onClick={(e) => addToCart(e, product.productId)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm"
                        >
                          <IoCartOutline className="mr-1" /> 장바구니
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // 검색 결과가 없는 경우
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-gray-400 text-sm mb-6 max-w-md text-center">
              다른 검색어를 입력하거나 필터를 조정해 보세요. 더 많은 상품을 찾을 수 있을 거예요.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}
      </div>

      {/* 장바구니 추가 알림 */}
      {showNotification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50">
          <IoCartOutline className="mr-2" />
          <span>상품이 장바구니에 추가되었습니다!</span>
        </div>
      )}
    </div>
  )
}

export default SearchPage
