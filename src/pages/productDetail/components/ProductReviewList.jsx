import { Rating, ThinRoundedStar } from '@smastrom/react-rating';
import { IoPersonCircleSharp } from 'react-icons/io5';

const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: '#fdc700',
  inactiveFillColor: '#fbf1a9',
  inactiveBoxBorderColor: '#F3F4F6',
};

export default function ProductReviewList({ reviews }) {
  return (
    <div className='mt-5 border-t pt-6 border-gray-200'>
      <div className='flex items-start mb-6'>
        <div className='flex flex-col w-full'>
          {reviews?.length > 0 ? (
            reviews.map((review) => {
              return (
                <div key={review.reviewId} className='flex items-center'>
                  <div className='flex-1 mt-2' key={review.reviewId}>
                    <div className='flex justify-between items-center h-full'>
                      <div className='w-full'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <IoPersonCircleSharp className='w-10 h-10 mr-2' color='#4294F2' />
                            <h3 className='font-bold'>{review.username}</h3>
                          </div>
                          <Rating
                            isDisabled={true}
                            style={{ maxWidth: 70, cursor: 'default' }}
                            value={review.ratings}
                            itemStyles={myStyles}
                            halfFillMode='svg'
                            highlightOnlySelected={false}
                          />
                        </div>
                        <p className='text-sm text-gray-500 pb-2 pl-12'>{review.reviewText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-gray-700 py-10 text-center'>작성된 리뷰가 없어요!</p>
          )}
        </div>
      </div>
    </div>
  );
}
