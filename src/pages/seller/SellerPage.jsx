import { useLocation } from 'react-router';
import SellerContent from './components/common/SellerContent';
import SellerHeader from './components/layout/SellerHeader';
import SellerSideBar from './components/layout/SellerSideBar';

function SellerPage() {
  const location = useLocation();

  const title = mappingSellerPageTitle(location.pathname)
  return (
    <section className='absolute left-0 top-0 flex text-left w-full h-screen'>
      <SellerSideBar />

      <div className='w-full'>
        <SellerHeader title={title}>

        </SellerHeader>
        <SellerContent />
      </div>
    </section>
  );
}

export default SellerPage;


/**판매자 대시보드 페이지  */
function mappingSellerPageTitle(pathname){
  let pageTitle='';

  switch(pathname){
    case '/seller/product':
      pageTitle='상품관리'
      break;
    case '/seller/order':
      pageTitle='주문관리'
      break;
    case '/seller/settlement':
      pageTitle='정산관리'
      break;
    case '/seller/inventory':
      pageTitle='재고관리'
      break;
    case '/seller/payment':
      pageTitle='매출관리'
      break;
    default:
      pageTitle='대시보드'
  }
  return pageTitle;
}
