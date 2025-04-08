import SellerTitle from './components/common/SellerTitle';
import SellerDashboard from './components/pages/SellerDashboard';

function SellerDashboardPage() {
  return (
    <section className='bg-[#f3f4f6] min-h-screen h-auto p-3 border border-gray-200 rounded-[5px] w-full'>
      <SellerTitle type={'main'}>대시보드</SellerTitle>
      <SellerDashboard/>
    </section>
  );
}

export default SellerDashboardPage;
