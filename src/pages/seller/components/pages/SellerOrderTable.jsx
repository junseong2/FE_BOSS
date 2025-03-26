import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import SellerOrderDropdown from './SellerOrderDropdown';
import SellerOrderDetails from './SellerOrderDetails';

/** 주문상태 컬러 라벨링 */
const getStatusClassName = (status) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-purple-100 text-purple-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
  }
};

export default function SellerOrderTable({ orders, onOrderDetailFetch, orderDetail }) {
  const [showDropdown, setShowDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /** 필터 드롭다운 토글 */
  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  // 주문 상세 내역 모달 토글
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // 주문 id 선택
  const onPickOrderId = (orderId) => {
    console.log('선택한 orderId', orderId);
    setOrderId(orderId);
  };

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='min-w-[812px] w-full'>
          <thead>
            <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
              <th className='py-3 px-4 text-left font-medium'>주문번호</th>
              <th className='py-3 px-4 text-left font-medium'>고객명</th>
              <th className='py-3 px-4 text-left font-medium'>주문일자</th>
              <th className='py-3 px-4 text-center font-medium'>상품수</th>
              <th className='py-3 px-4 text-left font-medium'>결제방법</th>
              <th className='py-3 px-4 text-left font-medium'>금액</th>
              <th className='py-3 px-4 text-left font-medium'>주문상태</th>
              <th className='py-3 px-4 text-center font-medium'>관리</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {orders?.map((order) => (
              <tr key={order.orderId} className='hover:bg-gray-50 '>
                <td className='py-3 px-4 text-sm'>{'ORD-' + order.orderId}</td>
                <td className='py-3 px-4 text-sm font-medium text-black'>{order.username}</td>
                <td className='py-3 px-4 text-sm text-gray-700'>{order.createdDate}</td>
                <td className='py-3 px-4 text-sm text-center'>{order.orderCount}개</td>
                <td className='py-3 px-4 text-sm'>{order.paymentMethod}</td>
                <td className='py-3 px-4 text-sm font-medium'>
                  ₩{order.totalPrice?.toLocaleString()}
                </td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusClassName(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className='py-3 px-4 text-center relative'>
                  <>
                    <button
                      onClick={() => toggleDropdown(order.orderId)}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      <IoEllipsisHorizontal className='h-5 w-5' />
                    </button>
                    {showDropdown === order.orderId && !showModal && (
                      <SellerOrderDropdown
                        onClick={onPickOrderId}
                        onToggle={toggleModal}
                        onFetch={onOrderDetailFetch}
                        orderId={order.orderId}
                      />
                    )}
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 주문 상세 내역 모달 */}
      {showModal ? (
        <SellerOrderDetails order={orderDetail} onClose={() => setShowModal(false)} />
      ) : null}
    </>
  );
}
