import { Outlet } from 'react-router';
import styles from '../styles/SellerContent.module.css';

function SellerContent() {
  return (
    <section className={styles.sellerContent}>
      <Outlet />
    </section>
  );
}

export default SellerContent;
