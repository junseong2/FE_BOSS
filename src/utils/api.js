// setRole 추가!
import {BASE_URL} from '../lib/api'
const fetchUserInfo = async (
  setUserId,
  setUserName,
  setEmails = () => {},
  setPhones = () => {},
  setAddresses = () => {},
  setRole = () => {} // ✅ 여기에 기본 파라미터 추가!
) => {
  try {
    const response = await fetch(BASE_URL+'/auth/user-info', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('접근 권한이 없습니다. 로그인 해주세요.');
      }
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ 사용자 정보:', data);

    // ✅ 상태 업데이트
    setUserId(data.userId || '');
    setUserName(data.userName || '');
    setEmails([data.userEmail] || []);
    setPhones([data.userPhone1, data.userPhone2, data.userPhone3]);
    setAddresses([]); // 주소는 다른 API에서 따로 불러오면 됩니다

    // ✅ 역할 설정 (SELLER, CUSTOMER, ADMIN 등)
    setRole(data.userRole || 'CUSTOMER');
  } catch (error) {
    console.error('❌ 사용자 정보 조회 오류:', error.message);
  }
};

export default fetchUserInfo;
