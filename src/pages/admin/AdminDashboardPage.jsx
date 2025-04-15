"use client"

import { useState, useEffect } from "react"
import AdminTabs from "./components/common/AdminTabs"
import AdminVerification from "./AdminVerificationPage"
import AdminSettlement from "./AdminSettlementPage"
import { AdminCard, AdminCardLayout } from "./components/common/AdminCard"
import AdminHeader from "./components/layout/AdminHeader"

export default function AdminDashboardPage() {
  const [selectedTab, setSelectedTab] = useState("AdminVerification")

  // 판매자 통계
  const [sellerStats, setSellerStats] = useState({
    totalSellers: 0,
    waitingApproval: 0,
    approved: 0,
    rejected: 0,
  })

  // 정산 통계
  const [settlementStats, setSettlementStats] = useState({
    totalSettlements: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
  })

  useEffect(() => {
    fetchSellerStats()
    fetchSettlementStats()
  }, [])

  const fetchSellerStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/seller/seller-stats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setSellerStats(data)
      } else {
        console.error("판매자 통계 로딩 실패")
      }
    } catch (error) {
      console.error("API 호출 실패:", error)
    }
  }

  const fetchSettlementStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/settlements/admin/stats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setSettlementStats(data)
      } else {
        console.error("정산 통계 로딩 실패")
      }
    } catch (error) {
      console.error("정산 통계 API 호출 실패:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="관리자 대시보드">
        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {(sellerStats.waitingApproval > 0 || settlementStats.pending > 0) && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
          )}
          <span className="sr-only">알림</span>
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            관
          </div>
          관리자 계정
        </button>
      </AdminHeader>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
            {/* 선택된 탭에 따라 설명 변경 */}
            {selectedTab === "AdminVerification" ? (
              <h3 className="text-gray-600 mt-1 text-sm">판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</h3>
            ) : (
              <h3 className="text-gray-600 mt-1 text-sm">판매자의 정산 요청 현황을 관리하세요.</h3>
            )}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white shadow-sm hover:bg-gray-50">
              데이터 내보내기
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90">
              보고서 생성
            </button>
          </div>
        </div>

        {/* 선택된 탭에 따라 통계 카드 변경 */}
        <AdminCardLayout>
          {selectedTab === "AdminVerification" ? (
            <>
              <AdminCard
                title="누적 신청자"
                amount={sellerStats.totalSellers}
                description="운영 중"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
              <AdminCard
                title="인증 대기"
                amount={sellerStats.waitingApproval}
                description="인증 대기"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                badge={sellerStats.waitingApproval > 0 ? "new" : undefined}
              />
              <AdminCard
                title="인증 완료"
                amount={sellerStats.approved}
                description="인증 완료"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
              <AdminCard
                title="인증 거절"
                amount={sellerStats.rejected}
                description="인증 거부"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
            </>
          ) : (
            <>
              <AdminCard
                title="전체 정산 요청"
                amount={settlementStats.totalSettlements}
                description="누적"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
              <AdminCard
                title="정산 대기"
                amount={settlementStats.pending}
                description="처리 대기"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                badge={settlementStats.pending > 0 ? "new" : undefined}
              />
              <AdminCard
                title="정산 완료"
                amount={settlementStats.completed}
                description="처리 완료"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
              <AdminCard
                title="정산 거절"
                amount={settlementStats.rejected}
                description="요청 거부"
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
            </>
          )}
        </AdminCardLayout>

        <AdminTabs
          tabList={[
            {
              key: "AdminVerification",
              label: "판매자 인증 관리",
              badge: sellerStats.waitingApproval > 0 ? sellerStats.waitingApproval : undefined,
            },
            {
              key: "AdminSettlement",
              label: "정산 관리",
              badge: settlementStats.pending > 0 ? settlementStats.pending : undefined,
            },
          ]}
          selectedTab={selectedTab}
          onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
        />

        <div className="bg-white w-full mt-0 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">{selectedTab === "AdminVerification" ? <AdminVerification /> : <AdminSettlement />}</div>
        </div>
      </div>
    </div>
  )
}
