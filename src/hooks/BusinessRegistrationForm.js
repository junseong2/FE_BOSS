import { useState } from 'react';
import { useBusinessVerification } from '@/hooks/useBusinessVerification';

const BusinessRegistrationForm = ({ onVerify }) => {
  const [businessNumber, setBusinessNumber] = useState('');
  const { isVerified, verify, loading, error } = useBusinessVerification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verify(businessNumber);
    if (isVerified) onVerify(); // 부모 컴포넌트에 인증 완료 알림
  };

  return (
    <div>
      <h2>사업자등록 인증</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          placeholder='사업자등록번호 입력'
          required
        />
        <button type='submit' disabled={loading}>
          {loading ? '확인 중...' : '인증하기'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isVerified && <p style={{ color: 'green' }}>✅ 인증 성공</p>}
    </div>
  );
};

export default BusinessRegistrationForm;
