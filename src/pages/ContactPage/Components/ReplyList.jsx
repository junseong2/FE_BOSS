<<<<<<< HEAD
// 댓글 목록 컴포넌트
// - `ReplySection`에서 댓글 데이터를 props로 받아 화면에 표시
// - 개별 댓글 삭제 기능 포함

function ReplyList({ replies, onDelete }) {
  return (
    <div>
      <h3>댓글 목록</h3>
      {replies.length > 0 ? (
        <ul>
          {replies.map((reply) => (
            <li key={reply.replyId}>
              <p>
                <strong>작성자:</strong> {reply.userId ? `User ${reply.userId}` : '익명'}
              </p>
              <p>{reply.replyArticle}</p>
              <button onClick={() => onDelete(reply.replyId)}>삭제</button> {/* ✅ 삭제 기능 */}
            </li>
          ))}
        </ul>
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
}

export default ReplyList;
=======
// 댓글 목록 컴포넌트
// - `ReplySection`에서 댓글 데이터를 props로 받아 화면에 표시
// - 개별 댓글 삭제 기능 포함

function ReplyList({ replies, onDelete }) {
  return (
    <div>
      <h3>댓글 목록</h3>
      {replies.length > 0 ? (
        <ul>
          {replies.map((reply) => (
            <li key={reply.replyId}>
              <p>
                <strong>작성자:</strong> {reply.userId ? `User ${reply.userId}` : '익명'}
              </p>
              <p>{reply.replyArticle}</p>
              <button onClick={() => onDelete(reply.replyId)}>삭제</button> {/* ✅ 삭제 기능 */}
            </li>
          ))}
        </ul>
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
}

export default ReplyList;
>>>>>>> 9a46fdb7f53d7fa652d3a25dce333bc76eef7b3e
