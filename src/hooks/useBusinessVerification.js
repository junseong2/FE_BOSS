import { useState } from 'react';
import axios from 'axios';

export const useBusinessVerification = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 사업자 등록 인증 함수
  const verify = async (businessNumber) => {
    setLoading(true);
    try {
      console.log('🔍 사업자등록번호 인증 요청:', businessNumber);
      const response = await axios.post('http://localhost:5000/business/check', {
        businesses: [{ b_no: businessNumber }],
      });
      console.log('📄 응답 데이터:', response.data); // 응답 데이터 로그


      if (response.data && response.data.data[0].b_stt_cd === "01") {
        setIsVerified(true); // 인증 성공
      } else {
        setIsVerified(false); // 인증 실패
        setError('인증 실패: 사업자 등록번호가 일치하지 않거나 다른 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('인증 실패: 서버 오류'); // 서버 오류 처리
      setIsVerified(false);
    }
    setLoading(false);
  };

  return { isVerified, verify, loading, error };
};
