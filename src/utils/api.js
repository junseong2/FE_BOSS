// utils/api.js
const fetchUserInfo = async (
  setUserId,
  setUserName,
  setEmails = () => {},  // 기본 값으로 빈 함수 추가
  setPhones = () => {},  // 기본 값으로 빈 함수 추가
  setAddresses = () => {} // 기본 값으로 빈 함수 추가
) => {
  try {
    const response = await fetch('http://localhost:5000/auth/user-info', {
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

    // ✅ 상태 업데이트 (NULL 방지)
    setUserId(data.userId || '');
    setUserName(data.userName || '');
    setEmails([data.userEmail || '']);
    setPhones([data.userPhone1, data.userPhone2, data.userPhone3].filter(Boolean));
    setAddresses([]); // 아직 주소 안 내려주는 경우 빈 배열로 처리
  } catch (error) {
    console.error('❌ 사용자 정보 조회 오류:', error.message);
  }
};

export default fetchUserInfo;
