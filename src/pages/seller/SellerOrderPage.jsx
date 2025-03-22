import useToggle from '../../hooks/useToggle';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerTitle from './components/common/SellerTitle';
import SellerSearch from './components/common/SellerSearch';
import { SellerCard, SellerCardLayout } from './components/common/SellerCard';
import SellerTabs from './components/common/SellerTabs';
import { useState } from 'react';
import SellerOrderTable from './components/pages/SellerOrderTable';
import Pagination from '../../components/Pagination';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import SellerSettlementTable from './components/pages/SellerSettlementTable';

const orderStatuses = [
  // 탭 목 데이터
  { key: 'all', label: '전체 주문' },
  { key: 'new', label: '신규 주문' },
  { key: 'shipping', label: '배송중' },
  { key: 'delivered', label: '배송완료' },
  { key: 'canceled', label: '취소/반품' },
];

// 주문 내역 목 데이터
const mockOrders = [
  {
    id: 'ORD-1234',
    customer: '김민준',
    created_date: '2023-03-15',
    quantity: 3,
    paymentMethod: '카드결제',
    total_price: '₩89,000',
    status: '배송완료',
  },
  {
    id: 'ORD-1235',
    customer: '이서연',
    created_date: '2023-03-15',
    quantity: 1,
    paymentMethod: '무통장입금',
    total_price: '₩45,000',
    status: '결제완료',
  },
  {
    id: 'ORD-1236',
    customer: '박지호',
    created_date: '2023-03-14',
    quantity: 4,
    paymentMethod: '카드결제',
    total_price: '₩127,000',
    status: '배송중',
  },
  {
    id: 'ORD-1237',
    customer: '최수아',
    created_date: '2023-03-14',
    quantity: 1,
    paymentMethod: '카드결제',
    total_price: '₩35,000',
    status: '주문확인',
  },
  {
    id: 'ORD-1238',
    customer: '정도윤',
    created_date: '2023-03-13',
    quantity: 2,
    paymentMethod: '카드결제',
    total_price: '₩68,000',
    status: '배송완료',
  },
  {
    id: 'ORD-1239',
    customer: '강하은',
    created_date: '2023-03-13',
    quantity: 3,
    paymentMethod: '카드결제',
    total_price: '₩94,500',
    status: '결제완료',
  },
  {
    id: 'ORD-1240',
    customer: '윤지민',
    created_date: '2023-03-12',
    quantity: 2,
    paymentMethod: '무통장입금',
    total_price: '₩62,000',
    status: '배송중',
  },
  {
    id: 'ORD-1241',
    customer: '임서진',
    created_date: '2023-03-12',
    quantity: 3,
    paymentMethod: '카드결제',
    total_price: '₩78,000',
    status: '주문취소',
  },
];

const PAGE_SIZE = 6;
function SellerOrderPage() {
  const { onToggle } = useToggle();

  const [selectedTab, setSelectedTab] = useState('all');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [totalPageCount, setTotalPageCount] = useState(100);

  return (
    <section className='bg-[#f3f4f6] h-auto p-3 border border-gray-200 rounded-[5px]'>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>주문관리</SellerTitle>
        {/* 날짜 선택, 필터, 내보내기 */}
      </SellerContentHeader>

      {/* 신규주문, 배송중, 배송완료, 취소/반품 통계 */}
      <div>
        <SellerCardLayout>
          <SellerCard bgColor={'bg-white'} amount={12} title={'신규 주문'} />
          <SellerCard bgColor={'bg-white'} amount={8} title={'배송중'} />
          <SellerCard bgColor={'bg-white'} amount={24} title={'배송완료'} />
          <SellerCard bgColor={'bg-white'} amount={3} title={'취소/반품'} />
        </SellerCardLayout>
      </div>

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
          <SellerSearch placeholder={'주문번호를 입력하세요.'} />
        </div>

        {/* 테이블 */}
        {loading ? <TableSkeleton /> : <SellerOrderTable orders={orders} />}
      </div>
      

      {/* 페이지네이션 */}
      <Pagination
        handlePageClick={({ selected }) => setPage(selected)}
        totalPageCount={Math.ceil(totalPageCount / PAGE_SIZE)}
      />
    </section>
  );
}

export default SellerOrderPage;
