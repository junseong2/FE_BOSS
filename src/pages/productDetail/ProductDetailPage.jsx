import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import ProductImageSlider from "./components/ProductImageSlider"
import {
  IoCartOutline,
  IoHeartOutline,
  IoHeartSharp,
  IoShareSocialOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoShieldCheckmarkOutline,
  IoArrowForward,
} from "react-icons/io5"
import { getProductDetail } from "../../services/product.service"
import { addToCart } from "../../services/cart.service"
import ProductReviewForm from "./components/ProductReviewForm"
import { getReviews } from "../../services/review.service"
import ProductReviewList from "./components/ProductReviewList"
import { Rating, ThinRoundedStar } from "@smastrom/react-rating"
import ProductSkeleton from "./components/ProductDetailSkeleton"

const BASE_IMAGE_URL = "http://localhost:5000/uploads" // Spring Boot 서버 URL,차후 배포할때 수정
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`
const PAGE_SIZE = 5

const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#f5f5f5",
  inactiveBoxBorderColor: "#e5e7eb",
}

export default function ProductDetailPage() {
  const { productId } = useParams()
  const [loadingState, setLoadingState] = useState({
    productDetail: true,
    review: true,
  })
  const [product, setProduct] = useState(null)
  const [reviewInfo, setReviewInfo] = useState({
    reviews: [],
    totalCount: 0,
    avgRating: 0,
  })
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("상세설명")
  const [selectedColor, setSelectedColor] = useState("black")
  const [page, setPage] = useState(0)
  const [isAddReview, setIsAddReview] = useState(false)
  const [isWishlist, setIsWishlist] = useState(false)
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [openReviewForm, setOpenReviewForm] = useState(false)

  /** 상품 개수 증감 */
  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  /** 장바구니 추가 */
  const handleAddToCart = async (event) => {
    event.preventDefault()
    if (!product) return alert("상품을 추가해주세요.")

    try {
      await addToCart({ productId: product.productId, quantity })

      // 장바구니 추가 알림 표시
      setShowCartNotification(true)

      // 3초 후 알림 숨기기
      setTimeout(() => {
        setShowCartNotification(false)
      }, 3000)
    } catch (error) {
      console.error("장바구니 추가 오류:", error)
      alert("장바구니 추가에 실패했습니다.")
    }
  }

  /** 위시리스트 토글 */
  const toggleWishlist = () => {
    setIsWishlist(!isWishlist)
    // 실제 구현에서는 여기에 백엔드 API 호출이 들어갈 것입니다
  }

  /** 상품 이미지  */
  let imageList = [DEFAULT_IMAGE_PATH]

  if (product?.gimage) {
    if (typeof product.gimage === "string") {
      imageList = product.gimage
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img !== "")
        .map((img) => `${img}`) // 상대 경로 유지
    } else if (Array.isArray(product.gimage)) {
      imageList = product.gimage
        .map((img) => img.trim())
        .filter((img) => img !== "")
        .map((img) => `${img}`)
    }
  }

  if (imageList.length === 0) {
    imageList = [
      "https://picsum.photos/768/512",
      "https://picsum.photos/768/512",
      "https://picsum.photos/768/512",
      "https://picsum.photos/768/512",
      "https://picsum.photos/768/512",
      "https://picsum.photos/768/512",
    ] // 이미지가 없을 경우 기본 이미지
  }

  // 상품 상세 조회
  const getProductDetailFetch = async (productId) => {
    setLoadingState((prev) => ({
      ...prev,
      productDetail: true,
    }))
    try {
      const data = await getProductDetail(productId)
      setProduct(data)
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        productDetail: false,
      }))
    }
  }

  // 리뷰 조회
  const getReviewFetch = async (productId) => {
    setLoadingState((prev) => ({
      ...prev,
      review: true,
    }))

    try {
      const data = await getReviews({
        sortby: "desc",
        page: page,
        size: PAGE_SIZE,
        productId,
      })

      setReviewInfo(data)
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        review: false,
      }))
    }
  }

  useEffect(() => {
    getProductDetailFetch(productId)
  }, [productId])

  useEffect(() => {
    getReviewFetch(productId)
  }, [productId, isAddReview])

  // 로딩 중일 때 스켈레톤 표시
  if (loadingState.productDetail) {
    return <ProductSkeleton />
  }

  // product가 없을 경우에는 오류 메시지 표시
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">상품을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">요청하신 상품 정보를 불러올 수 없습니다. 다시 시도해주세요.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 배경 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-gray-700">
                  홈
                </a>
              </li>
              <li className="flex items-center">
                <IoArrowForward className="w-3 h-3 mx-1" />
                <a href="/category" className="hover:text-gray-700">
                  카테고리
                </a>
              </li>
              <li className="flex items-center">
                <IoArrowForward className="w-3 h-3 mx-1" />
                <span className="text-gray-900 font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* 상품 상세 정보 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* 상품 이미지 */}
            <div className="md:w-1/2 p-6">
              <ProductImageSlider imageList={imageList} />
            </div>

            {/* 상품 디테일 */}
            <div className="md:w-1/2 p-6 md:border-l border-gray-100">
              {/* 상품명 및 평점 */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Rating
                      isDisabled
                      style={{ maxWidth: 120, cursor: "default" }}
                      halfFillMode="svg"
                      itemStyles={myStyles}
                      highlightOnlySelected={false}
                      value={reviewInfo.avgRating || 0}
                    />
                    <span className="ml-2 text-lg font-medium text-gray-900">
                      {reviewInfo.avgRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500">리뷰 {reviewInfo.totalCount || 0}개</span>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{product.price?.toLocaleString() || 0}원</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>

                {/* 배송 정보 */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <IoCheckmarkCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">
                      {product.isFreeShipping
                        ? "무료배송"
                        : `배송비 ${(product.shippingFee || 3000).toLocaleString()}원`}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IoTimeOutline className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">{product.deliveryTime || "오늘 주문시 내일 도착"}</span>
                  </div>
                </div>
              </div>

              {/* 옵션 선택 */}
              {product.hasOptions && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">색상</h3>
                  <div className="flex space-x-2">
                    {["black", "white", "red", "blue"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`${color} 색상`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 수량 선택 */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">수량</h3>
                <div className="flex">
                  <button
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={decreaseQuantity}
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <div className="w-14 h-10 border-t border-b border-gray-300 flex items-center justify-center bg-white">
                    {quantity}
                  </div>
                  <button
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={increaseQuantity}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>

              {/* 총 가격 */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">총 상품 금액</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {(product.price * quantity).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 구매 버튼 */}
              <div className="flex space-x-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors"
                >
                  <IoCartOutline className="mr-2 w-5 h-5" />
                  장바구니
                </button>


                <button
                  onClick={toggleWishlist}
                  className={`w-12 h-12 rounded-md flex items-center justify-center transition-colors ${
                    isWishlist
                      ? "bg-red-50 text-red-500 border border-red-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                  }`}
                  aria-label="위시리스트에 추가"
                >
                  {isWishlist ? <IoHeartSharp className="w-5 h-5" /> : <IoHeartOutline className="w-5 h-5" />}
                </button>

                <button
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-md flex items-center justify-center border border-gray-200 transition-colors"
                  aria-label="공유하기"
                >
                  <IoShareSocialOutline className="w-5 h-5" />
                </button>
              </div>

              {/* 안내 사항 */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <IoShieldCheckmarkOutline className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">안전한 쇼핑</p>
                    <p>
                      본 상품은 100% 정품이며, 30일 이내 환불 가능합니다. 구매 후 문제가 있으실 경우 고객센터로
                      문의해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 상품 탭 메뉴 */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              {["상세설명", "배송정보", "리뷰"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                    activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "상세설명" && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-4">상품 설명</h3>
                  <p className="whitespace-pre-line">{product.description || "상세 설명이 없습니다."}</p>

                  {/* 상세 이미지 (예시) */}
                  <div className="mt-8 space-y-6">
                    {imageList.slice(0, 2).map((img, index) => (
                      <img
                        key={`detail-${index}`}
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} 상세 이미지 ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "배송정보" && (
                <div>
                  <h3 className="text-xl font-bold mb-4">배송 및 환불 정보</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">배송 안내</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                          <span>배송기간: {product.deliveryTime || "2~3일 소요 (주말, 공휴일 제외)"}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                          <span>
                            배송비:{" "}
                            {product.isFreeShipping
                              ? "무료배송"
                              : `${(product.shippingFee || 3000).toLocaleString()}원`}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">교환/반품 안내</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                          <span>교환/반품 기간: 상품 수령 후 7일 이내</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                          <span>교환/반품 배송비: 단순변심 - 구매자 부담, 상품하자 - 판매자 부담</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">판매자 정보</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                          <span>판매자: {product.seller || "쇼핑몰"}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                          <span>고객센터: 1234-5678 (평일 09:00 ~ 18:00)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "리뷰" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold mb-2">고객 리뷰</h3>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <Rating
                            isDisabled
                            style={{ maxWidth: 120, cursor: "default" }}
                            halfFillMode="svg"
                            itemStyles={myStyles}
                            highlightOnlySelected={false}
                            value={reviewInfo.avgRating || 0}
                          />
                          <span className="ml-2 text-lg font-medium">{reviewInfo.avgRating?.toFixed(1) || "0.0"}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-gray-500">{reviewInfo.totalCount || 0}개의 리뷰</span>
                      </div>
                    </div>

                  </div>

                  <ProductReviewForm
                    productId={productId}
                    renderTrigger={setIsAddReview}
                    open={openReviewForm}
                    setOpen={setOpenReviewForm}
                  />
                  <ProductReviewList reviews={reviewInfo?.reviews || []} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 장바구니 추가 알림 */}
      {showCartNotification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-up">
          <IoCartOutline className="mr-2 w-5 h-5" />
          <span>상품이 장바구니에 추가되었습니다!</span>
        </div>
      )}
    </div>
  )
}

