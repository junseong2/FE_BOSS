import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';

/** 결제 상태 컬러 라벨링 */
const getStatusClassName = (status) => {
  switch (status) {
    case '결제완료':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function SellerPaymentsTable({ payments }) {
  const [showDropdown, setShowDropdown] = useState(null);

  /** 필터 드롭다운 토글 */
  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full'>
        <thead>
          <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
            <th className='py-3 px-4 text-left font-medium'>결제번호</th>
            <th className='py-3 px-4 text-left font-medium'>주문번호</th>
            <th className='py-3 px-4 text-left font-medium'>고객명</th>
            <th className='py-3 px-4 text-left font-medium'>결제일자</th>
            <th className='py-3 px-4 text-left font-medium'>결제방법</th>
            <th className='py-3 px-4 text-left font-medium'>결제정보</th>
            <th className='py-3 px-4 text-left font-medium'>금액</th>
            <th className='py-3 px-4 text-left font-medium'>상태</th>
            <th className='py-3 px-4 text-center font-medium'>관리</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {payments.map((payment) => (
            <tr key={payment.paymentId} className='hover:bg-gray-50'>
              <td className='py-3 px-4 text-sm'>{payment.paymentId}</td>
              <td className='py-3 px-4 text-sm'>{payment.orderId}</td>
              <td className='py-3 px-4 text-sm font-medium text-black'>{payment.customerName}</td>
              <td className='py-3 px-4 text-sm text-gray-700'>{payment.paymentDate}</td>
              <td className='py-3 px-4 text-sm'>{payment.paymentMethod}</td>
              <td className='py-3 px-4 text-sm'>{payment.paymentInfo}</td>
              <td className='py-3 px-4 text-sm font-medium'>₩{payment.amount.toLocaleString()}</td>
              <td className='py-3 px-4'>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusClassName(payment.status)}`}
                >
                  {payment.status}
                </span>
              </td>
              <td className='py-3 px-4 text-center relative'>
                <button
                  onClick={() => toggleDropdown(payment.paymentId)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <IoEllipsisHorizontal className='h-5 w-5' />
                </button>
                {showDropdown === payment.paymentId && (
                  <div className='absolute right-12 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg'>
                    <div className='py-1'>
                      <button className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
                        결제 상세보기
                      </button>
                      <button className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
                        환불 처리
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
