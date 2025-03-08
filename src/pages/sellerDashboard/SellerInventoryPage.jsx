import SellerContentHeader from './components/SellerContentHeader';
import SellerTitle from './components/SellerTitle';
import SellerToolBar from './components/SellerToolBar';
import SellerActionButton from './components/SellerActionButton';
import SellerSearch from './components/SellerSearch';
import SellerContentTable from './components/SellerContentTable';
import useToggle from '../../hooks/useToggle';

import { IoCar } from 'react-icons/io5';

const headers = ['상품명', '현재 재고', '최소 재고', '최근 입고일', '상태', '작업'];

const data = [
  ['삼각김밥', 50, 20, '2023-06-14', '정상'],
  ['샌드위치', 30, 10, '2023-06-12', '정상'],
  ['음료수', 100, 50, '2023-06-10', '정상'],
  ['초코바', 5, 10, '2023-06-15', '재고 부족'],
  ['컵라면', 0, 15, '2023-06-18', '품절'],
];

function SellerInventoryPage() {
  const { onToggle } = useToggle();
  return (
    <section className>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>재고관리</SellerTitle>
        <p>재고 목록 및 관리</p>
        <SellerToolBar>
          <SellerSearch placeholder={'상품명을 입력하세요.'} />
          <SellerActionButton>
            <IoCar />
            재고 발주
          </SellerActionButton>
        </SellerToolBar>
      </SellerContentHeader>

      {/* 테이블 */}
      <SellerContentTable
        headers={headers}
        data={data}
        actionButtonName={'재고 조정'}
        onToggle={onToggle}
      />
    </section>
  );
}

export default SellerInventoryPage;
