import { SellerCard, SellerCardLayout } from './components/SellerCard';
import SellerTitle from './components/SellerTitle';

function SellerSalesPage() {
  return (
    <div>
      <SellerTitle type={'main'}>매출 현황</SellerTitle>

      {/* 매출 현황 요약 카드 */}
      <SellerCardLayout>
        <SellerCard title={'총 매출액'} amount={'￦10,730,000'} status={'전월 대비 12% 증가'} />
        <SellerCard title={'총 주문 건수'} amount={'360 건'} status={'전월 대비 8% 증가'} />
        <SellerCard title={'평균 객단가'} amount={'￦29,806'} status={'전월 대비 12% 증가'} />
        <SellerCard title={'환불/취소 금액'} amount={'￦120,000'} status={'전월 대비 5% 감소'} />
      </SellerCardLayout>
    </div>
  );
}

export default SellerSalesPage;
