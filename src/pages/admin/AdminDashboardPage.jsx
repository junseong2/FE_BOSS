import { useState, useEffect } from "react";
import AdminTabs from "./components/common/AdminTabs";
import AdminVerification from "./AdminVerificationPage";
import AdminSettlement from "./AdminSettlementPage";
import { AdminCard, AdminCardLayout } from "./components/common/AdminCard";
import AdminHeader from "./components/layout/AdminHeader";

export default function AdminDashboardPage() {
  const [selectedTab, setSelectedTab] = useState("AdminVerification");
  const [stats, setStats] = useState({
    totalSellers: 0,
    waitingApproval: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    // API 호출
    const fetchSellerStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/seller/seller-stats', {
          method: 'GET',  // GET 방식으로 변경
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);  // 받아온 데이터로 상태 업데이트
        } else {
          console.error('판매자 통계 로딩 실패');
        }
      } catch (error) {
        console.error('API 호출 실패:', error);
      }
    };

    fetchSellerStats();
  }, []);


  return (
    <div className="flex flex-col bg-gray-100">
      {/* ✅ 헤더 */}
      <AdminHeader title="관리자 대시보드">
        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
          <span className="sr-only">알림</span>
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
          관리자 계정
        </button>
      </AdminHeader>

      {/* ✅ 메인 콘텐츠 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            새 판매자 추가
          </button>
        </div>
        <h3>판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</h3>

        {/* ✅ 통계 카드 */}
        <AdminCardLayout>
          <AdminCard title="누적 신청자" amount={stats.totalSellers} description="운영 중" />
          <AdminCard title="인증 대기" amount={stats.waitingApproval} description="인증 대기" />
          <AdminCard title="인증 완료" amount={stats.approved} description="인증 완료" />
          <AdminCard title="인증 거절" amount={stats.rejected} description="인증 거부" />
        </AdminCardLayout>

        {/* ✅ 탭 메뉴 */}
        <AdminTabs
          tabList={[
            { key: "AdminVerification", label: "판매자 인증 관리" },
            { key: "AdminSettlement", label: "정산 관리" },
          ]}
          selectedTab={selectedTab}
          onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
        />

        {/* ✅ 컨텐츠 영역 */}
        <div className="bg-white w-full mt-0 border border-gray-200 p-3 ">
          {selectedTab === "AdminVerification" ? <AdminVerification /> : <AdminSettlement />}
        </div>

      </div>
    </div>
  );
}
