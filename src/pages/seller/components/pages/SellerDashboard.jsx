import { Clock } from 'lucide-react';
import SellerStats from './SellerStats';

export default function SellerDashboard() {
  return (
    <div className='flex min-h-screen pt-5'>
      {/* Main Content */}
      <div className='flex-1'>
        {/* Stats Row */}
        <SellerStats stat={[]} />

        {/* Sales by Hour & Popular Products */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Sales by Hour */}
          <div className='bg-white p-6  border border-gray-200'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-semibold'>시간대별 매출</h2>
            </div>
            <div className='text-sm text-gray-500 mb-4'>오늘의 시간대별 매출 추이</div>
            <div className='flex items-center justify-center h-48'>
              <div className='flex items-end justify-center space-x-2 w-full'>
                <div className='h-32 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-24 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-16 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-36 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-44 w-6 bg-gray-800 rounded-t'></div>
                <div className='h-40 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-32 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-28 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-20 w-6 bg-gray-200 rounded-t'></div>
                <div className='h-24 w-6 bg-gray-200 rounded-t'></div>
              </div>
            </div>
            <div className='text-center text-sm text-gray-500 mt-4'>
              <div className='flex items-center justify-center'>
                <Clock className='w-4 h-4 mr-1' />
                <span>가장 바쁜 시간: 12:00 - 13:00</span>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div className='bg-white p-6  border border-gray-200'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-semibold'>인기 상품</h2>
            </div>
            <div className='text-sm text-gray-500 mb-4'>오늘 가장 많이 판매된 상품</div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs mr-3'>
                    1
                  </div>
                  <span className='text-sm'>삼각김밥 참치마요</span>
                </div>
                <span className='text-sm font-medium'>128개</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs mr-3'>
                    2
                  </div>
                  <span className='text-sm'>바나나 우유</span>
                </div>
                <span className='text-sm font-medium'>96개</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs mr-3'>
                    3
                  </div>
                  <span className='text-sm'>생수 500ml</span>
                </div>
                <span className='text-sm font-medium'>84개</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs mr-3'>
                    4
                  </div>
                  <span className='text-sm'>컵라면 매운맛</span>
                </div>
                <span className='text-sm font-medium'>72개</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs mr-3'>
                    5
                  </div>
                  <span className='text-sm'>아메리카노</span>
                </div>
                <span className='text-sm font-medium'>65개</span>
              </div>
            </div>
            <div className='mt-4 text-center'>
              <button className='inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
                상품 분석 보기
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders & Inventory Alerts */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
          {/* Recent Orders */}
          <div className='bg-white p-6  border border-gray-200'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-semibold'>최근 주문</h2>
              <button className='text-sm text-gray-600 px-3 py-1 border rounded-md hover:bg-gray-50'>
                모든 주문 보기
              </button>
            </div>
            <div className='text-sm text-gray-500 mb-4'>최근 접수된 주문 내역</div>
            <div className='space-y-4'>
              <div className='p-4 border border-gray-200 bg-gray-50'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-medium'>#ORD-7652</span>
                  <span className='text-gray-500 text-sm'>₩2,500</span>
                </div>
                <div className='text-sm text-gray-600 mb-2'>컵홀더 10묶음</div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-500'>4개 상품</span>
                  <button className='inline-flex items-center px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded'>
                    배송 준비중
                  </button>
                </div>
              </div>
              <div className='p-4 border border-gray-200'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-medium'>#ORD-7651</span>
                  <span className='text-gray-500 text-sm'>₩8,900</span>
                </div>
                <div className='text-sm text-gray-600 mb-2'>아이스티 25묶음</div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-500'>2개 상품</span>
                  <button className='inline-flex items-center px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded'>
                    배송중
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className='bg-white p-6  border border-gray-200'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-semibold'>재고 알림</h2>
            </div>
            <div className='text-sm text-gray-500 mb-4'>재고 보충 및 유통기한 임박 상품</div>
            <div className='space-y-4'>
              <div className='p-4 border border-gray-200'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-medium'>생수 500ml</span>
                  <button className='px-2 py-1 bg-red-500 text-white text-xs rounded'>
                    재고 부족
                  </button>
                </div>
                <div className='text-sm text-gray-600 mb-2'>현재 재고: 5개 (최소 재고: 20개)</div>
                <div className='flex space-x-2 mt-3'>
                  <button className='flex-1 px-2 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200'>
                    20개 발주
                  </button>
                  <button className='flex-1 px-2 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200'>
                    50개 발주
                  </button>
                  <button className='flex-1 px-2 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200'>
                    100개 발주
                  </button>
                </div>
              </div>
              <div className='p-4 border border-gray-200'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-medium'>우유 1L</span>
                  <button className='px-2 py-1 bg-red-500 text-white text-xs rounded'>
                    재고 부족
                  </button>
                </div>
                <div className='text-sm text-gray-600 mb-2'>현재 재고: 2개 (최소 재고: 15개)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
