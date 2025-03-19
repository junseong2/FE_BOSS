const fetchUserInfo = async (setUserId, setUserName, setEmails, setPhones, setAddresses) => {
  try {
    const response = await fetch('http://localhost:5000/auth/user-info', {
      method: 'GET',
      credentials: 'include', // ✅ JWT 쿠키 포함
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
    setEmails(data.emails.length > 0 ? data.emails : ['']); // ✅ 기본값 설정
    setPhones(data.phones.length > 0 ? data.phones : ['']);
    setAddresses(
      data.addresses.length > 0
        ? data.addresses
        : [{ address1: '', address2: '', post: '', isDefault: false }],
    );
  } catch (error) {
    console.error('❌ 사용자 정보 조회 오류:', error.message);
  }
};

// 기본 내보내기 추가
export default fetchUserInfo;
