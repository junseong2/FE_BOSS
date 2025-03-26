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

export default function SellerPaymentsTable({ payments, paymentMethods }) {
  const [showDropdown, setShowDropdown] = useState(null);

  /** 영어로 작성된 상태를 한글로 */
  function getPaymentLabel(status) {
    const method = paymentMethods.find(item => item.paymentStatus === status);
    return method ? method.key : '보류'; // 일치하는 키가 없으면 기본값 반환
  }

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
            <th className='py-3 px-4 text-left font-medium'>고객명</th>
            <th className='py-3 px-4 text-left font-medium'>결제일자</th>
            <th className='py-3 px-4 text-left font-medium'>결제방법</th>
            <th className='py-3 px-4 text-left font-medium'>금액</th>
            <th className='py-3 px-4 text-left font-medium'>상태</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {payments?.map((payment) => {

            const paymentStatus = getPaymentLabel(payment.paymentStatus)
            return (
              <tr key={payment.impUid} className='hover:bg-gray-50'>
                <td className='py-3 px-4 text-sm'>{payment.impUid}</td>
                <td className='py-3 px-4 text-sm font-medium text-black'>{payment.username}</td>
                <td className='py-3 px-4 text-sm text-gray-700'>{payment.paidDate}</td>
                <td className='py-3 px-4 text-sm'>{payment.paymentMethod}</td>
                <td className='py-3 px-4 text-sm font-medium'>
                  ₩{payment.totalAmount?.toLocaleString()}
                </td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusClassName(paymentStatus)}`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
