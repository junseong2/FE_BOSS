import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainurl from './mainurl';
import { useState } from 'react';

function PostArticle({ articleId, content }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setIsDeleting(true);
      console.log('삭제 요청할 articleId:', articleId);
      axios
        .delete(mainurl() + `/articles/${articleId}`)
        .then(() => {
          alert('게시글이 삭제되었습니다.');
          navigate('/contact');
        })
        .catch((error) => {
          console.error('게시글 삭제 중 오류 발생:', error);
          alert('게시글 삭제 중 오류가 발생했습니다.');
          setIsDeleting(false);
        });
    }
  };

  // Format content with line breaks
  const formattedContent = content?.split('\n').map((line, index) => (
    <p key={index} className={index > 0 ? 'mt-4' : ''}>
      {line || <br />}
    </p>
  ));

  return (
    <div className="px-6 py-6 border-b border-gray-200">
      <div className="prose max-w-none text-gray-700 min-h-[200px]">
        {formattedContent}
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => navigate(`/edit/${articleId}`)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
          수정
        </button>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`px-4 py-2 ${
            isDeleting 
              ? 'bg-red-300 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600'
          } text-white rounded-lg transition-colors flex items-center`}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              삭제 중...
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              삭제
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PostArticle;
