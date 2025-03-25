import { useState } from 'react';
import { SellerCard, SellerCardLayout } from './components/common/SellerCard';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerTitle from './components/common/SellerTitle';
import SettlementProgress from './components/pages/SettlementProgress';
import Pagination from '../../components/Pagination';
import SellerSettlementTable from './components/pages/SellerSettlementTable';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import SellerSearch from './components/common/SellerSearch';

const mockSettlements = [
  {
    settlementNumber: '20250301', // 정산번호
    settlementPeriodStart: '2025-03-01', // 정산기간 (시작일)
    settlementDate: '2025-03-02', // 정산일
    orderCount: 50, // 주문수
    salesAmount: 1000000, // 매출액
    commission: 100000, // 수수료
    actualSettlementAmount: 900000, // 실 정산액
    status: '완료', // 상태
  },
  {
    settlementNumber: '20250302', // 정산번호
    settlementPeriodStart: '2025-03-01', // 정산기간 (시작일)
    settlementDate: '2025-03-03', // 정산일
    orderCount: 80, // 주문수
    salesAmount: 1500000, // 매출액
    commission: 150000, // 수수료
    actualSettlementAmount: 1350000, // 실 정산액
    status: '완료', // 상태
  },
  {
    settlementNumber: '20250303', // 정산번호
    settlementPeriodStart: '2025-03-01', // 정산기간 (시작일)
    settlementDate: '2025-03-04', // 정산일
    orderCount: 65, // 주문수
    salesAmount: 1200000, // 매출액
    commission: 120000, // 수수료
    actualSettlementAmount: 1080000, // 실 정산액
    status: '완료', // 상태
  },
  {
    settlementNumber: '20250304', // 정산번호
    settlementPeriodStart: '2025-03-01', // 정산기간 (시작일)
    settlementDate: '2025-03-05', // 정산일
    orderCount: 120, // 주문수
    salesAmount: 2500000, // 매출액
    commission: 250000, // 수수료
    actualSettlementAmount: 2250000, // 실 정산액
    status: '완료', // 상태
  },
  {
    settlementNumber: '20250305', // 정산번호
    settlementPeriodStart: '2025-03-01', // 정산기간 (시작일)
    settlementDate: '2025-03-06', // 정산일
    orderCount: 55, // 주문수
    salesAmount: 950000, // 매출액
    commission: 95000, // 수수료
    actualSettlementAmount: 855000, // 실 정산액
    status: '완료', // 상태
  },
];

const PAGE_SIZE = 10;
export default function SellerSettlementPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [settlements, setSettlements] = useState(mockSettlements);
  const [totalPageCount, setTotalPageCount] = useState(100);

  return (
    <section className='border bg-[#f3f4f6] min-h-screen h-auto border-gray-200 rounded-[5px] p-3'>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>정산관리</SellerTitle>
      </SellerContentHeader>

      {/* 매출 현황 요약 카드 */}
      <SellerCardLayout>
        <SellerCard
          bgColor={'bg-white'}
          title={'총 매출액'}
          amount={'￦10,730,000'}
          status={'전월 대비 12% 증가'}
        />
        <SellerCard
          bgColor={'bg-white'}
          title={'총 주문 건수'}
          amount={'360 건'}
          status={'전월 대비 8% 증가'}
        />
        <SellerCard
          bgColor={'bg-white'}
          title={'평균 객단가'}
          amount={'￦29,806'}
          status={'전월 대비 12% 증가'}
        />
      </SellerCardLayout>

      {/* 정산 현황 */}
      <SettlementProgress />

      <div className='bg-white mt-5 border border-gray-200 p-3 py-0'>
        {/* 검색창 */}
        <div className='py-3'>
          <SellerSearch placeholder={'정산번호를 입력하세요'} />
        </div>
        {/* 정산 내역 테이블 */}
        {loading ? <TableSkeleton /> : <SellerSettlementTable settlements={settlements} />}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        handlePageClick={({ selected }) => setPage(selected)}
        totalPageCount={Math.ceil(totalPageCount / PAGE_SIZE)}
      />
    </section>
  );
}
