import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfile';
import OrderList from './components/OrderList';
import { useNavigate } from 'react-router-dom';
const MyPage = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

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
    } catch (error) {
      console.error('❌ 사용자 정보 조회 오류:', error.message);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-[#e6f0ff]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 사이드바 */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={userName} userId={userId} setUserId={setUserId} // ⬅️ 추가
  setUserName={setUserName}/>
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-[#e6f0ff] ">
        {/* 탭 콘텐츠 */}
        {activeTab === "profile" && <UserProfile />}
        {activeTab === 'orders' && <OrderList userId={userId} />}
        {activeTab === "followedStores" && <div>팔로우 상점 정보</div>}
      </div>
    </div>
    </div>
    </div>
  );
};

export default MyPage;
