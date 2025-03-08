import styles from './styles/SellerPage.module.css';
import SellerSideBar from './components/SellerSideBar';
import SellerTitle from './components/SellerTitle';
import SellerContent from './components/SellerContent';
import SellerHeader from './components/SellerHeader';
import { IoBusiness } from 'react-icons/io5';

function SellerPage() {
  return (
    <section className={styles.sellerPageLayout}>
      <SellerSideBar />

      <div className={styles.sellerContentLayout}>
        <SellerHeader>
          <SellerTitle type={'normal'}>
            <IoBusiness /> 부곡점 관리
          </SellerTitle>
        </SellerHeader>
        <SellerContent />
      </div>
    </section>
  );
}

export default SellerPage;
