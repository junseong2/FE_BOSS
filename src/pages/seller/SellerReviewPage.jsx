import { useEffect, useState } from 'react';
import {
  createSellerReviewAnswer,
  deleteSellerReviewAnswer,
  getSellerReviews,
  updateSellerReviewAnswer,
} from '../../services/review.service';
import Pagination from '../../components/Pagination';
import SellerRatingFilterModal from './components/pages/SellerRatingFilterModal';
import { MessageSquare } from 'lucide-react';
import SellerReviewTab from './components/tap/SellerReviewTab';
import SellerReviewItem from './components/item/SellerReviewItem';
import { toastInfo, toastSuccess } from '../../components/toast/CustomToast';

const PAGE_SIZE = 10;

export default function SellerReviewPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(0);
  const [selectedRating, setSelectedRating] = useState();

  const [page, setPage] = useState(0);
  const [reviews, setReviews] = useState([]); // 리뷰 목록
  const [totalCount, setTotalCount] = useState(0);

  // 별점 필터링
  const handleRatingFiltering = (rating) => {
    setSelectedRating(rating);
  };

  // 리뷰 목록 페치
  const getReviewsFetch = async () => {
    try {
      setLoading(true);

      const data = await getSellerReviews({
        page,
        size: PAGE_SIZE,
        sortby: 'desc',
        isAnswered: activeTab,
        rating: selectedRating,
      });

      setReviews(data.reviews || []);
      setTotalCount(data.totalCount);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 답변
  const handleSubmit = async (e, reviewId) => {
    setAnswerLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const answer = formData.get('answer').toString() || '';

    const data = {
      answerText: answer,
    };

    try {
      const isSuccess = await createSellerReviewAnswer(reviewId, data);
      setRenderTrigger(isSuccess);
    } finally {
      setAnswerLoading(false);
    }
  };

  // 리뷰 답변 수정
  const handleUpdateSubmit = async (e, reviewId, answerId) => {
    setAnswerLoading(true);

    const formData = new FormData(e.currentTarget);
    const answer = formData.get('answer').toString() || '';

    const data = {
      answerText: answer,
    };


    try {
      const isSuccess = await updateSellerReviewAnswer(reviewId, answerId, data);
      setRenderTrigger(isSuccess);
    } finally {
      setAnswerLoading(false);
    }
  };

  // 리뷰 답변 삭제
  const handleDeleteAnswer = async (reviewId, answerId) => {
    setAnswerLoading(true);
    try {
      const isSuccess = await deleteSellerReviewAnswer(reviewId, answerId);
      toastSuccess(reviewId+" 번 리뷰에 대한 답변을 삭제하였습니다.")
      setRenderTrigger(isSuccess);
    } finally {
      setAnswerLoading(false);
    }
  };

  useEffect(() => {
    getReviewsFetch();
  }, [page, renderTrigger, activeTab, selectedRating]);

  return (
    <section className='bg-gray-100 min-h-screen'>
      <div className='w-full mx-auto px-6 py-6'>
        {/* 헤더 */}
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
          <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
                <MessageSquare className='mr-2 text-gray-600 w-6 h-6' />
                리뷰 관리
              </h2>
              <p className='text-gray-500 mt-1'>고객 리뷰를 관리하고 응답하세요.</p>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex items-center text-sm text-gray-500'>
                <span className='mr-2'>총 리뷰:</span>
                <span className='font-semibold text-gray-700'>{totalCount}개</span>
              </div>
              <div className='relative'>
                {/* 필터 모달 */}
                <SellerRatingFilterModal onFilter={handleRatingFiltering} />
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          {/* 탭스 */}
          <SellerReviewTab activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* 리뷰 리스트 */}
          <div className='divide-y divide-gray-100'>
            {!loading ? (
              reviews.length > 0 ? (
                reviews.map((review) => (
                  <SellerReviewItem
                    key={review.reviewId}
                    onCreateSubmit={handleSubmit}
                    onUpdateSubmit={handleUpdateSubmit}
                    onDelete={()=>handleDeleteAnswer(review.reviewId, review.answerId)}
                    review={review}
                    selectedReviewId={selectedReviewId}
                    setSelectedReviewId={setSelectedReviewId}
                    isLoading={answerLoading}
                  />
                ))
              ) : (
                <div className='p-16 text-center'>
                  <div className='flex flex-col items-center justify-center'>
                    <MessageSquare className='w-12 h-12 text-gray-300 mb-3' />
                    <p className='text-gray-500'>선택한 필터에 해당하는 리뷰가 없습니다.</p>
                    <button
                      onClick={() => {
                        setActiveTab(null);
                        setSelectedRating(undefined);
                      }}
                      className='mt-4 text-sm text-gray-600 hover:text-gray-800 underline'
                    >
                      모든 리뷰 보기
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className='p-16 text-center'>
                <div className='flex flex-col items-center justify-center'>
                  <div className='w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-3'></div>
                  <p className='text-gray-500'>리뷰를 불러오는 중입니다...</p>
                </div>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {reviews.length > 0 && (
            <div className='p-4 border-t border-gray-100'>
              <Pagination
                handlePageClick={({ selected }) => setPage(selected)}
                totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
