import { CheckCircle, Clock, MessageSquare, Package, User } from 'lucide-react';
import SellerReviewForm from '../form/SellerReviewForm';
import { MdDeleteForever } from 'react-icons/md';
import { IoPencil } from 'react-icons/io5';
import TimeAgo from 'react-timeago';
import { Rating } from '@smastrom/react-rating';
import noImage from '../../../../assets/noImage.jpg'

export default function SellerReviewItem({
  review,
  onCreateSubmit,
  onUpdateSubmit,
  onDelete,
  setSelectedReviewId,
  selectedReviewId,
  isLoading,
}) {
  return (
    <div key={review.reviewId} className='p-6 hover:bg-gray-50 transition-colors'>
      <div className='flex items-start gap-4'>
        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-400'>
          <User className='w-5 h-5' />
        </div>
        <div className='flex-grow'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
            <div>
              <h3 className='font-medium text-gray-800'>{review.username}</h3>
              <p className='text-gray-500 text-sm flex items-center gap-1'>
                <Clock className='w-3.5 h-3.5' />
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
                className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1 ${
                  review.isAnswered ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {review.isAnswered ? (
                  <>
                    <CheckCircle className='w-3 h-3' />
                    응답 완료
                  </>
                ) : (
                  <>
                    <Clock className='w-3 h-3' />
                    미응답
                  </>
                )}
              </span>
            </div>
          </div>

          <div className='mt-4'>
            <div className='flex gap-4 mb-3'>
              <div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400'>
                <img 
                className='w-full h-full object-cover rounded-lg'
                src={"https://bossassets.s3.amazonaws.com/"+ review.imageList[0]} alt={review.productName} onError={(e)=>{
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = noImage;

                }}/>
              </div>
              <div>
                <h4 className='font-semibold mb-1 text-gray-800'>{review.productName}</h4>
                <p className='text-gray-700'>{review.reviewText}</p>
              </div>
            </div>

            {/* 판매자 답변 */}
            {review?.answerText && (
              <div className='ml-6 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                <div className='flex justify-between items-center'>
                  <p className='text-gray-500 text-sm font-medium flex items-center gap-1.5'>
                    <MessageSquare className='w-3.5 h-3.5' />
                    판매자 답변 (<TimeAgo date={review.answerCreatedAt} />)
                  </p>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => setSelectedReviewId(review.reviewId)}
                      title='판매자 답변 수정'
                      className='border flex items-center justify-center border-gray-200 rounded-[5px] p-1 w-6 h-6 hover:bg-gray-100 cursor-pointer'
                    >
                      <IoPencil />
                    </button>
                    <button
                      onClick={onDelete}
                      title='판매자 답변 삭제'
                      className='border flex items-center justify-center border-gray-200 rounded-[5px] p-1 w-6 h-6 hover:bg-gray-100 cursor-pointer'
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>
                <p className='mt-2 text-gray-700'>{review.answerText}</p>
              </div>
            )}

            {/* 답변 작성 폼 */}
            <div className='mt-4'>
              {selectedReviewId === review.reviewId ? (
                <SellerReviewForm
                  isLoading={isLoading}
                  handleSubmit={(e) => {
                    e.preventDefault();
                    if (review.answerText) {
                      console.log(review.reviewId)
                      onUpdateSubmit(e, review.reviewId, review.answerId);
                    } else {
                      onCreateSubmit(e, review.reviewId);
                    }
                  }}
                  review={review}
                  setSelectedReviewId={setSelectedReviewId}
                  defaultValue={review.answerText}
                />
              ) : !review.isAnswered ? (
                <button
                  className='text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  onClick={() => setSelectedReviewId(review.reviewId)}
                >
                  <MessageSquare className='w-4 h-4' />
                  답변 작성하기
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
