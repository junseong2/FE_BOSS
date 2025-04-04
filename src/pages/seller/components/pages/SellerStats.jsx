import { AlertTriangle, ShoppingBag } from "lucide-react";

export default function SellerStats({ stat }) {
  const { sales, order, inventory } = stat;
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      {/* Today's Sales */}
      <div className='bg-white p-6 border border-gray-200'>
        <div className='flex justify-between items-start mb-4'>
          <span className='text-gray-500 text-sm'>오늘 매출</span>
          <button className='text-gray-400'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
          </button>
        </div>
        <div className='mb-2'>
          <span className='text-2xl font-bold'>₩1,254,000</span>
          <span className='text-green-500 ml-2 text-sm'>+12.5%</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div className='bg-gray-800 h-2 rounded-full' style={{ width: '78%' }}></div>
        </div>
        <div className='mt-1 text-xs text-gray-500'>목표의 78%</div>
      </div>

      {/* Today's Orders */}
      <div className='bg-white p-6  border border-gray-200'>
        <div className='flex justify-between items-start mb-4'>
          <span className='text-gray-500 text-sm'>오늘 주문액</span>
          <button className='text-gray-400'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
          </button>
        </div>
        <div className='mb-2'>
          <span className='text-2xl font-bold'>₩376,200</span>
          <span className='text-green-500 ml-2 text-sm'>+8.2%</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div className='bg-gray-800 h-2 rounded-full' style={{ width: '65%' }}></div>
        </div>
        <div className='mt-1 text-xs text-gray-500'>목표의 65%</div>
      </div>

      {/* Orders Count */}
      <div className='bg-white p-6  border border-gray-200'>
        <div className='flex justify-between items-start mb-4'>
          <span className='text-gray-500 text-sm'>주문 건수</span>
          <button className='text-gray-400'>
            <ShoppingBag className='w-5 h-5' />
          </button>
        </div>
        <div className='mb-2'>
          <span className='text-2xl font-bold'>86건</span>
          <span className='text-green-500 ml-2 text-sm'>+5.1%</span>
        </div>
        <div className='text-sm text-gray-500'>평균 주문액: ₩14,580</div>
      </div>

      {/* Inventory Alerts */}
      <div className='bg-white p-6  border border-gray-200'>
        <div className='flex justify-between items-start mb-4'>
          <span className='text-gray-500 text-sm'>재고 알림</span>
          <button className='text-gray-400'>
            <AlertTriangle className='w-5 h-5 text-red-500' />
          </button>
        </div>
        <div className='mb-2'>
          <span className='text-2xl font-bold'>3개</span>
        </div>
        <div className='text-sm text-gray-500'>생수, 우유, 라면</div>
        <div className='mt-2'>
          <button className='text-sm text-blue-600 hover:underline'>알림보기</button>
        </div>
      </div>
    </div>
  );
}
