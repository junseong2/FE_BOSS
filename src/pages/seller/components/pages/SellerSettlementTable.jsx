import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatLocalDate } from '../../../../utils/formatter';

export default function SellerSettlementTable({ settlements }) {
  // 정산 상태에 따른 배지 스타일 및 아이콘
  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          text: "완료",
          className: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
        }
      case "REJECTED":
        return {
          text: "거절",
          className: "bg-red-100 text-red-800",
          icon: <XCircle className="w-3 h-3 mr-1" />,
        }
      case "PENDING":
        return {
          text: "대기중",
          className: "bg-amber-100 text-amber-800",
          icon: <Clock className="w-3 h-3 mr-1" />,
        }
      default:
        return {
          text: "알 수 없음",
          className: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
        }
    }
  }

  // 금액 포맷팅
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">
              정산 ID
            </th>
            <th scope="col" className="px-4 py-3">
              은행
            </th>
            <th scope="col" className="px-4 py-3">
              계좌번호
            </th>
            <th scope="col" className="px-4 py-3">
              예금주
            </th>
            <th scope="col" className="px-4 py-3">
              금액
            </th>
            <th scope="col" className="px-4 py-3">
              상태
            </th>
            <th scope="col" className="px-4 py-3">
              신청일
            </th>
            <th scope="col" className="px-4 py-3">
              완료일
            </th>
          </tr>
        </thead>
        <tbody>
          {settlements.map((settlement) => {
            const statusBadge = getStatusBadge(settlement.status)
            return (
              <tr key={settlement.settlementId} className="bg-white border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{settlement.settlementId}</td>
                <td className="px-4 py-3">{settlement.bank}</td>
                <td className="px-4 py-3">{settlement.accountNum}</td>
                <td className="px-4 py-3">{settlement.name}</td>
                <td className="px-4 py-3">{settlement.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                  >
                    {statusBadge.icon}
                    {statusBadge.text}
                  </span>
                </td>
                <td className="px-4 py-3">{formatLocalDate(settlement.requestDate)}</td>
                <td className="px-4 py-3">{formatLocalDate(settlement.settleDate)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
