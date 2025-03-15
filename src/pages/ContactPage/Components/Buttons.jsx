import styles from '../Styles/Buttons.module.css'; // ✅ 스타일 분리
import { useNavigate } from 'react-router-dom';

// 게시물 작성 버튼
// - `PostWriting.jsx` 내부에서 사용됨

function Buttons({ onSubmit }) {
  const navigate = useNavigate();

  return (
    <div className={styles.buttonContainer}>
      <button onClick={onSubmit} className={styles.submitButton}>
        작성
      </button>
      <button onClick={() => navigate('/contact')} className={styles.cancelButton}>
        취소
      </button>
    </div>
  );
}

export default Buttons;
