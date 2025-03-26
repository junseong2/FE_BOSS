import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import { SellerCard, SellerCardLayout } from './components/common/SellerCard';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerSearch from './components/common/SellerSearch';
import SellerTabs from './components/common/SellerTabs';
import SellerTitle from './components/common/SellerTitle';
import SellerPaymentsTable from './components/pages/SellerPaymentsTable';
import { getPayments } from '../../services/payment.service';

const paymentMethods = [
  // 탭 목 데이터
  { key: '', label: '전체내역' },
  { key: 'PENDING', label: '결제대기' },
  { key: 'PAID', label: '결제완료' },
  { key: 'CANCELLED', label: '주문취소' },
];


const PAGE_SIZE = 6;
function SellerPaymentPage() {
  const [selectedTab, setSelectedTab] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState();
  const [username, setUsername] = useState('');
  const [totalCount, setTotalCount] = useState(100);

  const getPaymentsFetch = async () => {
    const props = {
      page,
      size: PAGE_SIZE,
      search: username,
      status: selectedTab,
      sort: null,
      order: null,
    };

    setLoading(true);

    try {
      const { payments, totalCount } = await getPayments(props);

      setPayments(payments);
      setTotalCount(totalCount);

    } catch {
      console.log(11);
    } finally {
      setLoading(false);
    }
  };

  //
  useEffect(() => {
    getPaymentsFetch();
  },[] );

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
          <SellerCard bgColor={'bg-white'} amount={'￦' + 100002} title={'오늘 결제'} />
          <SellerCard bgColor={'bg-white'} amount={'￦' + 80000} title={'이번 주 결제'} />
          <SellerCard bgColor={'bg-white'} amount={'￦' + 200004} title={'이번 달 결제'} />
          <SellerCard bgColor={'bg-white'} amount={'￦' + 30000} title={'결제 취소'} />
        </SellerCardLayout>
      </div>


      {/*  컨텐츠 */}
      <div className='bg-white mt-5 border border-gray-200 p-3 py-0'>
        {/* 검색창 */}
        <div className='py-3'>
          <SellerSearch placeholder={'결제번호, 주문번호, 고객명 검색..'} />
        </div>

        {/* 테이블 */}
        {loading ? <TableSkeleton /> : <SellerPaymentsTable payments={payments} paymentMethods={paymentMethods} />}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        handlePageClick={({ selected }) => setPage(selected)}
        totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
      />
    </section>
  );
}

export default SellerPaymentPage;
