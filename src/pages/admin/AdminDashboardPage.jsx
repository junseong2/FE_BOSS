import { useState, useEffect } from "react";
import AdminTabs from "./components/common/AdminTabs";
import AdminVerification from "./AdminVerificationPage";
import AdminSettlement from "./AdminSettlementPage";
import { AdminCard, AdminCardLayout } from "./components/common/AdminCard";
import AdminHeader from "./components/layout/AdminHeader";

export default function AdminDashboardPage() {
  const [selectedTab, setSelectedTab] = useState("AdminVerification");

  // 판매자 통계
  const [sellerStats, setSellerStats] = useState({
    totalSellers: 0,
    waitingApproval: 0,
    approved: 0,
    rejected: 0,
  });

  // 정산 통계
  const [settlementStats, setSettlementStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchSellerStats();
    fetchSettlementStats();
  }, []);

  const fetchSellerStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/seller/seller-stats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSellerStats(data);
      } else {
        console.error("판매자 통계 로딩 실패");
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  };

  const fetchSettlementStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/settlements/admin/stats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSettlementStats(data);
      } else {
        console.error("정산 통계 로딩 실패");
      }
    } catch (error) {
      console.error("정산 통계 API 호출 실패:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <AdminHeader title="관리자 대시보드">
        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
          <span className="sr-only">알림</span>
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
          관리자 계정
        </button>
      </AdminHeader>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            새 판매자 추가
          </button> */}
        </div>

        {/* ✅ 선택된 탭에 따라 설명 변경 */}
        {selectedTab === "AdminVerification" ? (
          <h3>판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</h3>
        ) : (
          <h3>판매자의 정산 요청 현황을 관리하세요.</h3>
        )}

        {/* ✅ 선택된 탭에 따라 통계 카드 변경 */}
        <AdminCardLayout>
          {selectedTab === "AdminVerification" ? (
            <>
              <AdminCard title="누적 신청자" amount={sellerStats.totalSellers} description="운영 중" />
              <AdminCard title="인증 대기" amount={sellerStats.waitingApproval} description="인증 대기" />
              <AdminCard title="인증 완료" amount={sellerStats.approved} description="인증 완료" />
              <AdminCard title="인증 거절" amount={sellerStats.rejected} description="인증 거부" />
            </>
          ) : (
            <>
              <AdminCard title="전체 정산 요청" amount={settlementStats.totalSettlements} description="누적" />
              <AdminCard title="정산 대기" amount={settlementStats.pending} description="처리 대기" />
              <AdminCard title="정산 완료" amount={settlementStats.completed} description="처리 완료" />
              <AdminCard title="정산 거절" amount={settlementStats.rejected} description="요청 거부" />
            </>
          )}
        </AdminCardLayout>

        <AdminTabs
          tabList={[
            { key: "AdminVerification", label: "판매자 인증 관리" },
            { key: "AdminSettlement", label: "정산 관리" },
          ]}
          selectedTab={selectedTab}
          onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
        />

        <div className="bg-white w-full mt-0 border border-gray-200 p-3">
          {selectedTab === "AdminVerification" ? <AdminVerification /> : <AdminSettlement />}
        </div>
      </div>
    </div>
  );
}
