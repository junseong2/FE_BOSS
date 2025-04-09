import { useState, useEffect } from 'react';
import { useBusinessVerification } from '/src/hooks/useBusinessVerification';
import { FileCheck } from 'lucide-react';

const BusinessRegistrationForm = ({ onVerify }) => {
  const [businessNumber, setBusinessNumber] = useState('');
  const { isVerified, verify, loading, error } = useBusinessVerification();

  useEffect(() => {
    if (isVerified) {
      onVerify(businessNumber);
    }
  }, [isVerified, onVerify]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verify(businessNumber);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6 transition-all"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">사업자 등록 확인</h3>
          <p className="text-sm text-gray-500">사업자 등록번호를 입력해 인증해 주세요</p>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="businessNumber"
          className="block text-sm font-medium text-gray-700"
        >
          사업자등록번호
        </label>
        <input
          id="businessNumber"
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          placeholder="000-00-00000"
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
        {loading ? '확인 중...' : '인증하기'}
      </button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      {isVerified !== null && (
        <p
          className={`text-center text-sm font-medium ${
            isVerified ? 'text-blue-500' : 'text-red-500'
          }`}
        >
          {isVerified ? '✅ 인증 성공' : '❌ 인증 실패'}
        </p>
      )}
    </form>
  );
};

export default BusinessRegistrationForm;
