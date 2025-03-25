import SellerContent from './components/common/SellerContent';
import SellerSideBar from './components/layout/SellerSideBar';

function SellerPage() {
  return (
    <section className='absolute left-0 top-0 flex text-left w-full h-screen'>
      <SellerSideBar />

      <div className='w-full'>
        <SellerContent />
      </div>
    </section>
  );
}

export default SellerPage;
