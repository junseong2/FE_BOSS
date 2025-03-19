<<<<<<< HEAD
import styles from '../Styles/PageNum.module.css'; // ✅ 스타일 분리

// 페이지네이션 버튼 컴포넌트
// - `PostList.jsx`에서 사용됨
// - 숫자 버튼을 클릭하면 해당 페이지의 게시물 목록을 불러옴
// - "글쓰기" 버튼 포함

function PageNum({ totalPages, setCurrentPage, onWriteClick }) {
  const pageButtons = [];

  // ✅ for 문을 사용하여 페이지 버튼 생성
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button key={i} onClick={() => setCurrentPage(i)} className={styles.pageButton}>
        {i}
      </button>,
    );
  }

  return (
    <div className={styles.pageContainer}>
      {pageButtons}

      {/* ✅ 글쓰기 버튼 (navigate 사용 X, onWriteClick 함수 실행) */}
      <button onClick={onWriteClick} className={styles.writeButton}>
        글쓰기
      </button>
    </div>
  );
}

export default PageNum;
=======
import styles from '../Styles/PageNum.module.css'; // ✅ 스타일 분리

// 페이지네이션 버튼 컴포넌트
// - `PostList.jsx`에서 사용됨
// - 숫자 버튼을 클릭하면 해당 페이지의 게시물 목록을 불러옴
// - "글쓰기" 버튼 포함

function PageNum({ totalPages, setCurrentPage, onWriteClick }) {
  const pageButtons = [];

  // ✅ for 문을 사용하여 페이지 버튼 생성
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button key={i} onClick={() => setCurrentPage(i)} className={styles.pageButton}>
        {i}
      </button>,
    );
  }

  return (
    <div className={styles.pageContainer}>
      {pageButtons}

      {/* ✅ 글쓰기 버튼 (navigate 사용 X, onWriteClick 함수 실행) */}
      <button onClick={onWriteClick} className={styles.writeButton}>
        글쓰기
      </button>
    </div>
  );
}

export default PageNum;
>>>>>>> 9a46fdb7f53d7fa652d3a25dce333bc76eef7b3e
