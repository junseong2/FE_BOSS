import useToggle from '../../hooks/useToggle';
import SellerActionButton from './components/SellerActionButton';
import SellerContentHeader from './components/SellerContentHeader';
import SellerContentTable from './components/SellerContentTable';
import SellerSearch from './components/SellerSearch';
import SellerTitle from './components/SellerTitle';
import SellerToolBar from './components/SellerToolBar';
import { IoAddCircleOutline } from 'react-icons/io5';

const headers = ['상품명', '카테고리', '가격', '재고', '판매상태', '작업'];
const data = [
  ['삼각김밥', '식품', '￦1,500', 50, '판매중'],
  ['샌드위치', '식품', '￦3,000', 30, '판매중단'],
  ['음료수', '음료', '￦2,000', 100, '판매중'],
];

function SellerProductPage() {
  const { onToggle } = useToggle();

  return (
    <section className>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>상품관리</SellerTitle>
        <p>상품 목록 및 관리</p>
        <SellerToolBar>
          <SellerSearch placeholder={'상품명을 입력하세요.'} />
          <SellerActionButton>
            <IoAddCircleOutline />새 상품
          </SellerActionButton>
        </SellerToolBar>
      </SellerContentHeader>

      {/* 테이블 */}
      <SellerContentTable
        headers={headers}
        data={data}
        actionButtonName={'수정'}
        onToggle={onToggle}
      />
    </section>
  );
}

export default SellerProductPage;
