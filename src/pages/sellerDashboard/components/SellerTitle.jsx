import styles from '../styles/SellerTitle.module.css';

function SellerTitle({ children, type }) {
  return <h2 className={styles[`sellerTitle-${type}`]}>{children}</h2>;
}

export default SellerTitle;
