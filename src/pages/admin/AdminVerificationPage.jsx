import { useEffect, useState } from "react"
import axios from "axios"
import AdminContentHeader from "./components/common/AdminContentHeader"
import AdminTitle from "./components/common/AdminTitle"
import AdminHeader from "./components/layout/AdminHeader"
import { useNavigate, useLocation } from "react-router-dom"


function AdminVerificationPage() {
  const [search, setSearch] = useState("")
  const [sellers, setSellers] = useState([])
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [sellerPhone, setSellerPhone] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/seller/all")
      setSellers(response.data)
    } catch (error) {
      console.error("판매자 목록 가져오기 실패", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSellerPhone = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/users/${userId}/phone`)
      setSellerPhone(response.data)
    } catch (error) {
      console.error("전화번호 가져오기 실패", error)
    }
  }

  const handleApprove = async (seller) => {
    try {
      await axios.patch(`http://localhost:5000/seller/${seller.sellerId}/approve`)
      await axios.patch(`http://localhost:5000/auth/users/${seller.userId}/update-seller?storename=${seller.storename}`)
      alert("승인 완료!")
      setShowModal(false)
      fetchSellers()
    } catch (error) {
      console.error("승인 실패", error)
    }
  }

  const handleReject = async (seller) => {
    try {
      await axios.patch(`http://localhost:5000/seller/${seller.sellerId}/reject`)
      await axios.patch(`http://localhost:5000/auth/users/${seller.userId}/reject-seller?storename=${seller.storename}`)
      alert("거절 완료!")
      setShowModal(false)
      fetchSellers()
    } catch (error) {
      console.error("거절 실패", error)
    }
  }

  const userout = async (seller) => {
    try {
      await axios.delete(`http://localhost:5000/auth/usersout/${seller.userId}`)
      console.log(seller.userId)
      alert("정상적으로 탈퇴처리 되었습니다")
      setShowModal(false)
      fetchSellers()
      console.log("Navigating to signin...")
      navigate("/signin")
    } catch (error) {
      console.error("탈퇴 실패", error)
      console.log(seller.userId)
    }
  }

  const getStatusStyle = (status) => {
    if (status.includes("완료")) return "bg-emerald-100 text-emerald-800 border border-emerald-300"
    if (status.includes("대기")) return "bg-amber-100 text-amber-800 border border-amber-300"
    if (status.includes("거절")) return "bg-rose-100 text-rose-800 border border-rose-300"
    return "bg-slate-100 text-slate-800 border border-slate-300"
  }

  const formatBizNumber = (number) => {
    if (!number || number.length !== 10) return number
    return `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5)}`
  }

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.storename?.toLowerCase().includes(search.toLowerCase()) ||
      seller.businessRegistrationNumber?.includes(search),
  )

  return (
    <div className="flex-1 max-w-7xl mx-auto">
      {location.pathname === "/admin/verification" && (
        <AdminHeader title="판매자 인증 관리">
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <span className="sr-only">알림</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
            관리자 계정
          </button>
        </AdminHeader>
      )}

      <div className="flex-1 px-6 py-8">
        <AdminContentHeader>
          <AdminTitle type="main">판매자 인증 관리</AdminTitle>
        </AdminContentHeader>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <p className="text-gray-800 font-medium text-base">판매자 상점 이름 및 사업자등록증 확인을 관리하세요.</p>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
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
              className="w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="판매자 이름 또는 사업자번호 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    판매자 ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    상점 이름
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    대표자
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    사업자등록번호
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    제출일
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-800 font-medium">
                      데이터를 불러오는 중...
                    </td>
                  </tr>
                ) : filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-800 font-medium">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller.sellerId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {seller.sellerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {seller.storename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{seller.representativeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">
                        {formatBizNumber(seller.businessRegistrationNumber)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 text-sm font-bold rounded-full ${getStatusStyle(
                            seller.registrationStatus,
                          )}`}
                        >
                          인증 {seller.registrationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {seller.applicationDate?.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="inline-flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                          onClick={() => {
                            setSelectedSeller(seller)
                            setShowModal(true)
                            fetchSellerPhone(seller.userId)
                          }}
                          title="상세 정보 보기"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && selectedSeller && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg transition-all duration-300 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">판매자 상세 정보</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600 font-medium">스토어 이름</div>
                  <div className="text-gray-900 font-bold">{selectedSeller.storename}</div>

                  <div className="text-gray-600 font-medium">대표자</div>
                  <div className="text-gray-900 font-medium">{selectedSeller.representativeName}</div>

                  <div className="text-gray-600 font-medium">전화번호</div>
                  <div className="text-gray-900 font-medium">{sellerPhone || "-"}</div>

                  <div className="text-gray-600 font-medium">사업자등록번호</div>
                  <div className="text-gray-900 font-medium font-mono">
                    {formatBizNumber(selectedSeller.businessRegistrationNumber)}
                  </div>

                  <div className="text-gray-600 font-medium">통신판매업 번호</div>
                  <div className="text-gray-900 font-medium font-mono">{selectedSeller.onlineSalesNumber || "-"}</div>

                  <div className="text-gray-600 font-medium">등록 상태</div>
                  <div>
                    <span
                      className={`px-3 py-1.5 text-sm font-bold rounded-full ${getStatusStyle(
                        selectedSeller.registrationStatus,
                      )}`}
                    >
                      인증 {selectedSeller.registrationStatus}
                    </span>
                  </div>

                  <div className="text-gray-600 font-medium">제출일</div>
                  <div className="text-gray-900 font-medium">{selectedSeller.applicationDate?.slice(0, 10)}</div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {selectedSeller.registrationStatus.includes("완료") ? (
                  <button
                    onClick={() => userout(selectedSeller)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition-colors font-bold shadow-md"
                  >
                    탈퇴 처리
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleApprove(selectedSeller)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition-colors font-bold shadow-md"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(selectedSeller)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition-colors font-bold shadow-md"
                    >
                      거절
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 bg-white px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-md"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminVerificationPage
