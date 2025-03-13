import styles from '../Styles/PostNameShow.module.css'; // ✅ 스타일 분리

// 게시물 제목, 작성자, 작성일을 표시하는 컴포넌트
// - `Post.jsx` 내부에서 사용됨

function PostNameShow({ title, userId, writtenDate }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.info}>
        <span className={styles.author}>{userId ? `User ${userId}` : '익명'}</span>
        <span className={styles.date}>{new Date(writtenDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default PostNameShow;
