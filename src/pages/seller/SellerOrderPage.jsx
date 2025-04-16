import useToggle from "../../hooks/useToggle"
import SellerContentHeader from "./components/common/SellerContentHeader"
import SellerTitle from "./components/common/SellerTitle"
import SellerSearch from "./components/common/SellerSearch"
import SellerTabs from "./components/common/SellerTabs"
import { useEffect, useState } from "react"
import SellerOrderTable from "./components/pages/SellerOrderTable"
import Pagination from "../../components/Pagination"
import TableSkeleton from "../../components/skeleton/TableSkeleton"
import { getOrderDetail, getOrders } from "../../services/order.service"

const orderStatus = [
  // 탭 목 데이터
  { key: "", label: "전체내역" },
  { key: "PENDING", label: "결제대기" },
  { key: "PAID", label: "결제완료" },
  { key: "CANCELLED", label: "결제취소" },
]

const paymentStatus = [
  { key: "PENDING", label: "결제대기" },
  { key: "PAID", label: "결제완료" },
  { key: "CANCELLED", label: "결제취소" },
]

const PAGE_SIZE = 6
function SellerOrderPage() {
  const { onToggle } = useToggle()

  const [selectedTab, setSelectedTab] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [orderDetail, setOrderDetail] = useState("")
  const [totalCount, setTotalCount] = useState(1)

  // 주문 내역 조회
  const getOrdersFetch = async (search) => {
    const props = {
      page,
      size: PAGE_SIZE,
      paymentStatus: selectedTab,
      orderStatus: "",
      search,
    }

    setLoading(true)

    try {
      const { orders, totalCount } = await getOrders(props)
      if (orders) {
        setOrders(orders)
        setTotalCount(totalCount || 1)
      }
    } finally {
      setLoading(false)
    }
  }

  // 주문 상세 조회
  const getOrderDetailFetch = async (orderId) => {
    setDetailLoading(true)
    try {
      const data = await getOrderDetail(orderId)
      if (data) {
        setOrderDetail(data)
      }
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    getOrdersFetch(search)
  }, [page, search, selectedTab])

  return (
    <section className="bg-[#f3f4f6] h-auto p-5 border border-gray-200 rounded-lg shadow-sm">
      {/* 헤더 */}
      <div className="mb-6">
        <SellerContentHeader>
          <SellerTitle type={"main"}>주문관리</SellerTitle>
          {/* 날짜 선택, 필터, 내보내기 */}
        </SellerContentHeader>
      </div>

      {/* 탭(메뉴) */}
      <div className="mb-5">
        <SellerTabs
          tabList={orderStatus}
          selectedTab={selectedTab}
          onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
        />
      </div>

      {/*  컨텐츠 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* 검색창 */}
        <div className="p-4 border-b border-gray-100">
          <SellerSearch
            placeholder={"고객명을 입력하세요."}
            onSearch={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const search = formData.get("search")?.toString() || ""
              setSearch(search)
            }}
          />
        </div>

        {/* 테이블 */}
        <div className="min-h-[512px]">
          {loading ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : (
            <SellerOrderTable
              orders={orders}
              paymentStatus={paymentStatus}
              onOrderDetailFetch={getOrderDetailFetch}
              orderDetail={orderDetail}
              detailLoading={detailLoading}
            />
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center">
        <Pagination
          handlePageClick={({ selected }) => setPage(selected)}
          totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
        />
      </div>
    </section>
  )
}

export default SellerOrderPage
