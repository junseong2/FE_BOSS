import { useState } from 'react';
import { formatLocalDate } from '../../../../utils/formatter';

/** 정산상태 컬러 라벨링 */
const getStatusClassName = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-yellow-100 text-yellow-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const settleStatus = [
  { key: 'PENDING', label: '정산요청' },
  { key: 'COMPLETED', label: '정산완료' },
  { key: 'REJECTED', label: '취소/거절' },
];

export default function SellerSettlementTable({ settlements }) {


  /** 영어로 작성된 상태를 한글로 */
  function getLabel(status) {
    const method = settleStatus.find((item) => item.key === status);
    return method ? method.label : '보류'; // 일치하는 키가 없으면 기본값 반환
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-[1024px] w-full'>
        <thead>
          <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
            <th className='py-3 px-4 text-left font-medium'>정산번호</th>
            <th className='py-3 px-4 text-left font-medium'>신청일</th>
            <th className='py-3 px-4 text-left font-medium'>정산일</th>
            <th className='py-3 px-4 text-left font-medium'>정산액</th>
            <th className='py-3 px-4 text-left font-medium'>상태</th>
            <th className='py-3 px-4 text-left font-medium'>은행</th>
            <th className='py-3 px-4 text-left font-medium'>예금주</th>
            <th className='py-3 px-4 text-left font-medium'>계좌</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          
          { settlements.length>0 ?
          
          settlements?.map((settlement) => (
            <tr key={settlement.settlementId} className='hover:bg-gray-50'>
              <td className='py-3 px-4 text-sm'>SETTLE-{settlement.settlementId}</td>
              <td className='py-3 px-4 text-sm'>{formatLocalDate(settlement.requestDate)}</td>
              <td className='py-3 px-4 text-sm text-gray-700'>
                {formatLocalDate(settlement.settleDate)}
              </td>
              <td className='py-3 px-4 text-sm'>￦ {settlement.totalAmount.toLocaleString()}</td>
              <td className='py-3 px-4'>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusClassName(settlement.status)}`}
                >
                  {getLabel(settlement.status)}
                </span>
              </td>
              <td className='py-3 px-4 text-sm'>{settlement.bank}</td>
              <td className='py-3 px-4 text-sm'>{settlement.name}</td>
              <td className='py-3 px-4 text-sm'>{settlement.accountNum}</td>
            </tr>
          )):
          <p className='text-gray-500 p-3 mt-3'>조회할 정산 목록이 없습니다.</p>
          }
        </tbody>
      </table>
    </div>
  );
}
