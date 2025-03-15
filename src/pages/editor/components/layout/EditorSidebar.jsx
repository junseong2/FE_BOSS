import styles from '../../styles/EditorSidebar.module.css';

export default function EditorSidebar({ children }) {
  return <div className={`${styles.editorSidebar}`}>{children}</div>;
}
