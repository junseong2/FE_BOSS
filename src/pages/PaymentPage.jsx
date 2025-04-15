"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { portoneRequest, updatePaymentStatus } from "../services/payment.service"
import { createOrders } from "../services/order.service"
import {
  CreditCard,
  ShieldCheck,
  Truck,
  Package,
  User,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"

function PaymentPage() {
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [orderTotal, setOrderTotal] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [userName, setUserName] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("totalpay")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("010-1234-5678") // 기본값
  const [step, setStep] = useState(1) // 1: 배송정보, 2: 결제방법
  const navigate = useNavigate()
  const [channelKey, setChannelKey] = useState("")

  // 포트원 SDK 동적 추가
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdn.iamport.kr/v1/iamport.js"
    script.async = true
    script.onload = () => {
      console.log("✅ 포트원 SDK 로드 완료")
      setSuccessMessage("결제 시스템이 준비되었습니다.")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/user-info", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        })

        if (response.status === 403) {
          console.warn("❌ 로그인 필요. 로그인 페이지로 이동.")
          navigate("/signin")
          return
        }

        if (!response.ok) throw new Error("로그인 정보 조회 실패")

        const data = await response.json()
        setUserId(data.userId)
        setUserName(data.userName)
        setEmail(data.userEmail || "")
        const addressRes = await fetch(`http://localhost:5000/address/user/${data.userId}`, {
          method: "GET",
          credentials: "include",
        });
    
        if (addressRes.ok) {
          const addressData = await addressRes.json();
    
          // ✅ 기본 주소가 있는 경우만 설정
          const defaultAddress = addressData.find((addr) => addr.isDefault);
          setAddress(defaultAddress?.address1 || "주소 없음");
        } else {
          console.warn("주소 데이터를 불러오지 못했습니다.");
          setAddress("주소 없음");
        }
    
        // ✅ 전화번호 조합
        const phone = [data.userPhone1, data.userPhone2, data.userPhone3].filter(Boolean).join("-");
        setPhoneNumber(phone || "010-0000-0000");
    
      } catch (error) {
        console.error("❌ 사용자 정보 조회 오류:", error.message);
        setErrorMessage("사용자 정보를 불러오는 중 오류 발생.");
      }
    };

    fetchUserInfo()
  }, [navigate])

  useEffect(() => {
    if (!userId) return

    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:5000/cart", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        })

        if (!response.ok) throw new Error("장바구니 조회 실패")

        const data = await response.json()
        setCartItems(data.cartItems || [])

        const total = data.cartItems.reduce(
          (sum, item) => sum + (Number(item.productPrice) || 0) * (Number(item.quantity) || 0),
          0,
        )
        setOrderTotal(total)
      } catch (error) {
        console.error("장바구니 조회 오류:", error.message)
        setErrorMessage("장바구니 정보를 불러오는 중 오류 발생.")
      }
    }

    fetchCart()
  }, [userId])

  useEffect(() => {
    const fetchChannelKey = async () => {
      try {
        const response = await fetch(`http://localhost:5000/payment/channel-key/${selectedPaymentMethod}`)
        if (!response.ok) throw new Error("채널 키 가져오기 실패")

        const data = await response.json()
        setChannelKey(data.channelKey)
      } catch (error) {
        console.error("채널 키 로드 오류:", error)
      }
    }

    fetchChannelKey()
  }, [selectedPaymentMethod])

  const handlePayment = async () => {
    if (!channelKey) {
      setErrorMessage("결제 채널 정보를 불러오지 못했습니다.")
      return
    }

    if (!userId) {
      setErrorMessage("사용자 정보가 없습니다. 다시 로그인해주세요.")
      navigate("/signin")
      return
    }

    if (!cartItems.length) {
      setErrorMessage("장바구니가 비어 있습니다.")
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage("")

      // 1. 주문 생성 (Order)
      const order = { userId, totalPrice: orderTotal }

      const orderId = await createOrders(order)
      console.log("✅ 주문 생성 완료:", orderId)

      const IMP = window.IMP
      if (!IMP) throw new Error("포트원 SDK 로드 실패")

      IMP.init("imp85011465")

      const impUid = `imp_${Date.now()}`

      // 2. 결제 요청
      IMP.request_pay(
        {
          channelKey,
          pay_method: "card",
          merchant_uid: impUid,
          name: "상품 결제",
          amount: orderTotal,
          buyer_email: email,
          buyer_name: userName,
          buyer_tel: phoneNumber,
          buyer_addr: address,
          m_redirect_url: "http://localhost:5173",
        },
        async (rsp) => {
          if (rsp.success) {
            console.log("✅ 결제 성공:", rsp)

            // 3. 결제 정보 저장 (Payment)
            const paymentData = {
              userId,
              orderId,
              totalAmount: orderTotal,
              paymentMethod: selectedPaymentMethod,
              impUid: rsp.imp_uid,
            }

            console.log("📩 [DEBUG] 전송할 결제 데이터:", paymentData)

            await portoneRequest(paymentData)

            // 4. 결제 상태 업데이트 (PAID)
            const statusData = { impUid: rsp.imp_uid, status: "PAID" }
            await updatePaymentStatus(statusData)

            try {
              await fetch("http://localhost:5000/cart/clear", {
                method: "POST",
                credentials: "include",
              })
              console.log("🧹 장바구니 비우기 완료")
            } catch (clearError) {
              console.warn("⚠️ 장바구니 비우기 실패:", clearError.message)
            }

            navigate("/")
          } else {
            setErrorMessage("결제에 실패했습니다.")

            const statusData = { impUid: rsp.imp_uid, status: "FAILED" }
            await updatePaymentStatus(statusData)
          }
        },
      )
    } catch (error) {
      setErrorMessage("결제 요청 중 오류 발생: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 2) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // 결제 방법 아이콘 매핑
  const paymentIcons = {
    totalpay: (
      <div className="w-10 h-10 rounded-full bg-blue-00 flex items-center justify-center text-blue-600">
        <CreditCard size={20} />
      </div>
    ),
    kakaopay: (
      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
        <img
          src="/images/kakaopay-icon.png"
          alt="KakaoPay"
          className="w-5 h-5"
          onError={(e) => {
            e.target.onerror = null
            e.target.parentNode.innerHTML = '<span className="font-bold text-yellow-600">K</span>'
          }}
        />
      </div>
    ),
    tosspay: (
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="font-bold text-blue-600">T</span>
      </div>
    ),
    paycopay: (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <span className="font-bold text-red-600">P</span>
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* 알림 메시지 */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md animate-fade-in">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md animate-fade-in">
          <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
          <p className="text-gray-600">안전하고 빠른 결제를 도와드립니다</p>

          {/* 진행 단계 표시 */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className={`h-1 w-20 ${step >= 2 ? "bg-blue-500" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm">
            <span className={`w-24 text-center ${step === 1 ? "text-blue-500 font-medium" : "text-gray-500"}`}>
              배송 정보
            </span>
            <span className={`w-24 text-center ${step === 2 ? "text-blue-500 font-medium" : "text-gray-500"}`}>
              결제 방법
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽: 주문 정보 및 배송 정보 */}
          <div className="lg:w-7/12">
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-500 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Truck size={20} />
                    배송 정보
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <User size={18} className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="flex-1 bg-transparent focus:outline-none"
                          placeholder="받는 분 이름"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <MapPin size={18} className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="flex-1 bg-transparent focus:outline-none"
                          placeholder="배송 주소"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <Mail size={18} className="text-gray-400 mr-2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-transparent focus:outline-none"
                          placeholder="이메일 주소"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <Phone size={18} className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 bg-transparent focus:outline-none"
                          placeholder="연락처"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => navigate("/cart")}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      장바구니로 돌아가기
                    </button>

                    <button
                      onClick={nextStep}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                      다음 단계
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-500 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <CreditCard size={20} />
                    결제 방법
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {["totalpay", "kakaopay", "tosspay", "paycopay"].map((method) => (
                      <div
                        key={method}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === method
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedPaymentMethod(method)}
                      >
                        <div className="flex items-center gap-3">
                          {paymentIcons[method]}
                          <div>
                            <p className="font-medium text-gray-900">{method.toUpperCase()}</p>
                            <p className="text-xs text-gray-500">
                              {method === "totalpay" && "신용카드, 계좌이체 등"}
                              {method === "kakaopay" && "카카오페이 간편결제"}
                              {method === "tosspay" && "토스페이 간편결제"}
                              {method === "paycopay" && "페이코페이 간편결제"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">안전한 결제</p>
                        <p className="text-xs text-gray-600 mt-1">
                          모든 결제는 안전하게 암호화되어 처리됩니다. 개인정보는 철저히 보호됩니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      이전 단계
                    </button>

                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:bg-gray-400 shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          처리 중...
                        </>
                      ) : (
                        <>
                          결제하기
                          <CreditCard size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="bg-sky-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Package size={20} />
                  주문 요약
                </h2>
              </div>

              <div className="p-6">
                {cartItems.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.cartId} className="flex gap-3 pb-3 border-b border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.productImage ? (
                            <img
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-500">{item.quantity}개</p>
                            <p className="font-medium text-blue-700">
                              {(item.productPrice * item.quantity).toLocaleString()}원
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Package size={40} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">장바구니가 비어 있습니다</p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>상품 금액</span>
                    <span>{orderTotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>배송비</span>
                    <span>무료</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>할인</span>
                    <span>0원</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">총 결제 금액</span>
                      <span className="text-2xl text-blue-500">{orderTotal.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
