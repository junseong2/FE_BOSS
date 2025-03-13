import styles from '../styles/SellerToolBar.module.css';

function SellerSearch({ onSearch, placeholder }) {
  return (
    <input
      type='search'
      placeholder={placeholder}
      className={styles.searchInput}
      onKeyDown={onSearch}
    />
  );
}

export default SellerSearch;
