import { useState } from 'react';
import {
  IoAlertCircle,
  IoCarOutline,
  IoCheckmarkCircleOutline,
  IoEllipsisHorizontal,
  IoEyeOutline,
} from 'react-icons/io5';

/** 주문상태 컬러 라벨링 */
const getStatusClassName = (status) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-purple-100 text-purple-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
  }
};

export default function SellerOrderTable({ orders }) {
  const [showDropdown, setShowDropdown] = useState(null);

  /** 필터 드롭다운 토글 */
  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-[812px] w-full'>
        <thead>
          <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
            <th className='py-3 px-4 text-left font-medium'>주문번호</th>
            <th className='py-3 px-4 text-left font-medium'>고객명</th>
            <th className='py-3 px-4 text-left font-medium'>주문일자</th>
            <th className='py-3 px-4 text-center font-medium'>상품수</th>
            <th className='py-3 px-4 text-left font-medium'>결제방법</th>
            <th className='py-3 px-4 text-left font-medium'>금액</th>
            <th className='py-3 px-4 text-left font-medium'>주문상태</th>
            <th className='py-3 px-4 text-center font-medium'>관리</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {orders?.map((order) => (
            <tr key={order.id} className='hover:bg-gray-50'>
              <td className='py-3 px-4 text-sm'>{'ORD-' + order.orderId}</td>
              <td className='py-3 px-4 text-sm font-medium text-black'>{order.username}</td>
              <td className='py-3 px-4 text-sm text-gray-700'>{order.createdDate}</td>
              <td className='py-3 px-4 text-sm text-center'>{order.orderCount}개</td>
              <td className='py-3 px-4 text-sm'>{order.paymentMethod}</td>
              <td className='py-3 px-4 text-sm font-medium'>{order.totalPrice}</td>
              <td className='py-3 px-4'>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusClassName(order.status)}`}
                >
                  {order.status}
                </span>
              </td>
              <td className='py-3 px-4 text-center relative'>
                {order.id === 'ORD-1234' ||
                order.id === 'ORD-1237' ||
                order.id === 'ORD-1238' ||
                order.id === 'ORD-1240' ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(order.id)}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      <IoEllipsisHorizontal className='h-5 w-5' />
                    </button>
                    {showDropdown === order.id && (
                      <div className='absolute right-12 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg'>
                        <div className='py-1'>
                          <button className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
                            <IoEyeOutline className='mr-2 h-4 w-4' />
                            주문 상세보기
                          </button>
                          <button className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
                            <IoCarOutline className='mr-2 h-4 w-4' />
                            배송 상태 변경
                          </button>
                          <button className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
                            <IoCheckmarkCircleOutline className='mr-2 h-4 w-4' />
                            주문 정보 처리
                          </button>
                          <button className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
                            <IoAlertCircle className='mr-2 h-4 w-4' />
                            주문 취소
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button className='text-gray-400 hover:text-gray-600'>
                    <IoEllipsisHorizontal className='h-5 w-5' />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
