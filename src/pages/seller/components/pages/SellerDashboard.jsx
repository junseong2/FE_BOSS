import SellerPaymentPage from '../../SellerPaymentPage';
import SellerInventoryPage from '../../SellerInventoryPage';
import SellerOrderPage from '../../SellerOrderPage';
import SellerProductPage from '../../SellerProductPage';
import SellerReviewPage from '../../SellerReviewPage';
import SellerSettlementPage from '../../SellerSettlementPage';

export default function SellerDashboard() {
  return (
    <div className='flex min-h-screen pt-5 gap-5'>
      <div className='flex-1 '>
        <div className='mb-10'>
          <SellerPaymentPage />
        </div>
        <div className='mb-10'>
          <SellerProductPage />
        </div>
        <div className='mb-10'>
          <SellerInventoryPage mode={'main'} />
        </div>
        <div className='mb-10'>
          <SellerOrderPage />
        </div>
        <div className='mb-10'>
          <SellerSettlementPage />
        </div>
        <div className='mb-10'>
          <SellerReviewPage />
        </div>
      </div>
    </div>
  );
}
