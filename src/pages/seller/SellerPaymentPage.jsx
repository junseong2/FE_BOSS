import { useState } from 'react';
import Pagination from '../../components/Pagination';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import { SellerCard, SellerCardLayout } from './components/common/SellerCard';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerSearch from './components/common/SellerSearch';
import SellerTabs from './components/common/SellerTabs';
import SellerTitle from './components/common/SellerTitle';
import SellerPaymentsTable from './components/pages/SellerPaymentsTable';

const paymentMethods = [
  // 탭 목 데이터
  { key: 'all', label: '전체 결제' },
  { key: 'card', label: '카드결제' },
  { key: 'bank', label: '무통장입금' },
  { key: 'cancel', label: '취소/환불' },
];

const mockPayments = [
  {
    paymentId: 'PAY-1234',
    orderId: 'ORD-1234',
    customerName: '김민준',
    paymentDate: '2023-03-15',
    paymentMethod: '카드결제',
    paymentInfo: '신한카드 (1234)',
    amount: 89000,
    status: '결제완료',
    manage: '메뉴 열기',
  },
  {
    paymentId: 'PAY-1235',
    orderId: 'ORD-1235',
    customerName: '이서연',
    paymentDate: '2023-03-15',
    paymentMethod: '무통장입금',
    paymentInfo: '국민은행 (5678)',
    amount: 45000,
    status: '결제완료',
    manage: '메뉴 열기',
  },
];

const PAGE_SIZE = 6
function SellerPaymentPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState(mockPayments);
  const [totalPageCount, setTotalPageCount] = useState(100);

  return (
    <section className='bg-[#f3f4f6] min-h-screen h-auto p-3 border border-gray-200 rounded-[5px]'>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>결제 내역</SellerTitle>
        {/* 날짜 선택, 필터, 내보내기 */}
      </SellerContentHeader>

      {/* 신규주문, 배송중, 배송완료, 취소/반품 통계 */}
      <div>
        <SellerCardLayout>
          <SellerCard bgColor={'bg-white'} amount={"￦"+100002} title={'오늘 결제'} />
          <SellerCard bgColor={'bg-white'} amount={"￦"+80000} title={'이번 주 결제'} />
          <SellerCard bgColor={'bg-white'} amount={"￦"+200004} title={'이번 달 결제'} />
          <SellerCard bgColor={'bg-white'} amount={"￦"+30000} title={'결제 취소'} />
        </SellerCardLayout>
      </div>

      {/* 탭(메뉴) */}
      <SellerTabs
        tabList={paymentMethods}
        selectedTab={selectedTab}
        onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
      />

      {/*  컨텐츠 */}
      <div className='bg-white mt-5 border border-gray-200 p-3 py-0'>
        {/* 검색창 */}
        <div className='py-3'>
          <SellerSearch placeholder={'결제번호, 주문번호, 고객명 검색..'} />
        </div>

        {/* 테이블 */}
        {loading ? <TableSkeleton /> : <SellerPaymentsTable payments={payments} />}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        handlePageClick={({ selected }) => setPage(selected)}
        totalPageCount={Math.ceil(totalPageCount / PAGE_SIZE)}
      />
    </section>
  );
}

export default SellerPaymentPage;
