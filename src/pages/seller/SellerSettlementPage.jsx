import { useEffect, useState } from 'react';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerTitle from './components/common/SellerTitle';
import Pagination from '../../components/Pagination';
import SellerSettlementTable from './components/pages/SellerSettlementTable';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import SellerSearch from './components/common/SellerSearch';
import SellerActionButton from './components/common/SellerActionButton';
import SellerSettlementForm from './components/pages/SellerSettlementForm';
import { getSettlements, settlementRequest } from '../../services/settlement.service';
import { formatLocalDate } from '../../utils/formatter';
import { IoCalendar, IoCard } from 'react-icons/io5';
import DateRangePicker from '../../components/DateRangeSelector';

const PAGE_SIZE = 10;
export default function SellerSettlementPage() {
  const [openSettlementForm, setOpenSettlementForm] = useState(false);
  const [openDateRangeForm, setOpenDateRangeForm] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [settlements, setSettlements] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: formatLocalDate(new Date()),
    endDate: formatLocalDate(new Date()),
  });

  // 정산신청 폼 토글
  function onToggleSettlementForm() {
    setOpenSettlementForm((prev) => !prev);
  }

  // 날짜 범위 선택 폼 토글
  function onToggleDateRangeForm() {
    setOpenDateRangeForm((prev) => !prev);
  }

  // 정산신청
  async function onSubmit(e) {
    setSubmitLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const amount = formData.get('amount') || 0;
    const bank = formData.get('bank') || '';
    const name = formData.get('name') || '';
    const account = formData.get('account') || 0;

    try {
      const updatedSettlement = await settlementRequest({ amount, bank, account, name });

      if (updatedSettlement) {
        settlements.filter(
          (settlement) => settlement.settlementId === updatedSettlement.settlementId,
        );
      }
    } finally {
      setSubmitLoading(false);
      setRenderTrigger((prev) => !prev);
    }
  }

  // 정산 내역 조회
  async function getSettlementsFetch() {
    setLoading(true);
    const condition = {
      ...dateRange,
      username: '',
      settlementId: search,
    };

    try {
      const { settlements, totalCount } = await getSettlements({
        page,
        size: PAGE_SIZE,
        condition,
      });
      setSettlements(settlements);
      setTotalCount(totalCount||1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSettlementsFetch();
  }, [page, dateRange, search, renderTrigger]);

  return (
    <>
      <section className='border bg-[#f3f4f6] min-h-screen h-auto border-gray-200 rounded-[5px] p-3'>
        {/* 헤더 */}
        <SellerContentHeader>
          <SellerTitle type={'main'}>정산관리</SellerTitle>
        </SellerContentHeader>

        <div className='bg-white mt-5 border border-gray-200 p-3 pb-5 h-[512px]'>
          <h2 className='text-xl font-semibold'>정산 내역</h2>
          {/* 검색창 */}
          <div className='py-3 flex flex-col '>
            <SellerSearch
              placeholder={'정산번호를 입력하세요'}
              onSearch={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const search = formData.get('search')?.toString() || '';
                setSearch(search);
              }}
            />
            <div className='flex justify-end mt-2 gap-2'>
              <SellerActionButton onClick={onToggleDateRangeForm}>
                <IoCalendar /> 날짜선택
              </SellerActionButton>
              <SellerActionButton onClick={onToggleSettlementForm}>
                <IoCard /> 정산신청
              </SellerActionButton>
            </div>
          </div>
          {/* 정산 내역 테이블 */}
          {loading ? <TableSkeleton /> : <SellerSettlementTable settlements={settlements} />}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          handlePageClick={({ selected }) => setPage(selected)}
          totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
        />
      </section>

      {openSettlementForm ? (
        <SellerSettlementForm
          onCancel={onToggleSettlementForm}
          onSubmit={onSubmit}
          isLoading={submitLoading}
        />
      ) : null}
      {openDateRangeForm ? (
        <DateRangePicker onClose={onToggleDateRangeForm} setDateRange={setDateRange} />
      ) : null}
    </>
  );
}