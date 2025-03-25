import { useState } from "react";
import {
  IoEllipsisHorizontal,
  IoEyeOutline,
  IoAlertCircle,
} from "react-icons/io5";

/** 정산상태 컬러 라벨링 */
const getStatusClassName = (status) => {
  switch (status) {
    case '완료':
      return 'bg-green-100 text-green-800';
    case '대기':
      return 'bg-yellow-100 text-yellow-800';
    case '취소':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function SellerSettlementTable({ settlements }) {
  const [showDropdown, setShowDropdown] = useState(null);

  /** 필터 드롭다운 토글 */
  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[768px] w-full">
        <thead>
          <tr className="bg-[#F3F4F6] text-gray-600 text-sm">
            <th className="py-3 px-4 text-left font-medium">정산번호</th>
            <th className="py-3 px-4 text-left font-medium">정산기간</th>
            <th className="py-3 px-4 text-left font-medium">정산일</th>
            <th className="py-3 px-4 text-center font-medium">주문수</th>
            <th className="py-3 px-4 text-left font-medium">매출액</th>
            <th className="py-3 px-4 text-left font-medium">수수료</th>
            <th className="py-3 px-4 text-left font-medium">실 정산액</th>
            <th className="py-3 px-4 text-left font-medium">상태</th>
            <th className="py-3 px-4 text-center font-medium">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {settlements?.map((settlement) => (
            <tr key={settlement.settlementNumber} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm">{settlement.settlementNumber}</td>
              <td className="py-3 px-4 text-sm">{settlement.settlementPeriodStart} ~ {settlement.settlementDate}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{settlement.settlementDate}</td>
              <td className="py-3 px-4 text-sm text-center">{settlement.orderCount}건</td>
              <td className="py-3 px-4 text-sm">{settlement.salesAmount.toLocaleString()}원</td>
              <td className="py-3 px-4 text-sm">{settlement.commission.toLocaleString()}원</td>
              <td className="py-3 px-4 text-sm">{settlement.actualSettlementAmount.toLocaleString()}원</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusClassName(settlement.status)}`}
                >
                  {settlement.status}
                </span>
              </td>
              <td className="py-3 px-4 text-center relative">
                <button
                  onClick={() => toggleDropdown(settlement.settlementNumber)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoEllipsisHorizontal className="h-5 w-5" />
                </button>
                {showDropdown === settlement.settlementNumber && (
                  <div className="absolute right-12 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
                    <div className="py-1">
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        <IoEyeOutline className="mr-2 h-4 w-4" />
                        정산 상세보기
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        <IoAlertCircle className="mr-2 h-4 w-4" />
                        정산 취소
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
