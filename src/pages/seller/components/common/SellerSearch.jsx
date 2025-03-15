import styles from '../../styles/SellerToolBar.module.css';

function SellerSearch({ onSearch, placeholder }) {
  return (
    <form onSubmit={onSearch} className={styles.searchFormLayout}>
      <input type='search' name='search' placeholder={placeholder} className={styles.searchInput} />
      <button className={styles.submitButton} type='submit'>
        검색
      </button>
    </form>
  );
}

export default SellerSearch;
