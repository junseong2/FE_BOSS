function SellerActionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className='py-2 flex items-center justify-center gap-1.5 border-none bg-[#1A2B3E] text-white font-normal text-sm px-2 py-1 rounded-md w-25 hover:bg-[#1a2b3ee1] cursor-pointer'
    >
      {children}
    </button>
  );
}

export default SellerActionButton;
