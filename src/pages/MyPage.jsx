import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './styles/mypage.css';

function MyPage() {
  const [userId, setUserId] = useState(null);
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [addresses, setAddresses] = useState([
    { address1: '', address2: '', post: '', isDefault: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userName === null) {
      navigate('/signin');
    }
  }, [userName, navigate]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 403) {
        console.warn('❌ 로그인 정보 없음. 로그인 페이지로 이동.');
        navigate('/signin');
        return;
      }

      if (!response.ok) {
        throw new Error('로그인 정보 조회 실패');
      }

      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);
      setEmails(data.emails.length > 0 ? data.emails : ['']);
      setPhones(data.phones.length > 0 ? data.phones : ['']);
      setAddresses(
        data.addresses.length > 0
          ? data.addresses
          : [{ address1: '', address2: '', post: '', isDefault: false }]
      );
    } catch (error) {
      console.error('❌ 사용자 정보 조회 오류:', error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    const requestData = {
      userId: Number(userId),
      email: emails[0],
      password,
      phones: phones.filter(Boolean),
      addresses: addresses.map((addr) => ({
        address1: addr.address1,
        address2: addr.address2,
        post: addr.post,
        isDefault: addr.isDefault,
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/auth/update-userinfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`회원 정보 수정 실패: ${errorText}`);
      }

      alert('회원 정보가 수정되었습니다!');
      navigate('/home');
    } catch (error) {
      console.error('❌ 회원 정보 수정 오류:', error);
      alert(`오류 발생: ${error.message}`);
    }
  };

  const handleAddressSearch = (index) => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const newAddresses = [...addresses];
        newAddresses[index].address1 = data.roadAddress;
        newAddresses[index].post = data.zonecode;
        setAddresses(newAddresses);
      },
    }).open();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">마이페이지</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <label className="block text-gray-700">이름</label>
        <input className="w-full p-2 border rounded" type="text" value={userName} disabled />
        
        <label className="block text-gray-700">비밀번호</label>
        <input className="w-full p-2 border rounded" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <label className="block text-gray-700">이메일</label>
        {emails.map((email, index) => (
          <input key={index} className="w-full p-2 border rounded" type="email" value={email} onChange={(e) => {
            const newEmails = [...emails];
            newEmails[index] = e.target.value;
            setEmails(newEmails);
          }} required />
        ))}
        <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => setEmails([...emails, ''])}>이메일 추가</button>
        
        <label className="block text-gray-700">전화번호</label>
        {phones.map((phone, index) => (
          <input key={index} className="w-full p-2 border rounded" type="text" value={phone} onChange={(e) => {
            const newPhones = [...phones];
            newPhones[index] = e.target.value;
            setPhones(newPhones);
          }} />
        ))}
        <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => setPhones([...phones, ''])}>전화번호 추가</button>
        
        <label className="block text-gray-700">주소</label>
        {addresses.map((address, index) => (
          <div key={index}>
            <input className="w-full p-2 border rounded" type="text" placeholder="주소1" value={address.address1} readOnly />
            <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => handleAddressSearch(index)}>주소 검색</button>
            
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="주소2 (상세주소)"
              value={address.address2}
              onChange={(e) => {
                const newAddresses = [...addresses];
                newAddresses[index].address2 = e.target.value;
                setAddresses(newAddresses);
              }}
            />
            <input className="w-full p-2 border rounded" type="text" placeholder="우편번호" value={address.post} readOnly />
            <label className="block">
              <input
                type="checkbox"
                checked={address.isDefault}
                onChange={() => {
                  const newAddresses = [...addresses];
                  newAddresses[index].isDefault = !newAddresses[index].isDefault;
                  setAddresses(newAddresses);
                }}
              />
              기본 주소
            </label>
          </div>
        ))}
        {addresses.length < 3 && (
          <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => setAddresses([...addresses, { address1: '', address2: '', post: '', isDefault: false }])}>
            주소 추가
          </button>
        )}

        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">정보 수정</button>
      </form>

      <button className="mt-4 w-full bg-gray-500 text-white p-2 rounded" onClick={() => navigate('/')}>홈으로 돌아가기</button>
    </div>
  );
}

export default MyPage;
