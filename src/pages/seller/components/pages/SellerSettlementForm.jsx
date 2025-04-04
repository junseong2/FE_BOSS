import { IoClose } from 'react-icons/io5';

export default function SellerSettlementForm({ onCancel, onSubmit, isLoading }) {
  return (
    <div className='fixed left-0 right-0 top-0 bottom-0 flex items-center justify-center'>
      <div className='absolute left-0 right-0 top-0 bottom-0 bg-black opacity-60'></div>
      <div className='bg-white rounded-lg shadow p-6 mb-4 z-[100000000000]'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-medium mb-2'>정산 신청</h2>
          <button onClick={onCancel} className='hover:text-gray-600 cursor-pointer'>
            <IoClose />{' '}
          </button>
        </div>
        <p className='text-gray-600 mb-6'>
          정산 받으실 금액과 계좌 정보를 입력해주세요. 금일 신청 시 다음 달 15일에 정산처리됩니다.
        </p>

        <form onSubmit={onSubmit}>
          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>정산 금액</label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                ￦
              </span>
              <input
                type='text'
                name='amount'
                className='w-full px-8 py-2 border border-gray-300 rounded-md'
                placeholder='정산 금액을 입력하세요'
              />
            </div>
            <div className='mt-2 text-sm text-gray-600'>정산 가능 금액: ₩5,678,900</div>
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>은행</label>
            <div className='relative'>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white'
                name='bank'
              >
                <option>은행을 선택하세요</option>
                <option>신한은행</option>
                <option>국민은행</option>
                <option>우리은행</option>
                <option>하나은행</option>
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                <svg
                  className='w-4 h-4 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>계좌번호</label>
            <input
              type='text'
              name='account'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder="계좌번호를 입력하세요 ('-' 제외)"
            />
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>예금주</label>
            <input
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              name='name'
              placeholder='예금주명을 입력하세요'
            />
          </div>

          <button
            disabled={isLoading}
            type='submit'
            className='disabled:opacity-70 disabled:cursor-not-allowed w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors'
          >
            {isLoading ? '전송중' : '정산 신청하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
