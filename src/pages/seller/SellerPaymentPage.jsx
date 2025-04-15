import { useEffect, useState } from "react"
import { SellerCard, SellerCardLayout } from "./components/common/SellerCard"
import { getPaymentSummary, getSalesByCategory, getSalesByMonth } from "../../services/payment.service"
import { formatLocalDate, getThisMonth, getWeekRange } from "../../utils/formatter"
import SellerCardSkeleton from "./components/common/SellerCardSkeleton"
import SellerDateFilter from "./components/common/SellerDateFilter"
import SellerMonthlyGraph from "./components/pages/SellerMonthlyGraph"
import SellerSalesCategoryGraph from "./components/pages/SellerSalesCategoryGraph"
import SellerActionButton from "./components/common/SellerActionButton"
import { IoCalendar } from "react-icons/io5"
import DateRangePicker from "../../components/DateRangeSelector"

function SellerPaymentPage() {
  // 검색할 날짜 범위 상태 저장
  const [dateRange, setDateRange] = useState({
    startDate: formatLocalDate(new Date()),
    endDate: formatLocalDate(new Date()),
  })

  // 매출 통계 상태 저장
  const [summaryStatistics, setSummaryStatistics] = useState({
    totalPrice: 0,
    totalOrderCount: 0,
    paidOrderCount: 0,
    canceledTotalPrice: 0,
  })

  // 날짜 선택기 폼 토글
  const [openDateRangeForm, setOpenDateRangeForm] = useState(false)

  const [categoryStatistics, setCategoryStatistics] = useState([])
  const [monthStatistics, setMonthStatistics] = useState([])

  // 로딩 상태 저장
  const [loadingState, setLoadingState] = useState({
    summary: false,
    month: false,
    category: false,
  })

  // 날짜 범위 선택 폼 토글
  function onToggleDateRangeForm() {
    setOpenDateRangeForm((prev) => !prev)
  }

  // 날짜 필터
  const handleDateRange = (e) => {
    const value = e.currentTarget.value

    // 오늘
    if (value === "now") {
      setDateRange(() => ({
        startDate: formatLocalDate(new Date()),
        endDate: formatLocalDate(new Date()),
      }))

      return
    }

    //이번 주
    if (value === "thisWeek") {
      setDateRange(() => ({
        ...getWeekRange(new Date()),
      }))
      return
    }

    //이번 달
    setDateRange(() => ({
      ...getThisMonth(),
    }))
  }

  // 매출 통계 요약
  const getPaymentSummaryFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, summary: true }))
    try {
      const stat = await getPaymentSummary(dateRange)
      if (!stat) return setSummaryStatistics([])
      setSummaryStatistics(stat)
    } finally {
      setLoadingState((prev) => ({ ...prev, summary: false }))
    }
  }

  // 카테고리별 매출 통계
  const getSalesByCategoryFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, category: true }))
    try {
      const stat = await getSalesByCategory(dateRange)
      if (!stat) return setSummaryStatistics([])
      setCategoryStatistics(stat)
    } finally {
      setLoadingState((prev) => ({ ...prev, category: false }))
    }
  }

  // 매출 통계 요약
  const getSalesByMonthFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, month: true }))
    try {
      const stat = await getSalesByMonth(dateRange)
      if (!stat) return setSummaryStatistics([])
      setMonthStatistics(stat)
    } finally {
      setLoadingState((prev) => ({ ...prev, month: false }))
    }
  }

  useEffect(() => {
    getPaymentSummaryFetch(dateRange)
  }, [dateRange])

  useEffect(() => {
    getSalesByCategoryFetch(dateRange)
  }, [dateRange])

  useEffect(() => {
    getSalesByMonthFetch(dateRange)
  }, [dateRange])

  return (
    <section className="bg-[#f3f4f6] min-h-screen h-auto p-5 border border-gray-200 rounded-lg shadow-sm">
      {/* 날짜 필터 */}
      <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex-1">
          <SellerDateFilter onChange={handleDateRange} />
        </div>
        <SellerActionButton
          onClick={onToggleDateRangeForm}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <IoCalendar className="text-lg" /> 날짜선택
        </SellerActionButton>
      </div>

      {/* 신규주문, 배송중, 배송완료, 취소/반품 통계 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">매출통계</h2>
        <SellerCardLayout>
          {loadingState.summary ? (
            <>
              <SellerCardSkeleton />
              <SellerCardSkeleton />
              <SellerCardSkeleton />
              <SellerCardSkeleton />
            </>
          ) : (
            <>
              <SellerCard
                bgColor="bg-white rounded-lg shadow-sm border border-gray-100"
                amount={"￦" + (summaryStatistics.totalPrice?.toLocaleString() || 0)}
                title="총 매출"
              />
              <SellerCard
                bgColor="bg-white rounded-lg shadow-sm border border-gray-100"
                amount={summaryStatistics.totalOrderCount || 0}
                title="총 주문 건수"
              />
              <SellerCard
                bgColor="bg-white rounded-lg shadow-sm border border-gray-100"
                amount={summaryStatistics.paidOrderCount || 0}
                title="결제 완료 주문"
              />
              <SellerCard
                bgColor="bg-white rounded-lg shadow-sm border border-gray-100"
                amount={"￦" + (summaryStatistics.canceledTotalPrice?.toLocaleString() || 0)}
                title="취소/환불 금액"
              />
            </>
          )}
        </SellerCardLayout>
      </div>

      {/* 매출 분석 */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">매출분석</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 월별 매출 */}
          <div className="bg-white border rounded-lg border-gray-200 shadow-sm overflow-hidden">
            <h3 className="font-bold p-4 border-b border-gray-100 text-gray-700">월별 매출</h3>
            <div className="p-4 min-h-[450px]">
              {loadingState.month ? (
                <div className="w-full h-[350px] flex items-center justify-center">
                  <p className="text-gray-500 animate-pulse">데이터를 조회중입니다...</p>
                </div>
              ) : (
                <SellerMonthlyGraph data={monthStatistics} />
              )}
            </div>
          </div>

          {/* 카테고리별 매출 */}
          <div className="bg-white border rounded-lg border-gray-200 shadow-sm overflow-hidden">
            <h3 className="font-bold p-4 border-b border-gray-100 text-gray-700">카테고리별 매출</h3>
            <div className="p-4 min-h-[450px]">
              {loadingState.category ? (
                <div className="w-full h-[350px] flex items-center justify-center">
                  <p className="text-gray-500 animate-pulse">데이터를 조회중입니다...</p>
                </div>
              ) : (
                <SellerSalesCategoryGraph data={categoryStatistics} />
              )}
            </div>
          </div>
        </div>
      </div>

      {openDateRangeForm ? <DateRangePicker onClose={onToggleDateRangeForm} setDateRange={setDateRange} /> : null}
    </section>
  )
}

export default SellerPaymentPage
