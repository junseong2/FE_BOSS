import styles from '../Styles/PostArticleWrite.module.css'; // ✅ 스타일 분리

// 게시물 본문 입력 필드
// - `PostWriting.jsx` 내부에서 사용됨

function PostArticleWrite({ content, setContent }) {
  return (
    <div className={styles.articleContainer}>
      <label htmlFor='content' className={styles.label}>
        내용
      </label>
      <textarea
        id='content'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        placeholder='내용을 입력하세요...'
        rows='8' // ✅ 가독성을 위해 기본 8줄
      />
    </div>
  );
}

export default PostArticleWrite;
