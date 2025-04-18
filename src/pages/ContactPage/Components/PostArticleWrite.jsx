function PostArticleWrite({ content, setContent }) {
  return (
    <div className="space-y-2 mb-6">
      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
        내용
      </label>
      <div className="relative">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[200px] resize-y"
          placeholder="내용을 입력하세요..."
          rows="10"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {content.length}자
        </div>
      </div>
      <p className="text-xs text-gray-500">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 inline mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        내용은 상세하게 작성할수록 정확한 답변을 받을 수 있습니다.
      </p>
    </div>
  );
}

export default PostArticleWrite;
