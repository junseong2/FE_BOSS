import { IoClose } from "react-icons/io5";
import { useState } from "react";

export default function SellerSettlementForm({ onCancel, onSubmit, isLoading }) {
  const [amount, setAmount] = useState("");

  const formatAmount = (value) => {
    const onlyNumbers = value.replace(/[^\d]/g, "");
    if (!onlyNumbers) return "";
    return parseInt(onlyNumbers, 10).toLocaleString();
  };

  const handleAmountChange = (e) => {
    setAmount(formatAmount(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rawAmount = formData.get("amount").replace(/[^\d]/g, "");
    formData.set("amount", rawAmount); // 실제 전송 시 , 제거
    await onSubmit(formData);
    onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">💰 정산 신청</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 text-xl">
            <IoClose />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          정산 받으신 금액과 계좌 정보를 입력해주세요. <br />
          <span className="text-blue-600 font-semibold">금일 신청 시 다음 달 15일</span>에 정산 처리됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정산 금액</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">￦</span>
              <input
                type="text"
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="정산 금액을 입력하세요"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">정산 가능 금액: ₩3,678,900</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">은행</label>
            <div className="relative">
              <select
                name="bank"
                className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>은행을 선택하세요</option>
                <option>신한은행</option>
                <option>국민은행</option>
                <option>우리은행</option>
                <option>하나은행</option>
              </select>

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
            <input
              type="text"
              name="account"
              placeholder="계좌번호를 입력하세요 ('-' 제외)"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예금주</label>
            <input
              type="text"
              name="name"
              placeholder="예금주명을 입력하세요"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-sky-500 transition-all disabled:opacity-60"
          >
            {isLoading ? "전송 중..." : "정산 신청하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
