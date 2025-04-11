"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const BASE_IMAGE_URL = "http://localhost:5000/uploads"
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`

const ProductGrid2 = ({ sellerId = null, title = "인기 상품", onAddToCart = () => {} }) => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [sortType, setSortType] = useState("daily")
  const navigate = useNavigate()

  const pageSize = 9

  const fetchPopularProducts = async (type) => {
    try {
      const url = sellerId
        ? `${import.meta.env.VITE_BACKEND_URL}/seller/products/popular?sellerId=${sellerId}&sortBy=${type}`
        : `${import.meta.env.VITE_BACKEND_URL}/products/popular?sortBy=${type}`

      const res = await axios.get(url)
      setProducts(res.data)
      setCurrentPage(0) // 정렬 변경 시 페이지 초기화
    } catch (err) {
      console.error("🔥 인기 상품 불러오기 실패:", err)
    }
  }

  useEffect(() => {
    fetchPopularProducts(sortType)
  }, [sortType, sellerId])

  const getFirstImageUrl = (gimage) => {
    if (!gimage) return DEFAULT_IMAGE_PATH
    const imageName = gimage.includes(",") ? gimage.split(",")[0] : gimage
    return `${BASE_IMAGE_URL}/${imageName}`
  }

  const getSortLabel = (type) => {
    switch (type) {
      case "daily":
        return "일간"
      case "weekly":
        return "주간"
      case "monthly":
        return "월간"
      case "all":
        return "전체"
      default:
        return type
    }
  }

  const paginatedProducts = products.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  )

  return (
    <section className="w-full py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

        {/* 정렬 버튼 */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-4 w-full max-w-md gap-1 bg-gray-100 p-1 rounded-md">
            {["daily", "weekly", "monthly", "all"].map((type) => (
              <button
                key={type}
                onClick={() => setSortType(type)}
                className={`py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  sortType === type ? "bg-orange-500 text-white" : "bg-transparent hover:bg-gray-200"
                }`}
              >
                {getSortLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.productId}
              className="rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div
                className="cursor-pointer h-48 overflow-hidden"
                onClick={() => {
                  navigate(`/product/${product.productId}`)
                  window.scrollTo({ top: 0 })
                }}
              >
                <img
                  src={getFirstImageUrl(product.gImage || product.gimage)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
                />
              </div>
              <div className="p-4">
                <h3
                  className="font-medium text-lg mb-2 line-clamp-2 h-14 cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${product.productId}`)
                    window.scrollTo({ top: 0 })
                  }}
                >
                  {product.name}
                </h3>
              </div>
              <div className="p-4 pt-0 flex justify-end">
              <button
  onClick={(e) => {
    e.stopPropagation();
    onAddToCart(e, product.productId);
  }}
  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors flex items-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
  장바구니 담기
</button>

              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 버튼 */}
        <div className="flex justify-center mt-10 gap-4">
          {currentPage > 0 && (
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              이전
            </button>
          )}
          {(currentPage + 1) * pageSize < products.length && (
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid2
