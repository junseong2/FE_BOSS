import styles from '../styles/sortList.module.css';

/** 정렬 기능을 동적으로 관리하는 리스트 컴포넌트 */
export default function SortList({ sortList }) {
  return (
    <ul className={styles.sortList}>
      {sortList.map((sort) => {
        return <li key={sort}>{sort}</li>;
      })}
    </ul>
  );
}
