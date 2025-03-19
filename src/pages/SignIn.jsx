import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchUserInfo from '../utils/api';


function SignIn({ onClose }) {
  // ✅ 모달 닫기 함수 추가
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getRedirectUrl = async () => {
    try {
      console.log('리디렉션 URL 가져오는 중...');
      const response = await fetch('http://localhost:5000/auth/get-redirect-url', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('서버에서 리디렉션 URL을 가져오지 못함');
      }

      const data = await response.json();
      console.log('가져온 리디렉션 URL:', data.redirectUrl);
      setRedirectUrl(data.redirectUrl);
    } catch (error) {
      console.error('리디렉션 URL 가져오기 실패:', error);
    }

    await fetchUserInfo(setUserId, setUserName);
    console.log('현재 사용자 ID:', userId);
    console.log('현재 사용자 이름:', userName);
  };

  const checkLoginStatus = async () => {
    try {
      console.log('로그인 상태 확인 중...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('토큰이 없습니다. 로그인 필요');
        return;
      }

      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('로그인된 사용자 정보:', data);
        setUserName(data.userName);
        navigate('-1');
      } else {
        console.error('로그인 상태 확인 실패:', response.status);
      }
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    console.log('SignIn useEffect 실행됨');
    checkLoginStatus();
    getRedirectUrl();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const userName = params.get('userName');

    console.log('URL Params:', { userId, userName });

    if (userId && userName) {
      setUserName(userName);
    }
  }, [location.search]);

  const handleLogin = async () => {
    try {    console.log("onClose prop:", onClose); // ✅ onClose가 제대로 전달되었는지 확인

      const response = await fetch('http://localhost:5000/auth/locallogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (onClose) onClose();
        setUserName(result.userName);
        const redirectPath = location.state?.from || '/'; // ✅ 원래 페이지가 있으면 이동, 없으면 홈으로
        navigate(redirectPath);
        await fetchUserInfo(setUserId, setUserName);
  
      } else {
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm relative">
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-blue-500 text-2xl font-bold transition-transform transform hover:rotate-90" 
          onClick={onClose}>
          ×
        </button>
        <h2 className="text-2xl font-bold text-center text-black-800 mb-6">로그인</h2>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button 
          onClick={handleLogin} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-black py-3 text-center rounded-lg font-bold transition-all">
          로그인
        </button>

        <button 
          onClick={() => window.location.href = '/signup'} 
          className="w-full mt-4 text-blue-500 text-center">
          회원가입
        </button>
        <h1 className="text-lg font-semibold text-center text-gray-700 mt-6">또는 소셜 로그인</h1>
        <div className="flex justify-center gap-4 mt-4">
          
          
          <img
            src={`${BASE_URL}/uploads/kakao_login_logo.png`} 
            alt='Kakao 로그인'
            className='cursor-pointer w-24 h-auto'
            onClick={() => window.location.href = 'http://localhost:5000/auth/kakao'}
          />


          
          <img
            src={`${BASE_URL}/uploads/naver_login_logo.png`} 
            alt='Naver 로그인'
            className='cursor-pointer w-24 h-auto'
            onClick={() => window.location.href = 'http://localhost:5000/auth/naver'}
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
