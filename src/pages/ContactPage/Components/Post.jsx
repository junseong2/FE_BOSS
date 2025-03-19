import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostNameShow from './PostNameShow';
import PostArticle from './PostArticle';
import ReplySection from './ReplySection'; // ✅ 댓글 섹션 (ReplyList 포함)
import mainurl from './mainurl';

// 📌 게시글 상세 페이지 컴포넌트
// - `/post/:id` 경로에서 렌더링됨
// - API에서 해당 게시글 상세 정보를 불러옴
// - 제목, 작성자, 본문, 댓글 리스트를 표시
// - 댓글 기능은 `ReplySection.jsx`에서 관리

function Post() {
  const { articleId } = useParams(); // 📌 URL에서 게시글 ID 가져오기
  const [article, setArticle] = useState(null); // 📌 게시글 상태

  // ✅ 게시물 불러오기
  useEffect(() => {
    console.log(mainurl() + `/articles/${articleId}`);
    axios
      .get(mainurl() + `/articles/${articleId}`)
      .then((response) => {
        setArticle(response.data); // 📌 API 응답 데이터 저장
      })
      .catch((error) => {
        console.error('게시글을 불러오는 중 오류 발생:', error);
      });
  }, [articleId]);

  // ✅ 데이터 로딩 중인 경우
  if (!article) {
    return <h2>게시글을 불러오는 중...</h2>;
  }

  return (
    <div>
      {/* ✅ 게시글 제목, 작성자, 작성일 표시 */}
      <PostNameShow
        title={article.articleName}
        author={article.userId ? `User ${article.userId}` : '익명'}
        written_date={new Date(article.writtenDate).toLocaleDateString()}
      />

      {/* ✅ 게시글 본문 */}
      <PostArticle articleId={article.articleId} content={article.article} />

      {/* ✅ 댓글 섹션 포함 */}
      <ReplySection articleId={article.articleId} />
    </div>
  );
}

export default Post;
