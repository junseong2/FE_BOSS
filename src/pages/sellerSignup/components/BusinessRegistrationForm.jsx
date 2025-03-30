import { useState, useEffect } from 'react';
import { useBusinessVerification } from '/src/hooks/useBusinessVerification';

const BusinessRegistrationForm = ({ onVerify }) => {
  const [businessNumber, setBusinessNumber] = useState('');
  const { isVerified, verify, loading, error } = useBusinessVerification();

  // 인증 상태가 변경될 때마다 onVerify 호출
  useEffect(() => {
    if (isVerified) {
      onVerify(businessNumber); // 인증 성공 시 부모 컴포넌트에 전달
    }
  }, [isVerified, onVerify]); // isVerified가 변경되면 호출

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verify(businessNumber);
  };

  return (
    <div className='max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
        사업자 등록 인증
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='businessNumber' className='block text-sm font-medium text-gray-700'>
            사업자등록번호
          </label>
          <input
            id='businessNumber'
            type='text'
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            placeholder='사업자등록번호 입력'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300'
          disabled={loading}
        >
          {loading ? '확인 중...' : '인증하기'}
        </button>
      </form>

      {error && <p className='mt-4 text-center text-red-500'>{error}</p>}

      {isVerified !== null && (
        <p className={`mt-4 text-center ${isVerified ? 'text-green-500' : 'text-red-500'}`}>
          {isVerified ? '✅ 인증 성공' : '❌ 인증 실패'}
        </p>
      )}

      <p className='mt-4 text-center text-sm text-gray-500'>
        사업자 회원가입이 가능합니다.
      </p>
    </div>
  );
};

export default BusinessRegistrationForm;
