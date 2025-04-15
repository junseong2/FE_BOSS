import { useEffect, useState } from "react"
import { createSellerReviewAnswer, getSellerReviews } from "../../services/review.service"
import { Rating } from "@smastrom/react-rating"
import Pagination from "../../components/Pagination"
import TimeAgo from "react-timeago"
import SellerRatingFilterModal from "./components/pages/SellerRatingFilterModal"
import { MessageSquare, Clock, Package, User, CheckCircle, Send } from "lucide-react"

const PAGE_SIZE = 10

export default function SellerReviewPage() {
  const [activeTab, setActiveTab] = useState(null)
  const [loading, setLoading] = useState(false)
  const [renderTrigger, setRenderTrigger] = useState(false)
  const [answerLoading, setAnswerLoading] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState(0)
  const [selectedRating, setSelectedRating] = useState()

  const [page, setPage] = useState(0)
  const [reviews, setReviews] = useState([]) // 리뷰 목록
  const [totalCount, setTotalCount] = useState(0)

  // 별점 필터링
  const handleRatingFiltering = (rating) => {
    console.log(rating)
    setSelectedRating(rating)
  }

  // 리뷰 목록 페치
  const getReviewsFetch = async () => {
    try {
      setLoading(true)

      const data = await getSellerReviews({
        page,
        size: PAGE_SIZE,
        sortby: "desc",
        isAnswered: activeTab,
        rating: selectedRating,
      })

      setReviews(data.reviews || [])
      setTotalCount(data.totalCount || 1)
    } finally {
      setLoading(false)
    }
  }

  // 리뷰 답변
  const handleSubmit = async (e, reviewId) => {
    setAnswerLoading(true)
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const answer = formData.get("answer").toString() || ""

    const data = {
      answerText: answer,
    }

    try {
      const isSuccess = await createSellerReviewAnswer(reviewId, data)
      setRenderTrigger(isSuccess)
    } finally {
      setAnswerLoading(false)
    }
  }

  useEffect(() => {
    getReviewsFetch()
  }, [page, renderTrigger, activeTab, selectedRating])

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="w-full mx-auto px-6 py-6">
        {/* 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="mr-2 text-gray-600 w-6 h-6" />
                리뷰 관리
              </h2>
              <p className="text-gray-500 mt-1">고객 리뷰를 관리하고 응답하세요.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">총 리뷰:</span>
                <span className="font-semibold text-gray-700">{totalCount}개</span>
              </div>
              <div className="relative">
                {/* 필터 모달 */}
                <SellerRatingFilterModal onFilter={handleRatingFiltering} />
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === null
                    ? "border-b-2 border-gray-600 text-gray-800 bg-gray-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(null)}
              >
                <MessageSquare className="w-4 h-4" />
                전체 리뷰
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === false
                    ? "border-b-2 border-gray-600 text-gray-800 bg-gray-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(false)}
              >
                <Clock className="w-4 h-4" />
                미응답 리뷰
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === true
                    ? "border-b-2 border-gray-600 text-gray-800 bg-gray-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(true)}
              >
                <CheckCircle className="w-4 h-4" />
                응답 완료
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {!loading ? (
              reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.reviewId} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h3 className="font-medium text-gray-800">{review.username}</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <TimeAgo date={review.createdAt} />
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              <Rating value={review.rating} style={{ width: 130, cursor: "default" }} isDisabled />
                            </div>
                            <span
                              className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1 ${
                                review.isAnswered ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {review.isAnswered ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  응답 완료
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  미응답
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex gap-4 mb-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                              <Package className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1 text-gray-800">{review.productName}</h4>
                              <p className="text-gray-700">{review.reviewText}</p>
                            </div>
                          </div>

                          {review?.reviewAnswer && (
                            <div className="ml-6 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center">
                                <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  판매자 답변 (<TimeAgo date={review.reviewAnswer.createdAt} />)
                                </p>
                              </div>
                              <p className="mt-2 text-gray-700">{review.reviewAnswer.answerText}</p>
                            </div>
                          )}

                          <div className="mt-4">
                            {selectedReviewId === review.reviewId ? (
                              <form
                                onSubmit={(e) => {
                                  handleSubmit(e, review.reviewId)
                                }}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                              >
                                <textarea
                                  name="answer"
                                  className="rounded-lg w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                  rows="3"
                                  placeholder="고객의 리뷰에 답변을 남겨주세요..."
                                ></textarea>
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    className="cursor-pointer rounded-lg px-4 py-2 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                                    onClick={() => setSelectedReviewId(0)}
                                  >
                                    취소
                                  </button>
                                  <button
                                    type="submit"
                                    className="cursor-pointer rounded-lg px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                                    disabled={answerLoading}
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    답변 등록
                                  </button>
                                </div>
                              </form>
                            ) : !review.isAnswered ? (
                              <button
                                className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setSelectedReviewId(review.reviewId)}
                              >
                                <MessageSquare className="w-4 h-4" />
                                답변 작성하기
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">선택한 필터에 해당하는 리뷰가 없습니다.</p>
                    <button
                      onClick={() => {
                        setActiveTab(null)
                        setSelectedRating(undefined)
                      }}
                      className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      모든 리뷰 보기
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="p-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-500">리뷰를 불러오는 중입니다...</p>
                </div>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {reviews.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <Pagination
                handlePageClick={({ selected }) => setPage(selected)}
                totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
