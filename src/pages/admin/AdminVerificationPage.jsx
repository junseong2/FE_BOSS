import { useEffect, useState } from "react";
import axios from "axios";
import AdminContentHeader from "./components/common/AdminContentHeader";
import AdminTitle from "./components/common/AdminTitle";
import AdminHeader from "./components/layout/AdminHeader";

function AdminVerificationPage() {
  const [search, setSearch] = useState("");
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/seller/all");
      setSellers(response.data);
    } catch (error) {
      console.error("판매자 목록 가져오기 실패", error);
    }
  };

  const handleApprove = async (seller) => {
    try {
      await axios.patch(`http://localhost:5000/seller/${seller.sellerId}/approve`);
      await axios.patch(`http://localhost:5000/auth/users/${seller.userId}/update-seller?storename=${seller.storename}`);
      alert("승인 완료!");
      setShowModal(false);
      fetchSellers();
    } catch (error) {
      console.error("승인 실패", error);
    }
  };

  const handleReject = async (seller) => {
    try {
      await axios.patch(`http://localhost:5000/seller/${seller.sellerId}/reject`);
      await axios.patch(`http://localhost:5000/auth/users/${seller.userId}/reject-seller?storename=${seller.storename}`);
      alert("거절 완료!");
      setShowModal(false);
      fetchSellers();
    } catch (error) {
      console.error("거절 실패", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100">
      {location.pathname === '/admin/verification' && (
        <AdminHeader title="판매자 인증 관리">
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <span className="sr-only">알림</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
            관리자 계정
          </button>
        </AdminHeader>
      )}

      <div className="flex-1 p-6">
        <AdminContentHeader>
          <AdminTitle type="main">판매자 인증 관리</AdminTitle>
        </AdminContentHeader>
        <p className="text-gray-600">판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</p>

        <div className="flex gap-3 mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="판매자 이름 또는 사업자번호 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
                <tr key={seller.sellerId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{seller.sellerId}</td>
                  <td className="p-3">{seller.storename}</td>
                  <td className="p-3">{seller.representativeName}</td>
                  <td className="p-3">{seller.businessRegistrationNumber}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${seller.registrationStatus === "대기"
                        ? "bg-yellow-200 text-yellow-700"
                        : seller.registrationStatus === "완료"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"}`}
                    >
                      인증 {seller.registrationStatus}
                    </span>
                  </td>
                  <td className="p-3">{seller.applicationDate?.slice(0, 10)}</td>
                  <td className="p-3">
                    <button
                      className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowModal(true);
                      }}
                    >
                      🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedSeller && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">판매자 정보</h2>
              <p>스토어 이름: {selectedSeller.storename}</p>
              <p>대표자: {selectedSeller.representativeName}</p>
              <p>사업자등록번호: {selectedSeller.businessRegistrationNumber}</p>
              <p>통신판매업 번호: {selectedSeller.onlineSalesNumber}</p>
              <p>등록 상태: {selectedSeller.registrationStatus}</p>
              <p>제출일: {selectedSeller.applicationDate?.slice(0, 10)}</p>

              <div className="flex justify-between mt-6">
                <button onClick={() => handleApprove(selectedSeller)} className="bg-green-500 text-white px-4 py-2 rounded-lg">승인</button>
                <button onClick={() => handleReject(selectedSeller)} className="bg-red-500 text-white px-4 py-2 rounded-lg">거절</button>
                <button onClick={() => setShowModal(false)} className="border px-4 py-2 rounded-lg">닫기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVerificationPage;
