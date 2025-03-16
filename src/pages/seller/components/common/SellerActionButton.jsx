function SellerActionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center justify-center gap-1.5 border-none bg-[#4294F2] text-white font-normal text-sm px-2 py-1 rounded-md w-28 hover:bg-[#2780E6] cursor-pointer'
    >
      {children}
    </button>
  );
}

export default SellerActionButton;
