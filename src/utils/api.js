// api.js
const fetchUserInfo = async (setUserId, setUserName) => {
  try {
    const response = await fetch('http://localhost:5000/auth/user-info', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('로그인 정보 조회 실패');
    }

    const data = await response.json();
    setUserId(data.userId);
    setUserName(data.userName);
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error.message);
  }
};

// 기본 내보내기 추가
export default fetchUserInfo;
