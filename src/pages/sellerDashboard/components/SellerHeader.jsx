import styles from '../styles/sellerHeader.module.css';
function SellerHeader({ children }) {
  return <header className={styles.sellerHeader}>{children}</header>;
}

export default SellerHeader;
