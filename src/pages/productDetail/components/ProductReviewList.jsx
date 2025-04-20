import { Rating, ThinRoundedStar } from '@smastrom/react-rating';
import {
  IoPersonCircleSharp,
  IoTimeOutline,
  IoThumbsUpOutline,
  IoThumbsUpSharp,
  IoEllipsisHorizontal,
} from 'react-icons/io5';
import { useState } from 'react';
import noImage from '../../../assets/noImage.jpg';

const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: '#ffb700',
  inactiveFillColor: '#f5f5f5',
  inactiveBoxBorderColor: '#e5e7eb',
};

export default function ProductReviewList({ reviews }) {
  const [likedReviews, setLikedReviews] = useState({});

  const toggleLike = (reviewId) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // 리뷰 날짜 포맷팅 함수 (예시)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='mt-8 border-t pt-6 border-gray-200'>
      {reviews?.length > 0 ? (
        <div className='space-y-6'>
          {reviews.map((review) => (
            <div key={review.reviewId}>
              <div className='bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300'>
                <div className='flex justify-between items-start'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center mr-3'>
                      <IoPersonCircleSharp className='w-10 h-10 text-blue-500' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900'>{review.username}</h4>
                      <div className='flex items-center text-xs text-gray-500 mt-1'>
                        <IoTimeOutline className='mr-1' />
                        <span>{formatDate(review.createdAt) || '최근 작성'}</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <Rating
                      isDisabled={true}
                      style={{ maxWidth: 100, cursor: 'default' }}
                      value={review.ratings}
                      itemStyles={myStyles}
                      halfFillMode='svg'
                      highlightOnlySelected={false}
                    />
                  </div>
                </div>

                {/* 리뷰 이미지 */}
                <div className='mt-4'>
                  <p className='text-gray-700 whitespace-pre-line'>{review.reviewText}</p>

                  <div className='mt-3 flex flex-wrap gap-2'>
                    {review.imageList?.map((imgUrl) => {
                      let imgSrc = '';
                      if (import.meta.env.VITE_REACT_APP_ENV !== 'production') {
                        imgSrc = import.meta.env.VITE_BACKEND_URL + '/uploads/' + imgUrl;
                      }

                      return (
                        <div
                          key={imgUrl}
                          className='p-1 bg-white border border-gray-200 rounded-[3px] hover:bg-gray-100 transition-colors'
                        >
                          <img
                            src={imgSrc}
                            alt='리뷰 이미지'
                            onError={(e) => {
                              e.currentTarget.src = noImage;
                            }}
                            className='w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity'
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className='mt-4 flex items-center justify-between'>
                  <button
                    onClick={() => toggleLike(review.reviewId)}
                    className={`flex items-center text-sm px-3 py-1.5 rounded-full ${
                      likedReviews[review.reviewId]
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {likedReviews[review.reviewId] ? (
                      <IoThumbsUpSharp className='mr-1.5' />
                    ) : (
                      <IoThumbsUpOutline className='mr-1.5' />
                    )}
                    도움됨 {(review.likes || 0) + (likedReviews[review.reviewId] ? 1 : 0)}
                  </button>

                  <button className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors'>
                    <IoEllipsisHorizontal />
                  </button>
                </div>
              </div>

              {/* 리뷰 응답 */}
              {review.answerText ? (
                <div className='pl-20 flex justify-end flex-col items-end mt-5'>
                  <div className='flex gap-3'>
                    <div className='text-gray-300'>ㄴ</div>
                    <div className=''>
                      <strong className='border border-gray-300 rounded-[3px] p-1 px-2 bg-green-500 text-white'>
                        {review.storeName}
                      </strong>
                      <p className='mt-3 pl-2'>{review.answerText}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-gray-50 rounded-lg p-10 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              ></path>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              ></path>
            </svg>
          </div>
          <h4 className='text-lg font-medium text-gray-700 mb-2'>아직 리뷰가 없어요!</h4>
          <p className='text-gray-500'>첫 번째 리뷰를 작성해 보세요.</p>
        </div>
      )}
    </div>
  );
}
