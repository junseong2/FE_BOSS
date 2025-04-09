{isSellerModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">판매업 등록</h2>
        <button
          className="text-2xl text-gray-500 hover:text-gray-800"
          onClick={() => setIsSellerModalOpen(false)}
        >
          &times;
        </button>
      </div>
      <div className="p-4">
        <SellerSignUpPage onClose={() => setIsSellerModalOpen(false)} />
      </div>
    </div>
  </div>
)}
