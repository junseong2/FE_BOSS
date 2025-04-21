import React, { useEffect, useState } from 'react';
import Pagination from '../../../components/Pagination';
import noImage from '../../../assets/noImage.jpg'
import {BASE_URL} from '../../../lib/api'

const PAGE_SIZE = 5;

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeYear, setActiveYear] = useState("전체");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const currentYear = new Date().getFullYear();
  const recentYears = Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  useEffect(() => {
    let filtered = orders;
    
    // Filter by year
    if (activeYear !== "전체") {
      filtered = filtered.filter((order) =>
        new Date(order.createdDate).getFullYear().toString() === activeYear
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((order) => 
        order.items?.some(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredOrders(filtered);
    setPage(0); // Reset to first page when filters change
  }, [activeYear, orders, searchTerm]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(BASE_URL+`/orders/user/${userId}`, {
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
      const response = await fetch(BASE_URL+`/orderdetail/${orderId}`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log("📡 서버 응답 상태 코드:", response.status);
      if (!response.ok) throw new Error("주문 상세 조회 실패");
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

  const getStatusColor = (status) => {
    const statusMap = {
      '배송완료': 'bg-green-100 text-green-800',
      '배송중': 'bg-blue-100 text-blue-800',
      '주문확인': 'bg-yellow-100 text-yellow-800',
      '결제완료': 'bg-purple-100 text-purple-800',
      '취소': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 max-w-6xl dark:border-gray-700 shadow-md rounded-xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">주문 목록</h2>

      <div className="flex items-center mb-6 gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="주문한 상품을 검색할 수 있어요!"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-400 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
          검색
        </button>
      </div>

      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => setActiveYear("전체")}
          className={`hover:underline px-3 py-1 rounded-full transition-colors ${activeYear === "전체" ? "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300" : ""}`}
        >
          전체
        </button>
        {recentYears.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`hover:underline px-3 py-1 rounded-full transition-colors ${activeYear === year ? "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300" : ""}`}
          >
            {year}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">주문 내역이 없습니다</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">아직 주문한 상품이 없습니다.</p>
          <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <div key={order.orderId} className="border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800 transition-all hover:shadow-md">
              <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    📦 {new Date(order.createdDate).toLocaleDateString()} 주문
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <button
                  onClick={() => fetchOrderDetail(order.orderId)}
                  className="flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400 hover:underline transition-colors"
                >
                  {selectedOrderId === order.orderId ? '닫기' : '상세보기'}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${selectedOrderId === order.orderId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 border dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 overflow-hidden rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <img
                          src={item.imageUrl || "/placeholder.svg?height=80&width=80"}
                          alt="상품 이미지"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-800 dark:text-white font-medium">{item.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">가격: {item.price.toLocaleString()} 원</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">수량: {item.quantity}개</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button className="px-3 py-1.5 text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        환불 요청
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                        교환 요청
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right mt-4 text-gray-600 dark:text-gray-400 text-sm">
                <span className="ml-2 font-medium">총 금액: {order.totalPrice.toLocaleString()} 원</span>
              </div>

              {order.orderId === selectedOrderId && orderDetail && (
                <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 animate-fadeIn">
                  <h4 className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    주문 상세 정보
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-white">받는 사람:</span> {orderDetail.username}
                      </p>
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-white">연락처:</span> {orderDetail.phoneNumber}
                      </p>
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-white">주소:</span> {orderDetail.address}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-white">결제 방법:</span> {orderDetail.paymentMethod}
                      </p>
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-white">결제 일시:</span> {orderDetail.paidDate}
                      </p>
                      <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-white">배송 상태:</span> 
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-800 dark:text-white mb-2">주문 상품</h5>
                    {orderDetail.products?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200  dark:border-gray-700 rounded-lg p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.productImages?.trim() || '/placeholder.svg?height=64&width=64'}
                            alt={`상품-${i}`}
                            onError={(e)=>{
                                e.currentTarget.src=noImage
                            }}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                          <div>
                            <p className="text-gray-800 dark:text-white font-semibold">{item.productName}</p>
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <p>수량: {item.quantity}개</p>
                              <p>단가: {item.price.toLocaleString()} 원</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            className="px-3 py-1.5 text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            onClick={() => alert('환불 요청이 접수되었습니다.')}
                          >
                            환불
                          </button>
                          <button
                            className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
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
      )}
    </div>
  );
};

export default OrderList;
