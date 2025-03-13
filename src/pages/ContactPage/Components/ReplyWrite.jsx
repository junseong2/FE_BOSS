import { useState } from 'react';
import axios from 'axios';
import mainurl from './mainurl';

// 댓글 작성 컴포넌트
// - 사용자가 댓글 입력 후 "작성" 버튼을 누르면 서버로 전송
// - `onReplyAdded`를 통해 `ReplySection`에서 상태 업데이트

function ReplyWrite({ articleId, onReplyAdded }) {
  const [replyText, setReplyText] = useState('');

  // ✅ 댓글 작성 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') return;

    axios
      .post(mainurl() + `/articles/${articleId}/comments`, {
        replyArticle: replyText,
        userId: null, // ✅ 기본값을 NULL로 설정
      })
      .then((response) => {
        onReplyAdded(response.data); // ✅ 새로운 댓글을 부모 상태에 추가
        setReplyText(''); // ✅ 입력 필드 초기화
      })
      .catch((error) => {
        console.error('댓글 작성 중 오류 발생:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder='댓글을 입력하세요'
      />
      <button type='submit'>작성</button>
    </form>
  );
}

export default ReplyWrite;
