import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Buttons({ onSubmit }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      // onSubmit 함수에서 navigate를 처리하므로 여기서는 추가 작업 불필요
    } catch (error) {
      console.error('제출 중 오류 발생:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex space-x-3 justify-end mt-8">
      <button
        onClick={() => navigate('/contact')}
        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
      >
        취소
      </button>
      
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-6 py-3 ${
          isSubmitting 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            작성 중...
          </>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            작성
          </>
        )}
      </button>
    </div>
  );
}

export default Buttons;
