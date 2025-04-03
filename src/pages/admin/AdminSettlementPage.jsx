import { useState, useEffect } from 'react';
import AdminContentHeader from "./components/common/AdminContentHeader";
import AdminTitle from "./components/common/AdminTitle";

function AdminSettlementPage() {
  const [search, setSearch] = useState("");  // 검색어 상태
  const [settlements, setSettlements] = useState([]);  // 정산 목록 상태

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/settlements?page=0&size=20&settlementId=${search}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSettlements(data.settlements);
        } else {
          console.error("정산 목록 로딩 실패");
        }
      } catch (error) {
        console.error("API 호출 실패:", error);
      }
    };
  
    fetchSettlements();
  }, [search]);

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

        <div className="flex gap-3 mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="정산번호를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">필터</button>
        </div>

        {/* 정산 목록 테이블 */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="p-3 text-left text-gray-700">정산번호</th>
                <th className="p-3 text-left text-gray-700">신청일</th>
                <th className="p-3 text-left text-gray-700">정산일</th>
                <th className="p-3 text-left text-gray-700">정산액</th>
                <th className="p-3 text-left text-gray-700">상태</th>
                <th className="p-3 text-left text-gray-700">은행</th>
                <th className="p-3 text-left text-gray-700">예금주</th>
                <th className="p-3 text-left text-gray-700">계좌</th>
                <th className="p-3 text-left text-gray-700">관리</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((settlement) => (
                <tr key={settlement.settlement_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{settlement.settlement_id}</td>
                  <td className="p-3">{settlement.created_date}</td>
                  <td className="p-3">{settlement.settlement_date}</td>
                  <td className="p-3">￦{settlement.requested_amount}</td>
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
                  <td className="p-3">{settlement.bank}</td>
                  <td className="p-3">{settlement.account_holder}</td>
                  <td className="p-3">{settlement.account_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminSettlementPage;
