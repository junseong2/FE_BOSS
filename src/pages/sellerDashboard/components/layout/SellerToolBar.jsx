import styles from '../styles/SellerToolBar.module.css';
function SellerToolBar({ children }) {
  return <div className={styles.sellerToolBarLayout}>{children}</div>;
}

export default SellerToolBar;
