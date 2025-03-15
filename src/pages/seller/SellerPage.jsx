import SellerContent from './components/common/SellerContent';
import SellerTitle from './components/common/SellerTitle';
import SellerHeader from './components/layout/SellerHeader';
import SellerSideBar from './components/layout/SellerSideBar';
import styles from './styles/SellerPage.module.css';
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
