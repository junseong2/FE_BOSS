import { useState, useEffect } from 'react';
import axios from 'axios';
import ReplyWrite from './ReplyWrite';
import ReplyList from './ReplyList';
import mainurl from './mainurl';

// 댓글 섹션 컴포넌트
// - `Post.jsx` 내부에서 사용됨 (게시글 상세 페이지)
// - `ReplyWrite`(댓글 입력) + `ReplyList`(댓글 목록) 포함
// - 댓글 추가 & 삭제 시 즉시 상태 업데이트

function ReplySection({ articleId }) {
  const [replies, setReplies] = useState([]); // ✅ 댓글 상태 관리

  // ✅ 댓글 목록 불러오기
  useEffect(() => {
    axios
      .get(mainurl() + `/articles/${articleId}/comments`)
      .then((response) => setReplies(response.data)) // ✅ API에서 가져온 댓글 목록 저장
      .catch((error) => console.error('댓글을 불러오는 중 오류 발생:', error));
  }, [articleId]);

  // ✅ 댓글 추가 핸들러 (새 댓글이 추가될 때 리스트 갱신)
  const handleReplyAdded = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]); // ✅ 상태 직접 추가
  };

  // ✅ 댓글 삭제 핸들러
  const handleDelete = (commentId) => {
    axios
      .delete(mainurl() + `/articles/${articleId}/comments/${commentId}`)
      .then(() =>
        setReplies((prevReplies) => prevReplies.filter((reply) => reply.replyId !== commentId)),
      ) // ✅ 삭제 즉시 반영
      .catch((error) => console.error('댓글 삭제 중 오류 발생:', error));
  };

  return (
    <div>
      {/* ✅ 댓글 작성 입력 필드 */}
      <ReplyWrite articleId={articleId} onReplyAdded={handleReplyAdded} />

      {/* ✅ 댓글 목록 표시 */}
      <ReplyList replies={replies} onDelete={handleDelete} />
    </div>
  );
}

export default ReplySection;
