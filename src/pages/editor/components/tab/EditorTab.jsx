import styles from '../../styles/EditorTab.module.css';

export default function EditorTab({ tabList, onTabChange, targetTabName }) {
  return (
    <div className={styles.editorTab}>
      {tabList?.map((tabName) => {
        return (
          <button
            key={tabName}
            onClick={() => onTabChange(tabName)}
            className={`${styles.tabButton} ${targetTabName === tabName ? styles.active : null}`}
          >
            {tabName}
          </button>
        );
      })}
    </div>
  );
}
