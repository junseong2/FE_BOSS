import { useState, useEffect } from 'react';
import AdminContentHeader from "./components/common/AdminContentHeader";
import AdminTitle from "./components/common/AdminTitle";

function AdminSettlementPage() {
  const [search, setSearch] = useState(""); // 정산 번호 검색
  const [settlements, setSettlements] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING"); // 상태 필터 (기본: 대기)
  const [selectedSellerId, setSelectedSellerId] = useState(null); // 선택된 판매자 ID

  useEffect(() => {
    console.log("🟡 정산 목록 useEffect 실행됨");
    fetchSettlements();
  }, [statusFilter, selectedSellerId]);

  const fetchSettlements = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/settlements/admin/check?status=${statusFilter}&sellerId=${selectedSellerId || ""}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키로 JWT 보내야 함
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📦 정산 응답 데이터:", data);
        setSettlements(data || []); // 받아온 데이터로 상태 업데이트
      } else {
        console.error("정산 목록 로딩 실패");
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/settlements/admin/${id}/status?status=${newStatus}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );

      if (response.ok) {
        alert("상태가 업데이트되었습니다.");
        fetchSettlements(); // 최신 목록 다시 로딩
      } else {
        alert("상태 업데이트 실패");
      }
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-120">
      <header className="flex items-center justify-between w-full bg-white p-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-lg font-semibold md:text-xl">정산 관리 대시보드</h1>
      </header>

      <div className="flex-1 p-6">
        <AdminContentHeader>
          <AdminTitle type="main">정산 현황</AdminTitle>
        </AdminContentHeader>
        <p className="text-gray-600">판매자 정산 현황을 관리하세요.</p>

        {/* 필터링 기능 */}
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="정산번호를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchSettlements}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            필터
          </button>
        </div>

        {/* 상태 필터 */}
        <div className="mt-4">
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="PENDING">대기</option>
            <option value="COMPLETED">완료</option>
            <option value="REJECTED">거절</option>
          </select>
        </div>

        {/* 판매자 ID 필터 (optional)
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="판매자 ID"
            value={selectedSellerId || ""}
            onChange={(e) => setSelectedSellerId(e.target.value)}
          />
        </div> */}

        <div className="mt-6 border rounded-lg overflow-hidden">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="p-3 text-left">정산번호</th>
                <th className="p-3 text-left">신청일</th>
                <th className="p-3 text-left">정산액</th>
                <th className="p-3 text-left">상태</th>
                <th className="p-3 text-left">은행</th>
                <th className="p-3 text-left">예금주</th>
                <th className="p-3 text-left">계좌</th>
                <th className="p-3 text-left">관리</th>
              </tr>
            </thead>
            <tbody>
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    정산 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                settlements.map((settlement) => (
                  <tr key={settlement.settlementId} className="border-b hover:bg-gray-50">
                    <td className="p-3">{settlement.settlementId}</td>
                    <td className="p-3">{settlement.createdDate?.split("T")[0]}</td>
                    <td className="p-3">￦{settlement.requestedAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          settlement.status === "PENDING"
                            ? "bg-yellow-200 text-yellow-700"
                            : settlement.status === "PAID"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {settlement.status}
                      </span>
                    </td>
                    <td className="p-3">{settlement.bankName}</td>
                    <td className="p-3">{settlement.accountHolder}</td>
                    <td className="p-3">{settlement.accountNumber}</td>
                    <td className="p-3 flex gap-2">
                      {settlement.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(settlement.settlementId, "COMPLETED")}
                            className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded hover:bg-green-200"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(settlement.settlementId, "REJECTED")}
                            className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded hover:bg-red-200"
                          >
                            거절
                          </button>
                        </>
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
  );
}

export default AdminSettlementPage;
