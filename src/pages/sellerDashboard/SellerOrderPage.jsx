import { IoFilterOutline } from 'react-icons/io5';
import SellerActionButton from './components/SellerActionButton';
import SellerContentHeader from './components/SellerContentHeader';
import SellerContentTable from './components/SellerContentTable';
import SellerSearch from './components/SellerSearch';
import SellerTitle from './components/SellerTitle';
import SellerToolBar from './components/SellerToolBar';
import useToggle from '../../hooks/useToggle';

const headers = ['주문 번호', '고객명', '주문 일시', '총액', '상태', '작업'];

const data = [
  ['#1001', '홍길동', '2023-06-15 14:30', '₩15,000', '배송 준비중'],
  ['#1002', '김영완', '2023-06-16 10:45', '₩32,000', '결제 완료'],
  ['#1003', '이민수', '2023-06-17 08:20', '₩7,500', '배송 중'],
  ['#1004', '박지훈', '2023-06-18 19:10', '₩50,000', '배송 완료'],
  ['#1005', '최유진', '2023-06-19 12:00', '₩22,000', '취소됨'],
];

function SellerOrderPage() {
  const { onToggle } = useToggle();

  return (
    <section className>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>주문관리</SellerTitle>
        <p>주문 목록 및 관리</p>
        <SellerToolBar>
          <SellerSearch placeholder={'주문번호를 입력하세요.'} />
          <SellerActionButton>
            <IoFilterOutline />
            상태 필터
          </SellerActionButton>
        </SellerToolBar>
      </SellerContentHeader>

      {/* 테이블 */}
      <SellerContentTable
        headers={headers}
        data={data}
        actionButtonName={'상세보기'}
        onToggle={onToggle}
      />
    </section>
  );
}

export default SellerOrderPage;
