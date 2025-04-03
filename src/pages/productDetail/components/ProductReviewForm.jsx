import React, { useState } from 'react';
import { insertReview } from '../../../services/review.service';
import { Rating, ThinRoundedStar } from '@smastrom/react-rating';


const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: '#ffb700',
  inactiveFillColor: '#fbf1a9',
  inactiveBoxBorderColor: '#F3F4F6',
};

export default function ProductReviewForm({ productId, renderTrigger }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [openReviewForm, setOpenReviewForm] = useState(false);


  // 리뷰 작성 폼 토글
  function handleToggleReviewForm() {
    setOpenReviewForm((prev) => !prev);
  }

  // 리뷰 등록 요청
  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();

    if(rating<1 || !reviewText){
      alert("리뷰를 완성해주세요!")
      return
    }

    const data = {
      ratings:rating,
      reviewText,
    };
    try {
      const isSuccess = await insertReview(productId, data);
      if (isSuccess) {
        renderTrigger(true)
        alert('리뷰가 등록되었습니다!');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full mx-auto mt-15'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>고객 리뷰</h1>
        <button className='bg-black text-white px-4 py-2 rounded' onClick={handleToggleReviewForm}>
          {openReviewForm ? '취소' : '리뷰 작성'}
        </button>
      </div>

        {openReviewForm ? (
          <form className='mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm' onSubmit={handleSubmit}>
            <h2 className='text-xl font-bold mb-1'>리뷰 작성</h2>
            <p className='text-gray-600 text-sm mb-4'>이 제품에 대한 솔직한 의견을 남겨주세요</p>

            {/* 평점 */}
            <div className='mb-6 w-full'>
              <p className='text-gray-700 mb-2'>평점</p>
              <Rating
                style={{ maxWidth: 200 }}
                value={rating}
                onChange={setRating}
                itemStyles={myStyles}
                halfFillMode='svg'
                highlightOnlySelected={false}
              />
            </div>

            {/* 리뷰 내용 */}
            <div className='mb-6'>
              <p className='text-gray-700 mb-2'>리뷰 내용</p>
              <textarea
                className='w-full border border-gray-300 rounded p-3 min-h-32'
                placeholder='제품에 대한 경험을 공유해주세요'
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div>
              <button
                type='submit'
                disabled={loading}
                className={`disabled:opacity-70 disabled:cursor-not-allowed bg-[#4294F2] text-white px-6 py-2 rounded-md hover:opacity-90 cursor-pointer`}
              >
                {loading ? '등록중' : ' 리뷰 등록하기'}
              </button>
            </div>
          </form>
        ) : null}

    </div>
  );
}
