import AdminContent from './components/common/AdminContent';
import AdminSideBar from './components/layout/AdminSideBar';

function AdminPage() {
  return (
    <section className='absolute left-0 top-0 flex text-left w-full h-screen'>
      <AdminSideBar />

      <div className='w-full'>
        <AdminContent />
      </div>
    </section>
  );
}

export default AdminPage;
