import styles from '../../styles/SellerHeader.module.css';
function SellerHeader({ children }) {
  return <header className={styles.sellerHeader}>{children}</header>;
}

export default SellerHeader;
