function PostNameShow({ title, userId, writtenDate }) {
  const formatDate = (dateString) => {
    if (!dateString) return '날짜 없음';
    
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-6 py-5 border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">{title}</h1>
      
      <div className="flex items-center text-sm text-gray-500">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-medium mr-2">
            {userId ? userId.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="font-medium">{userId ? `User ${userId}` : '익명'}</span>
        </div>
        
        <span className="mx-2">•</span>
        
        <div className="flex items-center">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span>{formatDate(writtenDate)}</span>
        </div>
      </div>
    </div>
  );
}

export default PostNameShow;
