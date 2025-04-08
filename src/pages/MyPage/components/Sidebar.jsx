import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { IoHeartOutline, IoPersonCircleSharp as User, IoBagHandleOutline as ShoppingBag, IoLogOutOutline as LogOut, IoNotificationsOutline as Bell, IoSettingsOutline as Settings } from "react-icons/io5";

const Sidebar = ({ activeTab, setActiveTab, userId, userName, setUserId, setUserName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.status === 403) {
          navigate('/signin');
          return;
        }

        const data = await res.json();
        setUserId(data.userId);
        setUserName(data.userName);
      } catch (error) {
        console.error('❌ 사용자 정보 조회 실패:', error);
      }
    };

    fetchUserInfo();
  }, [navigate, setUserId, setUserName]);

  const handleLogoutClick = async () => {
    const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirmLogout) return;
  
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      setUserId(null);
      setUserName(null);
      alert("로그아웃 되었습니다.");
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert("로그아웃 처리 중 오류가 발생했습니다.");
      console.error("❌ 로그아웃 실패:", error);
    }
  };
  

  return (
    <div className="w-full md:w-64 h-full">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center mb-6">사용자 정보</h2>
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <User className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="font-medium">{userName}</h3>
          <p className="text-sm text-muted-foreground">사용자 ID: {userId ?? '로그인 필요'}</p>
        </div>

        <div className="flex flex-col space-y-2 p-4">
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md font-medium ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}>
            <User className="h-5 w-5" />
            <span>프로필 정보</span>
          </button>

          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md font-medium ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}>
            <ShoppingBag className="h-5 w-5" />
            <span>주문 내역</span>
          </button>

          <button onClick={() => setActiveTab('followedStores')} className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md font-medium ${activeTab === 'followedStores' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}>
            <IoHeartOutline className="h-5 w-5" />
            <span>팔로우 상점 정보</span>
          </button>

          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700">
            <Bell className="h-4 w-4" />
            <span>알림 설정</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700">
            <Settings className="h-4 w-4" />
            <span>계정 설정</span>
          </a>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
