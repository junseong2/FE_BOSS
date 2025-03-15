import styles from '../../styles/EditorHeader.module.css';
import { IoSaveOutline } from 'react-icons/io5';

export default function EditorHeader() {
  return (
    <div className={`${styles.editorHeader}`}>
      <h2>Editor</h2>
      <button className={`${styles.editorSaveButton}`}>
        <IoSaveOutline />
        <span>변경사항 저장</span>
      </button>
    </div>
  );
}
