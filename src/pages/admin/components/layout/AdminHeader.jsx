function AdminHeader({ title, children }) {
  return (
    <header className="flex items-center justify-between w-full bg-white p-4 border-b border-gray-200 shadow-sm">
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}

export default AdminHeader;
