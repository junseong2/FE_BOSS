import useToggle from '../../hooks/useToggle';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerTitle from './components/common/SellerTitle';
import SellerSearch from './components/common/SellerSearch';
import SellerTabs from './components/common/SellerTabs';
import { useEffect, useState } from 'react';
import SellerOrderTable from './components/pages/SellerOrderTable';
import Pagination from '../../components/Pagination';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import { getOrders } from '../../services/order.service';

const orderStatuses = [
  // 탭 목 데이터
  { key: '', label: '전체내역' },
  { key: 'PENDING', label: '결제대기' },
  { key: 'PAID', label: '결제완료' },
  { key: 'CANCELLED', label: '주문취소' },
];

const PAGE_SIZE = 6;
function SellerOrderPage() {
  const { onToggle } = useToggle();

  const [selectedTab, setSelectedTab] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(100);

  // 주문 내역 조회
  const getOrdersFetch = async () => {
    const props = {
      page,
      size: PAGE_SIZE,
      status: selectedTab,
      search,
    };

    setLoading(true);
    const { orders, totalCount } = await getOrders(props);

    if (orders) {
      setOrders(orders);
      setTotalCount(totalCount || 1);
    } else {
      setOrders([]);
      setTotalCount(1);
    }

    setLoading(false);
  };

  useEffect(() => {
    getOrdersFetch();
  }, [page, search, selectedTab]);

  return (
    <section className='bg-[#f3f4f6] h-auto p-3 border border-gray-200 rounded-[5px]'>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>주문관리</SellerTitle>
        {/* 날짜 선택, 필터, 내보내기 */}
      </SellerContentHeader>

      {/* 신규주문, 배송중, 배송완료, 취소/반품 통계 */}
      {/* <div>
        <SellerCardLayout>
          <SellerCard bgColor={'bg-white'} amount={12} title={'신규 주문'} />
          <SellerCard bgColor={'bg-white'} amount={8} title={'배송중'} />
          <SellerCard bgColor={'bg-white'} amount={24} title={'배송완료'} />
          <SellerCard bgColor={'bg-white'} amount={3} title={'취소/반품'} />
        </SellerCardLayout>
      </div> */}

      {/* 탭(메뉴) */}
      <SellerTabs
        tabList={orderStatuses}
        selectedTab={selectedTab}
        onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
      />

      {/*  컨텐츠 */}
      <div className='bg-white mt-5 border border-gray-200 p-3 py-0'>
        {/* 검색창 */}
        <div className='py-3'>
          <SellerSearch
            placeholder={'주문번호를 입력하세요.'}
            onSearch={(e) => {
              e.preventDefault();

              const formData = new FormData();
              const search = formData.get('search');
              setSearch(search);
            }}
          />
        </div>

        {/* 테이블 */}
        {loading ? <TableSkeleton /> : <SellerOrderTable orders={orders} />}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        handlePageClick={({ selected }) => setPage(selected)}
        totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
      />
    </section>
  );
}

export default SellerOrderPage;
