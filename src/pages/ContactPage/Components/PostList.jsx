/* eslint-disable react-hooks/rules-of-hooks */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from './PostNameLink';
import PageNum from './PageNum';
import mainurl from './mainurl';

// 게시판 목록을 보여주는 컴포넌트
// - `/contact`에서 렌더링됨
// - API에서 게시물 목록을 불러옴
// - 페이지네이션 지원 (한 페이지당 10개씩)
// - 게시물을 클릭하면 `/post/:id`로 이동
// - "글쓰기" 버튼을 누르면 `/write` 페이지로 이동

function PostList() {
  const [posts, setPosts] = useState([]); // ✅ 게시글 목록 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  // ✅ 게시글 목록 불러오기 (API 요청)
  useEffect(() => {
    axios
      .get(mainurl() + '/articles')
      .then((response) => {
        console.log('API 응답 데이터:', response.data); // ✅ 데이터 확인
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('받아온 데이터가 배열이 아닙니다:', response.data);
          setPosts([]); // 오류 방지
        }
      })
      .catch((error) => {
        console.error('게시글 목록을 불러오는 중 오류 발생:', error);
        setPosts([]); // 오류 발생 시 빈 배열 유지
      });
  }, []);

  // ✅ 현재 페이지의 게시물 가져오기 (for 문 사용)
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = [];
  for (let i = startIndex; i < startIndex + postsPerPage && i < posts.length; i++) {
    currentPosts.push(posts[i]);
  }

  // ✅ 페이지네이션 계산 (posts.length가 undefined인 경우 방지)
  const totalPages = posts.length ? Math.ceil(posts.length / postsPerPage) : 1;

  return (
    <div>
      <h1>QnA 게시판</h1>
      <div>
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => <Post key={post.articleId} post={post} />)
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>

      {/* ✅ 페이지네이션 및 글쓰기 버튼 */}
      <PageNum
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onWriteClick={() => navigate('./write')} // ✅ 글쓰기 버튼 클릭 시 /write로 이동
      />
    </div>
  );
}

export default PostList;
