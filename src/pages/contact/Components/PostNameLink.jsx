import { useNavigate } from 'react-router-dom';

function PostNameLink({ post }) {
  const navigate = useNavigate();
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `오늘 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Otherwise return the date
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
      onClick={() => navigate(`./post/${post.articleId}`)}
    >
      <div className="col-span-1 text-center font-medium text-gray-500">{post.articleId}</div>
      <div className="col-span-9 font-medium text-gray-800 truncate">
        {post.articleName}
        {post.replyCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
            {post.replyCount}
          </span>
        )}
      </div>
      <div className="col-span-2 text-center text-sm text-gray-500">
        {post.writtenDate ? formatDate(post.writtenDate) : '날짜 없음'}
      </div>
    </div>
  );
}

export default PostNameLink;
