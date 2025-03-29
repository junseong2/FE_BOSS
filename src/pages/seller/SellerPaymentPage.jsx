import { useEffect, useState } from 'react';
import { SellerCard, SellerCardLayout } from './components/common/SellerCard';
import {
  getPaymentSummary,
  getSalesByCategory,
  getSalesByMonth,
} from '../../services/payment.service';
import { formatLocalDate, getThisMonth, getWeekRange } from '../../utils/formatter';
import SellerCardSkeleton from './components/common/SellerCardSkeleton';
import SellerDateFilter from './components/common/SellerDateFilter';
import SellerMonthlyGraph from './components/pages/SellerMonthlyGraph';
import SellerSalesCategoryGraph from './components/pages/SellerSalesCategoryGraph';
import Skeleton from 'react-loading-skeleton';
import CircleGraphSkeleton from '../../components/skeleton/CircleGraphSkeleton';

function SellerPaymentPage() {
  // 검색할 날짜 범위 상태 저장
  const [dateRange, setDateRange] = useState({
    startDate: formatLocalDate(new Date()),
    endDate: formatLocalDate(new Date()),
  });

  // 매출 통계 상태 저장
  const [summaryStatistics, setSummaryStatistics] = useState({
    totalPrice: 0,
    totalOrderCount: 0,
    paidOrderCount: 0,
    canceledTotalPrice: 0,
  });

  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [monthStatistics, setMonthStatistics] = useState([]);

  // 로딩 상태 저장
  const [loadingState, setLoadingState] = useState({
    summary: false,
    month: false,
    category: false,
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

  // 매출 통계 요약
  const getPaymentSummaryFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, summary: true }));
    try {
      const stat = await getPaymentSummary(dateRange);
      if (!stat) return setSummaryStatistics([]);
      setSummaryStatistics(stat);
    } finally {
      setLoadingState((prev) => ({ ...prev, summary: false }));
    }
  };

  // 카테고리별 매출 통계
  const getSalesByCategoryFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, category: true }));
    try {
      const stat = await getSalesByCategory(dateRange);
      if (!stat) return setSummaryStatistics([]);
      setCategoryStatistics(stat);
    } finally {
      setLoadingState((prev) => ({ ...prev, category: false }));
    }
  };

  // 매출 통계 요약
  const getSalesByMonthFetch = async (dateRange) => {
    setLoadingState((prev) => ({ ...prev, month: true }));
    try {
      const stat = await getSalesByMonth(dateRange);
      if (!stat) return setSummaryStatistics([]);
      setMonthStatistics(stat);
    } finally {
      setLoadingState((prev) => ({ ...prev, month: false }));
    }
  };

  useEffect(() => {
    getPaymentSummaryFetch(dateRange);
  }, [dateRange]);

  useEffect(() => {
    getSalesByCategoryFetch(dateRange);
  }, [dateRange]);

  useEffect(() => {
    getSalesByMonthFetch(dateRange);
  }, [dateRange]);

  return (
    <section className='bg-[#f3f4f6] min-h-screen h-auto p-3 border border-gray-200 rounded-[5px]'>
      {/* 날짜 필터 */}
      <SellerDateFilter onChange={handleDateRange} />

      {/* 신규주문, 배송중, 배송완료, 취소/반품 통계 */}
      <div>
        <h2 className='text-2xl font-bold mb-[-1rem]'>매출통계</h2>
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
                bgColor='bg-white'
                amount={'￦' + (summaryStatistics.totalPrice?.toLocaleString() || 0)}
                title='총 매출'
              />
              <SellerCard
                bgColor='bg-white'
                amount={summaryStatistics.totalOrderCount || 0}
                title='총 주문 건수'
              />
              <SellerCard
                bgColor='bg-white'
                amount={summaryStatistics.paidOrderCount || 0}
                title='결제 완료 주문'
              />
              <SellerCard
                bgColor='bg-white'
                amount={'￦' + (summaryStatistics.canceledTotalPrice?.toLocaleString() || 0)}
                title='취소/환불 금액'
              />
            </>
          )}
        </SellerCardLayout>
      </div>

      {/* 매출 분석 */}
      <div>
        <h2 className='text-2xl font-bold pt-10 '>매출분석</h2>
        <div className='flex gap-5 lg:flex-row flex-col '>

          {/* 월별 매출 */}
          <div className='bg-white mt-5 border border-gray-200 p-3 pb-5 w-full h-full  lg:max-h-1/3'>
            <h3 className='font-bold py-5'>월별 매출</h3>
            <SellerMonthlyGraph data={monthStatistics} />
          </div>

          {/* 카테고리별 매출 */}
          <div className='bg-white lg:mt-5 mt-0 border border-gray-200 p-3 pb-5 w-full h-full lg:max-h-1/3'>
            <h3 className='font-bold py-5'>카테고리별 매출</h3>
            {loadingState.category ? (
              <CircleGraphSkeleton />
            ) : (
              <SellerSalesCategoryGraph data={categoryStatistics} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellerPaymentPage;
