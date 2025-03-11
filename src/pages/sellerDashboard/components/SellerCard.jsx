import styles from '../styles/SellerCard.module.css';

export function SellerCardLayout({ children }) {
  return <div className={styles.sellerCardLayout}>{children}</div>;
}

export function SellerCard({ title, amount, status }) {
  return (
    <div className={styles.sellerCard}>
      <span>{title}</span>
      <strong>{amount}</strong>
      <span>{status}</span>
    </div>
  );
}
