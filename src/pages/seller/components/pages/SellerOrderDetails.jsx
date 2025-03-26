import { IoClose } from "react-icons/io5";

export default function SellerOrderDetails({onClose}) {
  const totalAmount = 45000;
  const taxRate = 0.1; // 10% VAT
  const baseAmount = Math.round(totalAmount / (1 + taxRate));
  const taxAmount = totalAmount - baseAmount;

  return (
    <div className='fixed left-0 top-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-10'>
      <div className='max-w-lg w-full mx-auto bg-white shadow-md rounded-lg p-4 space-y-6'>
        
        {/* 주문 상세 정보 헤더 */}
        <div className="flex items-center justify-between  mb-4 px-4">
          <h2 className='text-xl font-bold text-center'>주문 상세 정보</h2>
          <button className="hover:text-[#4294F2] cursor-pointer" onClick={onClose}><IoClose/></button>
        </div>

        {/* 주문 상세 정보 내용 */}
        <div className='grid md:grid-cols-3'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-4 border-b pb-2'>결제 정보</h3>
            <div className='space-y-3'>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>기본 금액</span>
                <span className='text-sm font-medium ml-0.5'>₩{baseAmount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>부가세 (10%)</span>
                <span className='text-sm font-medium ml-0.5'>₩{taxAmount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>결제 일시</span>
                <span className='text-sm font-medium ml-0.5'>2024년 3월 26일 16:15</span>
              </div>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>결제 방법</span>
                <span className='text-sm font-medium ml-0.5'>신용카드 (하나카드 **** 1234)</span>
              </div>
              <hr />
              <div className='flex justify-between flex-col gap-1 font-bold'>
                <span className='text-sm text-gray-600'>총 결제 금액</span>
                <span className='text-lg text-[#3a618c]'>₩{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 주문 상세 정보 */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-4 border-b pb-2'>주문 정보</h3>
            <div className='space-y-3'>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>주문 번호</span>
                <span className='text-sm font-medium ml-0.5'>2024032612345</span>
              </div>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>주문 일시</span>
                <span className='text-sm font-medium ml-0.5'>2024년 3월 26일 15:45</span>
              </div>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>주문 상품</span>
                <span className='text-sm font-medium ml-0.5'>기본 서비스 패키지</span>
              </div>
            </div>
          </div>

          {/* 배송 정보 */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-4 border-b pb-2'>배송 정보</h3>
            <div className='space-y-3'>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>배송 상태</span>
                <span className='text-sm text-green-600 font-medium'>배송 완료</span>
              </div>
              <div className='flex justify-between flex-col gap-1'>
                <span className='text-sm text-gray-600'>도착 예정일</span>
                <span className='text-sm font-medium ml-0.5'>2024년 3월 27일</span>
              </div>
              <div className='mt-2'>
                <div className='flex justify-between flex-col gap-1'>
                  <span className='text-sm text-gray-600'>받는 사람</span>
                  <span className='text-sm font-medium ml-0.5'>홍길동</span>
                </div>
                <div className='flex mt-2 justify-between flex-col gap-1'>
                  <span className='text-sm text-gray-600'>연락처</span>
                  <span className='text-sm font-medium ml-0.5'>010-1234-5678</span>
                </div>
                <div className='flex mt-2 justify-between flex-col gap-1'>
                  <span className='text-sm text-gray-600'>배송 주소</span>
                  <span className='text-sm font-medium ml-0.5'>서울시 강남구 테헤란로 123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
