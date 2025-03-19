import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mainurl from './mainurl';

// 게시글 본문 + 삭제 기능 포함
// - `Post.jsx` 내부에서 렌더링됨
// - 게시글 본문을 표시
// - 게시글 삭제 버튼 포함 (삭제 시 `/contact`로 이동)

function PostArticle({ articleId, content }) {
  const navigate = useNavigate();

  // ✅ 게시물 삭제 함수
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      console.log('삭제 요청할 articleId:', articleId);
      axios
        .delete(mainurl() + `/articles/${articleId}`)
        .then(() => {
          alert('게시글이 삭제되었습니다.');
          navigate('/contact'); // ✅ 삭제 후 게시판 목록으로 이동
        })
        .catch((error) => {
          console.error('게시글 삭제 중 오류 발생:', error);
        });
    }
  };

  return (
    <div>
      <p>{content}</p>

      {/* ✅ 게시물 삭제 버튼 */}
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
}

export default PostArticle;
