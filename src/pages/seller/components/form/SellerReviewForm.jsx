
import { Send } from "lucide-react";

export default function SellerReviewForm({handleSubmit,review, isLoading, setSelectedReviewId, defaultValue}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, review.reviewId);
      }}
      className='border border-gray-200 rounded-lg p-3 bg-white'
    >
      <textarea
        name='answer'
        className='rounded-lg w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400'
        defaultValue={defaultValue}
        rows='3'
        placeholder='고객의 리뷰에 답변을 남겨주세요...'
      ></textarea>
      <div className='flex justify-end gap-2 mt-2'>
        <button
          type='button'
          className='cursor-pointer rounded-lg px-4 py-2 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors'
          onClick={() => setSelectedReviewId(0)}
        >
          취소
        </button>
        <button
          type='submit'
          className='cursor-pointer rounded-lg px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-1.5'
          disabled={isLoading}
        >
          <Send className='w-3.5 h-3.5' />
          답변 등록
        </button>
      </div>
    </form>
  );
}
