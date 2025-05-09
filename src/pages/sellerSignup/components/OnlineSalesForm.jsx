import { useState } from 'react';
import { UserCheck } from 'lucide-react';

const OnlineSalesForm = ({ onVerify }) => {
  const [salesNumber, setSalesNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (salesNumber === '2025부산금정구0456') {
      setSuccess(true);
      onVerify(salesNumber);
    } else {
      setError('잘못된 신고번호입니다. 다시 입력해 주세요.');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6 transition-all"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">통신판매업 신고 확인</h3>
          <p className="text-sm text-gray-500">신고번호를 입력해 인증해 주세요</p>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="salesNumber"
          className="block text-sm font-medium text-gray-700"
        >
          통신판매업 신고번호
        </label>
        <input
          id="salesNumber"
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          value={salesNumber}
          onChange={(e) => setSalesNumber(e.target.value)}
          placeholder="예: 2023-서울강남-1234"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-medium transition duration-300 shadow ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? '등록 중...' : '등록 완료'}
      </button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-center text-sm font-medium text-blue-600">
          ✅ 등록이 완료되었습니다.
        </p>
      )}
    </form>
  );
};

export default OnlineSalesForm;
