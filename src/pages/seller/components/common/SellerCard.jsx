export function SellerCardLayout({ children }) {
  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-4 max-w-full sm:grid-cols-3'>{children}</div>
  );
}

export function SellerCard({ title, amount, status }) {
  return (
    <div className='grid w-full max-w-[400px] grid-cols-1 rounded-lg border border-gray-300 p-5'>
      <span className='text-sm text-gray-500'>{title}</span>
      <strong className='py-1.5'>{amount}</strong>
      <span className='text-sm text-gray-500'>{status}</span>
    </div>
  );
}
