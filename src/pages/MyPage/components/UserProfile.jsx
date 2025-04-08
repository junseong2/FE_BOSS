import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userId, setUserId] = useState(null);
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['', '', '']);
  const [addresses, setAddresses] = useState([{ address1: '', address2: '', post: '', isDefault: false }]);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');  // 현재 비밀번호 상태
  const [newPassword, setNewPassword] = useState('');  // 새 비밀번호 상태
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 관련 에러 메시지 상태
  const [passwordSuccess, setPasswordSuccess] = useState(''); // 비밀번호 변경 성공 메시지 상태
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false); 

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 403) {
        navigate('/signin');
        return;
      }

      if (!response.ok) throw new Error('로그인 정보 조회 실패');

      const data = await response.json();


      setUserId(data.userId);
      setUserName(data.userName);
      setPassword(data.userPassword);
      setEmails([data.userEmail]);
      setPhones([
        data.userPhone1 ?? '',
        data.userPhone2 ?? '',
        data.userPhone3 ?? '',
      ]);

      const addressRes = await fetch(`http://localhost:5000/address/user/${data.userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (addressRes.ok) {
        const addressData = await addressRes.json();
        console.log("📦 불러온 주소 데이터:", addressData);
        setAddresses(addressData);
      } else {
        console.warn('주소 데이터를 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('❌ 사용자 정보 조회 오류:', error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userId) return alert('로그인 정보가 없습니다.');

    const requestData = {
      userId: Number(userId),
      email: emails[0],
      password,
      phones: phones.filter(Boolean),
      addresses: addresses.map((addr) => ({ ...addr })),
    };

    try {
      const response = await fetch('http://localhost:5000/auth/update-userinfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error(await response.text());

      alert('회원 정보가 수정되었습니다!');
      navigate('/mypage');
    } catch (error) {
      alert(`오류 발생: ${error.message}`);
    }
  };

  const handleAddressSearch = (index) => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const newAddresses = [...addresses];
        newAddresses[index].address1 = data.roadAddress;
        newAddresses[index].post = data.zonecode;
        setAddresses(newAddresses);
      },
    }).open();
  };

  const handleDefaultAddress = (index) => {
    const newAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index,
    }));
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    const newAddress = {
      address1: '',
      address2: '',
      post: '',
      isDefault: false,
    };

    // 기본 주소가 없다면 자동 설정
    const hasDefault = addresses.some((addr) => addr.isDefault);
    if (!hasDefault) {
      newAddress.isDefault = true;
    }

    setAddresses([...addresses, newAddress]);
  };

  const handleRemoveAddress = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);

    // 삭제 후 기본 주소가 없으면 첫 번째 주소를 기본 주소로 자동 설정
    if (!updated.some(addr => addr.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }

    setAddresses(updated);
  };

  // 👇 컴포넌트 안 최상단 useEffect 밑이나 fetchUserInfo 밑에 위치
  const handleDeleteAccount = async () => {
    if (!userId) return alert('로그인 정보가 없습니다.');

    const confirm = window.confirm('정말 탈퇴하시겠습니까?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/auth/usersout/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/');
        window.location.reload();
      } else {
        alert('탈퇴 처리 중 문제가 발생했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleCurrentPasswordSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentPassword) {
      setPasswordError('현재 비밀번호를 입력하세요.');
      return;
    }
  
    try {
      // 현재 비밀번호를 서버로 보내서 확인
      const response = await fetch('http://localhost:5000/auth/check-current-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({
          currentPassword: currentPassword,
        }),
      });
      
  
      const data = await response.json();
  
      if (response.ok) {
        setIsCurrentPasswordValid(true);
        setPasswordError('');
      } else {
        setPasswordError(data.message || '현재 비밀번호가 올바르지 않습니다.');
        setIsCurrentPasswordValid(false);
      }
    } catch (error) {
      setPasswordError('서버 오류가 발생했습니다.');
      console.log("1", error);
    }
  };
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmNewPassword) {
      setPasswordError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
  
    try {
      // 새 비밀번호 변경 요청
      const response = await fetch('http://localhost:5000/auth/update-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setPasswordError('');
        navigate("/")
      } else {
        setPasswordError(data.message || '비밀번호 변경 실패');
      }
    } catch (error) {
      setPasswordError('서버 오류가 발생했습니다.');
      console.log("2", error);
    }
  };


  return (
    <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg border p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-700">마이페이지</h2>

      {/* 탭 메뉴 */}
      <div className="flex justify-center gap-4 mb-6">
        {['profile', 'security', 'preferences'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            {{
              profile: '기본 정보',
              security: '보안 설정',
              preferences: '환경설정'
            }[tab]}
          </button>
        ))}
      </div>

      {/* 프로필 탭 */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* 이름/비밀번호 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">이름</label>
              <input className="w-full p-2 border rounded" type="text" value={userName} disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <input className="w-full p-2 border rounded" type="password" value={password} disabled />
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label className="text-sm font-medium text-gray-700">이메일</label>
            {emails.map((email, idx) => (
              <input
                key={idx}
                className="w-full p-2 border rounded mt-1"
                type="email"
                value={email}
                disabled
              />
            ))}
          </div>

          {/* 전화번호 */}
          <div>
            <label className="text-sm font-medium text-gray-700">전화번호</label>
            <div className="flex gap-2 mt-1">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  className="w-full p-2 border rounded"
                  type="text"
                  maxLength={i === 0 ? 3 : 4}
                  value={phones[i] ?? ''}
                  placeholder={['010', '0000', '0000'][i]}
                  onChange={(e) => {
                    const newPhones = [...phones];
                    newPhones[i] = e.target.value;
                    setPhones(newPhones);
                  }}
                />
              ))}
            </div>
          </div>

          {/* 주소 */}
          <div>
            <label className="text-sm font-medium text-gray-700">주소</label>
            {addresses.map((addr, idx) => (
              <div key={idx} className="space-y-2 mt-2 border p-4 rounded-md bg-gray-50 relative">
                <div className="flex gap-2">
                  <input className="flex-1 p-2 border rounded" type="text" placeholder="주소1" value={addr.address1} readOnly />
                  <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleAddressSearch(idx)}>
                    주소 검색
                  </button>
                </div>
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  placeholder="상세주소"
                  value={addr.address2}
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[idx].address2 = e.target.value;
                    setAddresses(newAddresses);
                  }}
                />
                <input className="w-full p-2 border rounded" type="text" placeholder="우편번호" value={addr.post} readOnly />
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="defaultAddress"
                      checked={addr.isDefault}
                      onChange={() => handleDefaultAddress(idx)}
                    />
                    기본 주소로 설정
                  </label>

                  {/* 삭제 버튼 - 기본 주소 줄 우측 */}
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(idx)}
                      className="text-sm text-black-400 hover:text-red-700 transition"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* 주소 추가 */}
            {addresses.length < 3 && (
              <button type="button" className="mt-2 text-sm text-blue-600 hover:underline" onClick={handleAddAddress}>
                + 주소 추가
              </button>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* 정보 수정 버튼 */}
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              정보 수정
            </button>

            {/* 홈으로 돌아가기 버튼 */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
            >
              홈으로 돌아가기
            </button>

            {/* 탈퇴하기 버튼 */}
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              탈퇴하기
            </button>

          </div>

        </form>
      )}

            {/* 보안 설정 탭 */}
            {activeTab === 'security' && (
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg border p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-700">비밀번호 변경</h2>

          {/* 현재 비밀번호 입력 */}
          {!isCurrentPasswordValid && (
            <form onSubmit={handleCurrentPasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                <input
                  id="current-password"
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              <div className="pt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  현재 비밀번호 확인
                </button>
              </div>
            </form>
          )}

          {/* 새 비밀번호 입력 (현재 비밀번호가 확인되면 표시) */}
          {isCurrentPasswordValid && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
              <div className="pt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  비밀번호 변경
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      

      {/* 환경설정 탭 */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">마케팅 이메일</h4>
              <p className="text-sm text-gray-500">프로모션 및 업데이트 정보를 이메일로 받기</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-6 transition-transform"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">새 알림</h4>
              <p className="text-sm text-gray-500">새로운 활동에 대한 알림 받기</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-6 transition-transform"></div>
            </div>
          </div>
          <div className="pt-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">설정 저장</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
