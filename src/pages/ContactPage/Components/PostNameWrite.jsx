function PostNameWrite({ title, setTitle }) {
  const MAX_LENGTH = 100;

  return (
    <div className="space-y-2 mb-6">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        제목
      </label>
      <div className="relative">
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.trimStart())}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="제목을 입력하세요"
          maxLength={MAX_LENGTH}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className={`text-xs ${title.length > MAX_LENGTH * 0.8 ? 'text-red-500' : 'text-gray-400'}`}>
            {title.length}/{MAX_LENGTH}
          </span>
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
        명확한 제목은 더 많은 관심과 답변을 받을 수 있습니다.
      </p>
    </div>
  );
}

export default PostNameWrite;
