import { IoAlertCircle, IoEyeOutline } from 'react-icons/io5';

export default function SellerOrderDropdown({ orderId, onToggle,onFetch, onCancel }) {
  return (
    <div className='absolute right-12 z-10 mt-2 w-48 bg-white border border- rounded-md shadow-lg'>
      <div className='py-1'>
        <button
          onClick={()=>{
            onToggle()
            onFetch(orderId) // 해당 주문 id의 주문 상세 정보를 조회한다.

          }}
          className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
        >
          <IoEyeOutline className='mr-2 h-4 w-4' />
          주문 상세보기
        </button>
        <button
          onClick={onCancel}
          className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
        >
          <IoAlertCircle className='mr-2 h-4 w-4' />
          주문 취소
        </button>
      </div>
    </div>
  );
}
