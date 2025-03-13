import styles from '../Styles/PostNameWrite.module.css'; // ✅ 스타일 분리

// 게시물 제목 입력 필드
// - `PostWriting.jsx` 내부에서 사용됨

function PostNameWrite({ title, setTitle }) {
  return (
    <div className={styles.titleContainer}>
      <label htmlFor='title' className={styles.label}>
        제목
      </label>
      <input
        id='title'
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value.trimStart())} // ✅ 앞쪽 공백 방지
        className={styles.input}
        placeholder='제목을 입력하세요'
        maxLength={100} // ✅ 최대 100자 제한 (선택 사항)
      />
    </div>
  );
}

export default PostNameWrite;
