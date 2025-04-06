import React, { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination';

const PAGE_SIZE = 5;

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeYear, setActiveYear] = useState("전체");
  const [page, setPage] = useState(0);

  const currentYear = new Date().getFullYear();
  const recentYears = Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (activeYear === "전체") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        new Date(order.createdDate).getFullYear().toString() === activeYear
      );
      setFilteredOrders(filtered);
    }
    setPage(0); // 연도 변경 시 첫 페이지로
  }, [activeYear, orders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/orders/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error("주문 내역 조회 실패");
      const data = await response.json();
      const sorted = [...data].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

      setOrders(sorted); 
    } catch (error) {
      console.error("❌ 주문 내역 조회 오류:", error.message);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    console.log("📥 주문 상세 조회 요청 시작 - orderId:", orderId);
    if (selectedOrderId === orderId) {
      console.log("🔄 이미 열린 주문 → 닫기 동작 수행");
      setSelectedOrderId(null);
      setOrderDetail(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/orderdetail/${orderId}`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log("📡 서버 응답 상태 코드:", response.status);
      if (!response.ok) throw new Error("주문 상세 조회 실패");
      console.error("❌ 주문 상세 조회 실패 응답:", );
      const data = await response.json();
      console.log("✅ 주문 상세 조회 성공:", data);
      setOrderDetail(data);
      setSelectedOrderId(orderId);
    } catch (error) {
      console.error("❌ 주문 상세 조회 오류:", error.message);
    }
  };

  const paginatedOrders = filteredOrders.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div className="p-6 bg-white max-w-6xl border shadow-sm rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">주문 목록</h2>

      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="주문한 상품을 검색할 수 있어요!"
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-blue-500"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          검색
        </button>
      </div>

      <div className="flex items-center text-sm text-gray-600 gap-2 mb-8">
        <button
          onClick={() => setActiveYear("전체")}
          className={`hover:underline ${activeYear === "전체" ? "text-blue-600 font-medium" : ""}`}
        >
          전체
        </button>
        <span>|</span>
        {recentYears.map((year) => (
          <React.Fragment key={year}>
            <button
              onClick={() => setActiveYear(year)}
              className={`hover:underline ${activeYear === year ? "text-blue-600 font-medium" : ""}`}
            >
              {year}
            </button>
            <span>|</span>
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-10">
        {paginatedOrders.map((order) => (
          <div key={order.orderId} className="border rounded-lg shadow-sm p-6 bg-white transition-all">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                📦 {new Date(order.createdDate).toLocaleDateString()} 주문
              </h3>
              <button
                onClick={() => fetchOrderDetail(order.orderId)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                {selectedOrderId === order.orderId ? '닫기' : '상세보기'}
              </button>
            </div>

            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 border p-3 rounded-md">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt="상품 이미지"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">가격: {item.price.toLocaleString()} 원</p>
                      <p className="text-gray-500 text-sm">수량: {item.quantity}개</p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                      환불 요청
                    </button>
                    <button className="ml-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200">
                      교환 요청
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-4 text-gray-600 text-sm">
              <span className="font-medium text-blue-600">{order.status}</span>
              <span className="ml-2">총 금액: {order.totalPrice.toLocaleString()} 원</span>
            </div>

            {order.orderId === selectedOrderId && orderDetail && (
              <div className="mt-6 p-5 bg-gray-50 rounded-md border animate-fade-in">
                <h4 className="font-bold mb-2 text-gray-800">📝 주문 상세 정보</h4>
                <p>받는 사람: {orderDetail.username}</p>
                <p>연락처: {orderDetail.phoneNumber}</p>
                <p>주소: {orderDetail.address}</p>
                <p>결제 방법: {orderDetail.paymentMethod}</p>
                <p>결제 일시: {orderDetail.paidDate}</p>
                <div className="space-y-2">
                  {orderDetail.products?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white border rounded-md p-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.productImages?.trim() || '/default-product.png'}
                          alt={`상품-${i}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">{item.productName}</p>
                          <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                          <p className="text-sm text-gray-600">단가: {item.price} 원</p>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <button
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                          onClick={() => alert('환불 요청이 접수되었습니다.')}
                        >
                          환불
                        </button>
                        <button
                          className="ml-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                          onClick={() => alert('교환 요청이 접수되었습니다.')}
                        >
                          교환
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <Pagination
          handlePageClick={({ selected }) => setPage(selected)}
          totalPageCount={Math.ceil(filteredOrders.length / PAGE_SIZE)}
        />
      </div>
    </div>
  );
};

export default OrderList;