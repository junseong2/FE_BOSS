import { useEffect, useState } from 'react';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import { SellerCard, SellerCardLayout } from './components/common/SellerCard';
import SellerPaymentsTable from './components/pages/SellerPaymentsTable';
import { getPayments, getPaymentStatistics } from '../../services/payment.service';
import { formatLocalDate, getThisMonth, getWeekRange } from '../../utils/formatter';
import SellerCardSkeleton from './components/common/SellerCardSkeleton';
import SellerDateFilter from './components/common/SellerDateFilter';

const paymentMethods = [
  // 탭 목 데이터
  { key: '', label: '전체내역' },
  { key: 'PENDING', label: '결제대기' },
  { key: 'PAID', label: '결제완료' },
  { key: 'CANCELLED', label: '결제취소' },
];

function SellerPaymentPage() {
  // 검색할 날짜 범위 상태 저장
  const [dateRange, setDateRange] = useState({
    startDate: formatLocalDate(new Date()),
    endDate: formatLocalDate(new Date()),
  });
  const [payments, setPayments] = useState([]);

  // 매출 통계 상태 저장
  const [statistics, setStatistics] = useState({
    totalPrice: 0,
    totalOrderCount: 0,
    paidOrderCount: 0,
    canceledTotalPrice: 0,
  });

  // 로딩 상태 저장
  const [loadingState, setLoadingState] = useState({
    payments: false,
    statistics: false,
  });

  // 날짜 필터
  const handleDateRange = (e) => {
    const value = e.currentTarget.value;
    
    // 오늘
    if (value === 'now') {
      setDateRange(() => ({
        startDate: formatLocalDate(new Date()),
        endDate: formatLocalDate(new Date()),
      }));

      return;
    }

    //이번 주
    if (value === 'thisWeek') {
      setDateRange(() => ({
        ...getWeekRange(new Date()),
      }));
      return;
    }

    //이번 달
    setDateRange(() => ({
      ...getThisMonth(),
    }));
  };

  // 매출 통계
  const getPaymentStatisticsFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, statistics: true }));
    try {
      const stat = await getPaymentStatistics(dateRange);
      setStatistics(stat);
    } finally {
      setLoadingState((prev) => ({ ...prev, statistics: false }));
    }
  };

  useEffect(() => {
    getPaymentStatisticsFetch(dateRange);
  }, [dateRange]);


  return (
    <section className='bg-[#f3f4f6] min-h-screen h-auto p-3 border border-gray-200 rounded-[5px]'>
      {/* 날짜 필터 */}
      <SellerDateFilter onChange={handleDateRange} />

      {/* 신규주문, 배송중, 배송완료, 취소/반품 통계 */}
      <div >
        <h2 className='text-2xl font-bold mb-[-1rem]'>매출통계</h2>
        <SellerCardLayout>
          {loadingState.statistics ? (
            <>
              <SellerCardSkeleton />
              <SellerCardSkeleton />
              <SellerCardSkeleton />
              <SellerCardSkeleton />
            </>
          ) : (
            <>
              <SellerCard
                bgColor='bg-white'
                amount={'￦' + statistics?.totalPrice.toLocaleString()}
                title='총 매출'
              />
              <SellerCard
                bgColor='bg-white'
                amount={statistics.totalOrderCount}
                title='총 주문 건수'
              />
              <SellerCard
                bgColor='bg-white'
                amount={statistics.paidOrderCount}
                title='결제 완료 주문'
              />
              <SellerCard
                bgColor='bg-white'
                amount={'￦' + statistics?.canceledTotalPrice.toLocaleString()}
                title='취소/환불 금액'
              />
            </>
          )}
        </SellerCardLayout>
      </div>

      {/* 매출 분석 */}
      <div>
        <h2 className='text-2xl font-bold pt-10 '>매출분석</h2>
        <div className='flex gap-5 md:flex-row flex-col '>
          <div className='bg-white mt-5 border border-gray-200 p-3 py-0 md:max-w-1/2 w-full'>
            <h3 className='font-bold py-5'>월별 매출</h3>
          </div>
          <div className='bg-white mt-5 border border-gray-200 p-3 py-0 md:max-w-1/2 w-full'>
            <h3 className='font-bold py-5'>카테고리별 매출(비율)</h3>
          </div>
        </div>
      </div>

      {/*  컨텐츠 */}
      <div className='bg-white mt-5 border border-gray-200 p-3 py-0'>
        <h2 className='text-xl font-bold py-5'>베스트셀러 TOP5</h2>
        {/* 테이블 */}
        {loadingState.payments ? (
          <TableSkeleton />
        ) : (
          <SellerPaymentsTable payments={payments} paymentMethods={paymentMethods} />
        )}
      </div>
    </section>
  );
}

export default SellerPaymentPage;
