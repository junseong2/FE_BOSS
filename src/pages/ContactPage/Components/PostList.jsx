import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from './PostNameLink';
import PageNum from './PageNum';
import mainurl from './mainurl';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(mainurl() + '/articles')
      .then((response) => {
        console.log('API 응답 데이터:', response.data);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('받아온 데이터가 배열이 아닙니다:', response.data);
          setPosts([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('게시글 목록을 불러오는 중 오류 발생:', error);
        setPosts([]);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      });
  }, []);

  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = [];
  for (let i = startIndex; i < startIndex + postsPerPage && i < posts.length; i++) {
    currentPosts.push(posts[i]);
  }

  const totalPages = posts.length ? Math.ceil(posts.length / postsPerPage) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-blue-600">Q&A</span> 게시판
        </h1>
        <button
          onClick={() => navigate('./write')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          글쓰기
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-9">제목</div>
            <div className="col-span-2 text-center">작성일</div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : currentPosts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {currentPosts.map((post) => (
              <Post key={post.articleId} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-gray-300 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-lg">게시글이 없습니다.</p>
            <p className="mt-2 text-sm">첫 번째 게시글을 작성해보세요!</p>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className="mt-8">
          <PageNum
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default PostList;
