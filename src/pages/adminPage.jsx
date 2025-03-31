import { Link } from "react-router-dom";  
import { BarChart3, Bell, CreditCard, FileText, Home, Package, Settings, Store, Users } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("verification");

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-[#1A2B3E] text-white md:flex">
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <Store className="mr-2 h-6 w-6" />
          <span className="font-bold">판매자 대시보드</span>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {[
              { icon: Home, text: "대시보드" },
              { icon: Store, text: "판매자 관리" },
              { icon: FileText, text: "사업자 인증" },
              { icon: CreditCard, text: "정산 관리" },
              { icon: Package, text: "상품 관리" },
              { icon: Users, text: "고객 관리" },
              { icon: BarChart3, text: "통계 분석" },
              { icon: Settings, text: "설정" },
            ].map(({ icon: Icon, text }) => (
              <Link
                key={text}
                to="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/70 transition-all hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {text}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col bg-[#F3F4F6]">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <button className="md:hidden p-2 border rounded-md">
            <Store className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold md:text-xl flex-1">판매자 대시보드</h1>
          <button className="p-2 border rounded-md">
            <Bell className="h-5 w-5" />
          </button>
          <button className="ml-auto p-2 border rounded-md">관리자 계정</button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">판매자 관리 대시보드</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">새 판매자 추가</button>
          </div>

          <div className="mt-6">
            {/* 탭 버튼 */}
            <div className="flex gap-4 border-b pb-2">
              {["verification", "settlement"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-t-md ${
                    activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "verification" ? "판매자 인증" : "정산 관리"}
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            {activeTab === "verification" ? (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">판매자 인증 관리</h3>
                <p className="text-sm text-gray-600">판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</p>
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">이름</th>
                      <th className="border p-2">사업자등록번호</th>
                      <th className="border p-2">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">홍길동</td>
                      <td className="border p-2">123-45-67890</td>
                      <td className="border p-2 text-green-600">승인됨</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">판매자 정산 관리</h3>
                <p className="text-sm text-gray-600">판매자 정산 처리 및 내역을 확인하세요.</p>
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">이름</th>
                      <th className="border p-2">정산 금액</th>
                      <th className="border p-2">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">이순신</td>
                      <td className="border p-2">₩1,500,000</td>
                      <td className="border p-2 text-yellow-600">보류</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
