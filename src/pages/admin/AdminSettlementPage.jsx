"use client"

import { useState, useEffect } from "react"
import AdminContentHeader from "./components/common/AdminContentHeader"
import AdminTitle from "./components/common/AdminTitle"

function AdminSettlementPage() {
  const [search, setSearch] = useState("") // 정산 번호 검색
  const [settlements, setSettlements] = useState([])
  const [statusFilter, setStatusFilter] = useState("PENDING") // 상태 필터 (기본: 대기)
  const [selectedSellerId, setSelectedSellerId] = useState(null) // 선택된 판매자 ID
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("🟡 정산 목록 useEffect 실행됨")
    fetchSettlements()
  }, [statusFilter, selectedSellerId])

  const fetchSettlements = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:5000/settlements/admin/check?status=${statusFilter}&sellerId=${selectedSellerId || ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키로 JWT 보내야 함
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log("📦 정산 응답 데이터:", data)
        setSettlements(data || []) // 받아온 데이터로 상태 업데이트
      } else {
        console.error("정산 목록 로딩 실패")
      }
    } catch (error) {
      console.error("API 호출 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/settlements/admin/${id}/status?status=${newStatus}`, {
        method: "PATCH",
        credentials: "include",
      })

      if (response.ok) {
        alert("상태가 업데이트되었습니다.")
        fetchSettlements() // 최신 목록 다시 로딩
      } else {
        alert("상태 업데이트 실패")
      }
    } catch (error) {
      console.error("상태 업데이트 실패:", error)
    }
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200"
      case "COMPLETED":
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200"
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "대기 중"
      case "COMPLETED":
      case "PAID":
        return "완료됨"
      case "REJECTED":
        return "거절됨"
      default:
        return status
    }
  }

  const filteredSettlements = settlements.filter((settlement) => {
    if (!search) return true
    return settlement.settlementId.toString().includes(search)
  })

  return (
    <div className="flex-1 max-w-7xl mx-auto">
      <div className="flex-1 px-6 py-8">
        <AdminContentHeader>
          <AdminTitle type="main">정산 현황</AdminTitle>
        </AdminContentHeader>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <p className="text-gray-800 font-medium text-base">판매자 정산 현황을 관리하세요.</p>
        </div>

        {/* 필터링 컨트롤 */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                정산 번호 검색
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="정산번호를 입력하세요"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                상태 필터
              </label>
              <select
                id="status"
                className="w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="PENDING">대기</option>
                <option value="COMPLETED">완료</option>
                <option value="REJECTED">거절</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchSettlements}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white px-5 py-3 rounded-lg transition-colors font-medium"
              >
                필터 적용
              </button>
            </div>
          </div>
        </div>

        {/* 정산 목록 테이블 */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    정산번호
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    정산액
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    은행
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    예금주
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    계좌
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-600 font-medium">
                      데이터를 불러오는 중...
                    </td>
                  </tr>
                ) : filteredSettlements.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-600 font-medium">
                      정산 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredSettlements.map((settlement) => (
                    <tr key={settlement.settlementId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {settlement.settlementId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {settlement.createdDate?.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        ￦{settlement.requestedAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                            settlement.status,
                          )}`}
                        >
                          {getStatusText(settlement.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{settlement.bankName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{settlement.accountHolder}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {settlement.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {settlement.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(settlement.settlementId, "COMPLETED")}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(settlement.settlementId, "REJECTED")}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                            >
                              거절
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettlementPage
