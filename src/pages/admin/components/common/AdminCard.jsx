export function AdminCardLayout({ children }) {
  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-4 max-w-full sm:grid-cols-2  md:grid-cols- lg:grid-cols-4'>{children}</div>
  );
}

export function AdminCard({ title, amount, status, bgColor }) {
  return (
    <div className={`${bgColor} grid w-full max-w-[400px] grid-cols-1 border border-gray-200 p-5`}>
      <span className='text-sm text-gray-500'>{title}</span>
      <strong className='py-1.5'>{amount}</strong>
      <span className='text-sm text-gray-500'>{status}</span>
    </div>
  );
}
