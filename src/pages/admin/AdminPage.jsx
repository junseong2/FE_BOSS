import AdminContent from './components/common/AdminContent';
import AdminSideBar from './components/layout/AdminSideBar';

export default function AdminPage() {
  return (
    <section className="flex h-screen w-full overflow-hidden bg-gray-50">
      <AdminSideBar />
      <div className="flex-1 overflow-auto">
        <AdminContent />
      </div>
    </section>
  );
}

