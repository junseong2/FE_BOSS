import React, { useState } from 'react';
import { insertReview } from '../../../services/review.service';
import { Rating, ThinRoundedStar } from '@smastrom/react-rating';
import { IoImageOutline, IoCloseCircle, IoStar, IoStarOutline } from 'react-icons/io5';

const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: '#ffb700',
  inactiveFillColor: '#f5f5f5',
  inactiveBoxBorderColor: '#e5e7eb',
};

export default function ProductReviewForm({ productId, renderTrigger }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // 리뷰 작성 폼 토글
  function handleToggleReviewForm() {
    setOpenReviewForm((prev) => !prev);
    if (openReviewForm) {
      // 폼을 닫을 때 상태 초기화
      setRating(0);
      setReviewText('');
      setPreviewImage(null);
      setImageFile(null);
    }
  }

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 핸들러
  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  // 리뷰 등록 요청
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (rating < 1 || !reviewText) {
      alert("별점과 리뷰 내용을 모두 입력해주세요!");
      return;
    }
    
    setLoading(true);

    const data = {
      ratings: rating,
      reviewText,
      // 실제 구현에서는 이미지 파일도 함께 전송
    };
    
    try {
      const isSuccess = await insertReview(productId, data);
      if (isSuccess) {
        renderTrigger(true);
        alert('리뷰가 등록되었습니다!');
        handleToggleReviewForm();
      }
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">고객 리뷰</h2>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${
            openReviewForm 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={handleToggleReviewForm}
        >
          {openReviewForm ? '취소' : '리뷰 작성'}
        </button>
      </div>

      {openReviewForm && (
        <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">리뷰 작성</h3>
              <p className="text-sm text-gray-500">이 제품에 대한 솔직한 의견을 남겨주세요</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 평점 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
              <div className="flex items-center">
                <Rating
                  style={{ maxWidth: 200 }}
                  value={rating}
                  onChange={setRating}
                  itemStyles={myStyles}
                  halfFillMode='svg'
                  highlightOnlySelected={false}
                />
                <span className="ml-2 text-gray-500">
                  {rating > 0 ? `${rating}점` : '별점을 선택해주세요'}
                </span>
              </div>
            </div>

            {/* 리뷰 내용 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="제품에 대한 경험을 공유해주세요. 어떤 점이 좋았나요? 어떤 점이 아쉬웠나요?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">사진 첨부 (선택)</label>
              
              {previewImage ? (
                <div className="relative inline-block">
                  <img 
                    src={previewImage || "/placeholder.svg"} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                  />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700"
                  >
                    <IoCloseCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <IoImageOutline className="w-8 h-8 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">사진 추가</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 rounded-md text-white font-medium transition-colors ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    등록 중...
                  </span>
                ) : '리뷰 등록하기'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
