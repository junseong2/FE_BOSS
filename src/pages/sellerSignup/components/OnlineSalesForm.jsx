import { useState } from 'react';

const OnlineSalesForm = ({ onVerify }) => {
  const [salesNumber, setSalesNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 여기서 salesNumber가 '123'이면 성공으로 간주
    if (salesNumber === '123') {
      setSuccess(true); // 성공 처리
      onVerify(salesNumber); // 인증 완료 후 부모 컴포넌트에 알림
    } else {
      setError('잘못된 신고번호입니다. 다시 입력해 주세요.'); // 실패 처리
    }

    setLoading(false);
  };

  return (
    <div className='max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
        통신판매업 신고
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <input
            id='salesNumber'
            type='text'
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            value={salesNumber}
            onChange={(e) => setSalesNumber(e.target.value)}
            placeholder='통신판매업 신고번호 입력'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300'
          disabled={loading}
        >
          {loading ? '등록 중...' : '등록 완료'}
        </button>
      </form>

      {error && <p className='mt-4 text-center text-red-500'>{error}</p>}
      {success && <p className='mt-4 text-center text-green-500'>✅ 등록이 완료되었습니다.</p>}
    </div>
  );
};

export default OnlineSalesForm;
