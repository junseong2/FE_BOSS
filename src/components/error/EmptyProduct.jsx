export default function EmptyProduct() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-50'>
      <div className='text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-lg'>
        <div className='w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center'>
          <svg
            className='w-10 h-10 text-blue-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>상품을 찾을 수 없습니다</h2>
        <p className='text-gray-600 mb-6'>
          요청하신 상품 정보를 불러올 수 없습니다. 다시 시도해주세요.
        </p>
        <button
          onClick={() => window.history.back()}
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
