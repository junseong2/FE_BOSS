import { Outlet } from 'react-router';

function SellerContent() {
  return (
    <section className={'p-5'}>
      <Outlet />
    </section>
  );
}

export default SellerContent;
