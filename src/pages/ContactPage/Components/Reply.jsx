import styles from '../Styles/Reply.module.css'; // ✅ 스타일 분리

// 개별 댓글을 표시하는 컴포넌트
// - `ReplyList.jsx` 내부에서 사용됨

function Reply({ reply }) {
  return (
    <div className={styles.replyItem}>
      <div className={styles.replyHeader}>
        <span className={styles.author}>{reply.userId ? `User ${reply.userId}` : '익명'}</span>
        <span className={styles.date}>{new Date(reply.writtenDate).toLocaleDateString()}</span>
      </div>
      <p className={styles.content}>{reply.replyArticle}</p>
    </div>
  );
}

export default Reply;
