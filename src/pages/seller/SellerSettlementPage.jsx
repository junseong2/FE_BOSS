"use client"

import { useEffect, useState } from "react"
import Pagination from "../../components/Pagination"
import SellerSettlementTable from "./components/pages/SellerSettlementTable"
import SellerSearch from "./components/common/SellerSearch"
import SellerActionButton from "./components/common/SellerActionButton"
import SellerSettlementForm from "./components/pages/SellerSettlementForm"
import { getSettlements, settlementRequest } from "../../services/settlement.service"
import { formatLocalDate } from "../../utils/formatter"
import { Calendar, CreditCard, DollarSign, FileText } from "lucide-react"
import DateRangePicker from "../../components/DateRangeSelector"

const PAGE_SIZE = 10

export default function SellerSettlementPage() {
  const [openSettlementForm, setOpenSettlementForm] = useState(false)
  const [openDateRangeForm, setOpenDateRangeForm] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [renderTrigger, setRenderTrigger] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [settlements, setSettlements] = useState([])
  const [totalCount, setTotalCount] = useState(1)
  const [dateRange, setDateRange] = useState({
    startDate: formatLocalDate(new Date()),
    endDate: formatLocalDate(new Date()),
  })

  // 정산신청 폼 토글
  function onToggleSettlementForm() {
    setOpenSettlementForm((prev) => !prev)
  }

  // 날짜 범위 선택 폼 토글
  function onToggleDateRangeForm() {
    setOpenDateRangeForm((prev) => !prev)
  }

  // 정산신청
  async function onSubmit(formData) {
    setSubmitLoading(true)


    const amount = formData.get("amount") || 0
    const bank = formData.get("bank") || ""
    const name = formData.get("name") || ""
    const account = formData.get("account") || 0

    try {
      const updatedSettlement = await settlementRequest({ amount, bank, account, name })

      if (updatedSettlement) {
        settlements.filter((settlement) => settlement.settlementId === updatedSettlement.settlementId)
      }
    } finally {
      setSubmitLoading(false)
      setRenderTrigger((prev) => !prev)
    }
  }

  // 정산 내역 조회
  async function getSettlementsFetch() {
    setLoading(true)
    const condition = {
      ...dateRange,
      username: "",
      settlementId: search,
    }

    try {
      const { settlements, totalCount } = await getSettlements({
        page,
        size: PAGE_SIZE,
        condition,
      })
      setSettlements(settlements)
      setTotalCount(totalCount || 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSettlementsFetch()
  }, [page, dateRange, search, renderTrigger])

  return (
    <>
      <section className="bg-gray-100 min-h-screen p-6">
        {/* 대시보드 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <DollarSign className="mr-2 text-gray-600 w-6 h-6" />
                정산관리
              </h1>
              <p className="text-gray-500 mt-1">판매 정산 내역을 확인하고 정산을 신청할 수 있습니다.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">조회 기간:</span>
              <span className="text-sm font-medium text-gray-700">
                {dateRange.startDate} ~ {dateRange.endDate}
              </span>
            </div>
          </div>
        </div>

        {/* 정산 내역 카드 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 검색 및 액션 버튼 */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full md:w-1/2">
                <SellerSearch
                  placeholder={"정산번호를 입력하세요"}
                  onSearch={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const search = formData.get("search")?.toString() || ""
                    setSearch(search)
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <SellerActionButton onClick={onToggleDateRangeForm}>
                  <Calendar className="w-4 h-4 mr-1.5" />
                  날짜선택
                </SellerActionButton>
                <SellerActionButton onClick={onToggleSettlementForm}>
                  <CreditCard className="w-4 h-4 mr-1.5" />
                  정산신청
                </SellerActionButton>
              </div>
            </div>
          </div>

          {/* 정산 내역 테이블 */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">정산 내역을 불러오는 중입니다...</p>
              </div>
            ) : settlements && settlements.length > 0 ? (
              <SellerSettlementTable settlements={settlements} />
            ) : (
              <div className="p-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">조회된 정산 내역이 없습니다.</p>
                  <p className="text-sm text-gray-400 mt-1">다른 검색어나 날짜 범위로 다시 시도해보세요.</p>
                </div>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {settlements && settlements.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <Pagination
                handlePageClick={({ selected }) => setPage(selected)}
                totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
              />
            </div>
          )}
        </div>
      </section>

      {openSettlementForm ? (
        <SellerSettlementForm onCancel={onToggleSettlementForm} onSubmit={onSubmit} isLoading={submitLoading} />
      ) : null}
      {openDateRangeForm ? <DateRangePicker onClose={onToggleDateRangeForm} setDateRange={setDateRange} /> : null}
    </>
  )
}
