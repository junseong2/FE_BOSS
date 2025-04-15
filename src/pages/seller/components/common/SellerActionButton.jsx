function SellerActionButton({ children, onClick, disabled = false }) {
  return (
    <button
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default SellerActionButton
