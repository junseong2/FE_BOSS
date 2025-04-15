import { useEffect, useState } from 'react';
import { createSellerReviewAnswer, getSellerReviews } from '../../services/review.service';
import { Rating } from '@smastrom/react-rating';
import Pagination from '../../components/Pagination';
import TimeAgo from 'react-timeago';
import SellerRatingFilterModal from './components/pages/SellerRatingFilterModal';

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
  const [totalCount, setTotalCount] = useState(1);

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
      setTotalCount(data.totalCount || 1);
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

  useEffect(() => {
    getReviewsFetch();
  }, [page, renderTrigger, activeTab, selectedRating]);

  return (
    <section>
      <div className='w-full mx-auto px-4 py-6 bg-[#f3f4f6]'>
        {/* 헤더 */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-2xl font-bold'>리뷰 관리</h2>
            <p className='text-gray-600'>고객 리뷰를 관리하고 응답하세요.</p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              {/* 필터 모달 */}
              <SellerRatingFilterModal onFilter={handleRatingFiltering} />
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className='bg-white  border-0 border-gray-100 '>
          <div className='border-b border-gray-100'>
            <div className='flex'>
              <button
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === null
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(null)}
              >
                전체 리뷰
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === false
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(false)}
              >
                미응답 리뷰
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(true)}
              >
                응답 완료
              </button>
            </div>
          </div>

          <div className='divide-y divide-gray-100'>
            {!loading ? (
              reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.reviewId} className='p-6'>
                    <div className='flex items-start gap-4'>
                      <div className='w-10 h-10 bg-gray-200 rounded-full flex-shrink-0'></div>
                      <div className='flex-grow'>
                        <div className='flex justify-between'>
                          <div>
                            <h3 className='font-medium'>{review.username}</h3>
                            <p className='text-gray-500 text-sm'>
                              <TimeAgo date={review.createdAt} />
                            </p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='flex'>
                              <Rating
                                value={review.rating}
                                style={{ width: 130, cursor: 'default' }}
                                isDisabled
                              />
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                review.isAnswered
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {review.isAnswered ? '응답 완료' : '미응답'}
                            </span>
                          </div>
                        </div>

                        <div className='mt-4'>
                          <div className='flex gap-4 mb-3'>
                            <div className='w-16 h-16 bg-gray-200 rounded'></div>
                            <div>
                              <h4 className='font-semibold mb-1'>{review.productName}</h4>
                              <p className='text-gray-700'>{review.reviewText}</p>
                            </div>
                          </div>

                          {review?.reviewAnswer && (
                          <div className='ml-6 mt-4 p-4 bg-gray-50  border border-gray-100'>
                            <div className='flex justify-between'>
                              <p className='text-gray-500 text-sm'>
                                판매자 답변 (<TimeAgo date={review.reviewAnswer.createdAt}/>)
                              </p>
                            </div>
                            <p className='mt-2 text-gray-700'>{review.reviewAnswer.answerText}</p>
                          </div>
                        )}

                          <div className='mt-4'>
                            {selectedReviewId === review.reviewId ? (
                              <form
                                onSubmit={(e) => {
                                  handleSubmit(e, review.reviewId);
                                }}
                              >
                                <textarea
                                  name='answer'
                                  className='rounded-[5px]  w-full p-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-500'
                                  rows='3'
                                  placeholder='고객의 리뷰에 답변을 남겨주세요...'
                                ></textarea>
                                <div className='flex justify-end gap-2 mt-2'>
                                  <button
                                    className='cursor-pointer rounded-[5px] px-4 py-2 text-gray-600 border border-gray-200  hover:bg-gray-100'
                                    onClick={() => setSelectedReviewId(0)}
                                  >
                                    취소
                                  </button>
                                  <button
                                    type='submit'
                                    className='cursor-pointer rounded-[5px] px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700'
                                  >
                                    답변 등록
                                  </button>
                                </div>
                              </form>
                            ) : !review.isAnswered ? (
                              <button
                                className='text-blue-600 hover:text-blue-800 font-medium text-sm'
                                onClick={() => setSelectedReviewId(review.reviewId)}
                              >
                                답변 작성하기
                              </button>
                            ) :null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='p-12 text-center'>
                  <p className='text-gray-500'>선택한 필터에 해당하는 리뷰가 없습니다.</p>
                </div>
              )
            ) : null}
          </div>
        </div>
        <Pagination
          handlePageClick={({ selected }) => setPage(selected)}
          totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
        />
      </div>
    </section>
  );
}
