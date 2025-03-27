import { useState } from "react";
import AdminContentHeader from "./components/common/AdminContentHeader";
import AdminTitle from "./components/common/AdminTitle";

function AdminSettlementPage() {
  const [search, setSearch] = useState("");

  const sellers = [
    { id: "S001", name: "디지털 마트", owner: "김철수", regNumber: "123-45-67890", status: "대기", date: "2023-05-15" },
    { id: "S002", name: "패션스토어", owner: "이영희", regNumber: "234-56-78901", status: "완료", date: "2023-05-10" },
    { id: "S003", name: "홈리빙샵", owner: "박지민", regNumber: "345-67-89012", status: "거부", date: "2023-05-08" },
  ];

  return (
    <div className="flex flex-col bg-gray-120">
      {/* ✅ 헤더 */}
      <header className="flex items-center justify-between w-full bg-white p-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-lg font-semibold md:text-xl">판매자 대시보드</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <span className="sr-only">알림</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
            관리자 계정
          </button>
        </div>
      </header>

      {/* ✅ 메인 컨텐츠 */}
      <div className="flex-1 p-6">
        {/* ✅ 페이지 제목 */}
        <AdminContentHeader>
          <AdminTitle type="main">판매자 인증 관리</AdminTitle>
        </AdminContentHeader>
        <p className="text-gray-600">판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</p>

        {/* ✅ 검색 필터 */}
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="판매자 이름 또는 사업자번호 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">필터</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">새 판매자 추가</button>
        </div>

        {/* ✅ 판매자 인증 목록 */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="p-3 text-left text-gray-700">판매자 ID</th>
                <th className="p-3 text-left text-gray-700">상점 이름</th>
                <th className="p-3 text-left text-gray-700">대표자</th>
                <th className="p-3 text-left text-gray-700">사업자등록번호</th>
                <th className="p-3 text-left text-gray-700">상태</th>
                <th className="p-3 text-left text-gray-700">제출일</th>
                <th className="p-3 text-left text-gray-700">관리</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{seller.id}</td>
                  <td className="p-3">{seller.name}</td>
                  <td className="p-3">{seller.owner}</td>
                  <td className="p-3">{seller.regNumber}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${seller.status === "대기"
                          ? "bg-yellow-200 text-yellow-700"
                          : seller.status === "완료"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                    >
                      인증 {seller.status}
                    </span>
                  </td>
                  <td className="p-3">{seller.date}</td>
                  <td className="p-3">
                    <button className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100">🔍</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> {/* ✅ 메인 컨텐츠 닫힘 */}
    </div>
  );
}

export default AdminSettlementPage;
