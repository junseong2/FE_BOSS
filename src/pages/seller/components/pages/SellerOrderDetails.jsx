import { IoClose } from 'react-icons/io5';
import { formatDate } from '../../../../utils/formatter';
import Skeleton from 'react-loading-skeleton';

export default function SellerOrderDetails({ onClose, orderDetail, isLoading }) {
  const taxRate = 0.1; // 10% VAT

  return (
    <div className="fixed left-0 top-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-10">
    <div className="max-w-[768px] w-full mx-auto bg-white shadow-md rounded-lg p-4 space-y-6 overflow-y-auto max-h-[512px]">
      {/* 주문 상세 정보 헤더 */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold text-center">
          {isLoading ? <Skeleton width={150} /> : '주문 상세 정보'}
        </h2>
        <button className="hover:text-[#4294F2] cursor-pointer" onClick={onClose}>
          <IoClose />
        </button>
      </div>

      {/* 주문 상세 정보 내용 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 결제 정보 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-4 border-b border-gray-500 pb-2">
            {isLoading ? <Skeleton width={100} /> : '결제 정보'}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between flex-col gap-1">
              <span className="text-sm text-gray-600">기본 금액</span>
              <span className="text-sm font-medium ml-0.5">
                {isLoading ? <Skeleton width={80} /> : `₩${((orderDetail?.totalPayment ?? 0) - (orderDetail?.totalPayment ?? 0) * taxRate).toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between flex-col gap-1">
              <span className="text-sm text-gray-600">부가세 (10%)</span>
              <span className="text-sm font-medium ml-0.5">
                {isLoading ? <Skeleton width={80} /> : `₩${((orderDetail?.totalPayment ?? 0) * taxRate).toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between flex-col gap-1">
              <span className="text-sm text-gray-600">결제 일시</span>
              <span className="text-sm font-medium ml-0.5">
                {isLoading ? <Skeleton width={120} /> : formatDate(orderDetail?.paidDate)  ?? '정보 없음'}
              </span>
            </div>
            <div className="flex justify-between flex-col gap-1">
              <span className="text-sm text-gray-600">결제 방법</span>
              <span className="text-sm font-medium ml-0.5">
                {isLoading ? <Skeleton width={80} /> : orderDetail?.paymentMethod ?? '정보 없음'}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between flex-col gap-1 font-bold">
              <span className="text-sm text-gray-600">총 결제 금액</span>
              <span className="text-lg text-[#3a618c]">
                {isLoading ? <Skeleton width={100} /> : `₩${(orderDetail?.totalPayment ?? 0).toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* 주문 상세 정보 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-4 border-b border-gray-500 pb-2">
            {isLoading ? <Skeleton width={100} /> : '주문 정보'}
          </h3>
          <div className="space-y-3">
            {['주문 번호', '주문 일시', '주문 상품', '주문 개수'].map((label, index) => (
              <div key={index} className="flex justify-between flex-col gap-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-medium ml-0.5">
                  {isLoading ? <Skeleton width={120} /> : orderDetail?.[['orderId', 'createdDate', 'productName', 'totalQuantity'][index]] ?? '정보 없음'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-4 border-b border-gray-500 pb-2">
            {isLoading ? <Skeleton width={100} /> : '구매자 정보'}
          </h3>
          <div className="space-y-3">
            {['받는 사람', '연락처', '배송 주소'].map((label, index) => (
              <div key={index} className="flex justify-between flex-col gap-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-medium ml-0.5">
                  {isLoading ? <Skeleton width={150} /> : orderDetail?.[['username', 'phoneNumber', 'address'][index]] ?? '정보 없음'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
