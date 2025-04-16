import { useParams, Link } from "react-router-dom"
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
  IoGift,
  IoInformationCircle,
  IoStar,
  IoStarHalf,
  IoStarOutline,
} from "react-icons/io5"
import { getProductDetail, getProductDetail2 } from "../../services/product.service"
import { addToCart } from "../../services/cart.service"
import ProductReviewForm from "./components/ProductReviewForm"
import { getReviews } from "../../services/review.service"
import ProductReviewList from "./components/ProductReviewList"
import { ThinRoundedStar } from "@smastrom/react-rating"
import ProductSkeleton from "./components/ProductDetailSkeleton"

const BASE_IMAGE_URL = "http://localhost:5000/uploads" // Spring Boot 서버 URL,차후 배포할때 수정
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`
const PAGE_SIZE = 5

const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "#3b82f6",
  inactiveFillColor: "#f3f4f6",
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
  const [storeInfo, setStoreInfo] = useState(null)

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
      }, 1000)
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
    // 스토어 정보 가져오기
    getProductDetail2(productId)
      .then((data) => {
        console.log("스토어 이름:", data.storename)
        setStoreInfo(data) // 스토어 정보 전체를 저장
      })
      .catch((error) => {
        console.error("스토어 정보 조회 오류:", error)
      })
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
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-500"
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* 상품 상세 정보 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          <div className="flex flex-col md:flex-row">
            {/* 상품 이미지 */}
            <div className="md:w-1/2 p-6 md:p-8 relative">
              <div className="sticky top-8">
                <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.originalPrice && product.originalPrice > product.price
                    ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% 할인`
                    : "인기상품"}
                </div>
                <ProductImageSlider imageList={imageList} />
              </div>
            </div>

            {/* 상품 디테일 */}
            <div className="md:w-1/2 p-6 md:p-8 md:border-l border-blue-100">
              {/* 상품명 및 평점 */}
              <div className="mb-6">
                {storeInfo && storeInfo.storename && (
                  <div className="mb-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-lg p-3 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <IoCheckmarkCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">판매자 스토어</p>
                          <p className="font-medium text-gray-900">{storeInfo.storename}</p>
                        </div>
                      </div>
                      <Link
                        to={`/store/${storeInfo.storename}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        스토어 방문
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product?.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <div className="flex text-blue-500">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = reviewInfo.avgRating || 0
                        return (
                          <span key={star}>
                            {rating >= star ? (
                              <IoStar className="w-5 h-5" />
                            ) : rating >= star - 0.5 ? (
                              <IoStarHalf className="w-5 h-5" />
                            ) : (
                              <IoStarOutline className="w-5 h-5" />
                            )}
                          </span>
                        )
                      })}
                    </div>
                    <span className="ml-2 text-lg font-medium text-gray-900">
                      {reviewInfo.avgRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500">리뷰 {reviewInfo.totalCount || 0}개</span>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="mb-6 pb-6 border-b border-blue-100">
                <div className="flex items-baseline">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through mr-2">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                  <span className="text-3xl font-bold text-blue-600">{product.price?.toLocaleString() || 0}원</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% 할인
                    </span>
                  )}
                </div>

                {/* 배송 정보 */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm">
                    <IoCheckmarkCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      {product.isFreeShipping
                        ? "무료배송"
                        : `배송비 ${(product.shippingFee || 3000).toLocaleString()}원`}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IoTimeOutline className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{product.deliveryTime || "오늘 주문시 내일 도착"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IoGift className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      구매 시 <span className="font-semibold">{Math.round(product.price * 0.01)}</span>포인트 적립
                    </span>
                  </div>
                </div>
              </div>

              {/* 옵션 선택 */}
              {product.hasOptions && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">색상</h3>
                  <div className="flex space-x-3">
                    {["black", "white", "red", "blue"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                            : "border-gray-300 hover:border-gray-400"
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
                    className="w-12 h-12 border border-gray-300 flex items-center justify-center rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={decreaseQuantity}
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <div className="w-16 h-12 border-t border-b border-gray-300 flex items-center justify-center bg-white text-lg font-medium">
                    {quantity}
                  </div>
                  <button
                    className="w-12 h-12 border border-gray-300 flex items-center justify-center rounded-r-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={increaseQuantity}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>

              {/* 총 가격 */}
              <div className="mb-6 pb-6 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">총 상품 금액</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {(product.price * quantity).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 구매 버튼 - 장바구니만 남기고 바로 구매하기 버튼 제거 */}
              <div className="flex">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center transition-colors shadow-lg shadow-blue-100"
                >
                  <IoCartOutline className="mr-2 w-5 h-5" />
                  장바구니 담기
                </button>
              </div>

              {/* 위시리스트 및 공유 버튼 */}
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={toggleWishlist}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors ${
                    isWishlist
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  aria-label="위시리스트에 추가"
                >
                  {isWishlist ? (
                    <>
                      <IoHeartSharp className="w-5 h-5 mr-2" /> 위시리스트에 추가됨
                    </>
                  ) : (
                    <>
                      <IoHeartOutline className="w-5 h-5 mr-2" /> 위시리스트에 추가
                    </>
                  )}
                </button>

                <button
                  className="w-14 h-14 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center border border-gray-200 transition-colors"
                  aria-label="공유하기"
                >
                  <IoShareSocialOutline className="w-5 h-5" />
                </button>
              </div>

              {/* 안내 사항 */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-100">
                <div className="flex items-start">
                  <IoShieldCheckmarkOutline className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-900 mb-1">안전한 쇼핑</p>
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
          <div className="border-t border-blue-100 mt-8">
            <div className="flex border-b border-blue-100">
              {["상세설명", "배송정보", "리뷰"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-5 px-4 text-center font-medium transition-colors ${
                    activeTab === tab ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "리뷰" && reviewInfo.totalCount > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                      {reviewInfo.totalCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {activeTab === "상세설명" && (
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">상품 설명</h3>
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed mb-8">
                    {product.description || "상세 설명이 없습니다."}
                  </p>

                  {/* 상세 이미지 (예시) */}
                  <div className="mt-8 space-y-8">
                    {imageList.slice(0, 10).map((img, index) => (
                      <div key={`detail-${index}`} className="relative overflow-hidden rounded-xl shadow-md group">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${product.name} 상세 이미지 ${index + 1}`}
                          className="w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>

                  {/* 상품 특징 */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <IoCheckmarkCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">품질 보증</h4>
                      <p className="text-gray-600 text-sm">엄격한 품질 관리를 통해 최상의 제품만을 제공합니다.</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <IoTimeOutline className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">빠른 배송</h4>
                      <p className="text-gray-600 text-sm">주문 후 최대한 빠른 시간 내에 상품을 배송해 드립니다.</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <IoShieldCheckmarkOutline className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">안전한 결제</h4>
                      <p className="text-gray-600 text-sm">안전한 결제 시스템으로 개인정보를 철저히 보호합니다.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "배송정보" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">배송 및 환불 정보</h3>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <IoTimeOutline className="w-5 h-5 mr-2 text-blue-600" />
                        배송 안내
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>배송기간: {product.deliveryTime || "2~3일 소요 (주말, 공휴일 제외)"}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>
                            배송비:{" "}
                            {product.isFreeShipping
                              ? "무료배송"
                              : `${(product.shippingFee || 3000).toLocaleString()}원`}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>배송업체: CJ대한통운</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <IoInformationCircle className="w-5 h-5 mr-2 text-blue-600" />
                        교환/반품 안내
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>교환/반품 기간: 상품 수령 후 7일 이내</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>교환/반품 배송비: 단순변심 - 구매자 부담, 상품하자 - 판매자 부담</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>교환/반품 불가 사유: 고객의 사용, 소비에 의해 상품의 가치가 현저히 감소한 경우</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <IoCheckmarkCircle className="w-5 h-5 mr-2 text-blue-600" />
                        판매자 정보
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>판매자: {storeInfo?.storename || product.seller || "쇼핑몰"}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>고객센터: 1234-5678 (평일 09:00 ~ 18:00)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          <span>사업자등록번호: 123-45-67890</span>
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
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">고객 리뷰</h3>
                      <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center mr-6">
                          <div className="flex items-center">
                            <div className="flex text-blue-500">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating = reviewInfo.avgRating || 0
                                return (
                                  <span key={star}>
                                    {rating >= star ? (
                                      <IoStar className="w-5 h-5" />
                                    ) : rating >= star - 0.5 ? (
                                      <IoStarHalf className="w-5 h-5" />
                                    ) : (
                                      <IoStarOutline className="w-5 h-5" />
                                    )}
                                  </span>
                                )
                              })}
                            </div>
                            <span className="ml-2 text-xl font-semibold text-gray-900">
                              {reviewInfo.avgRating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">{reviewInfo.totalCount || 0}</span>개의 리뷰
                        </div>
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
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center z-50 animate-fade-in-up">
          <IoCartOutline className="mr-3 w-5 h-5" />
          <span>상품이 장바구니에 추가되었습니다!</span>
          <button
            className="ml-4 bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            onClick={() => setShowCartNotification(false)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  )
}
