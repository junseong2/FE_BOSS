import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

import { getToken } from '../../utils/storage';
import fetchUserInfo from '../../utils/api';
import { BASE_URL } from '../../lib/api';
import { loginRequest } from '../../services/auth.service';

import kakao from '../../assets/kakao_login_logo.png'
import naver from '../../assets/naver_login_logo.png'

function SignIn({ onClose, onLoginSuccess, isModalOpen }) {
  const { setUserId, setUserName, setRecommendedProducts, setRole } = useUserContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 상태 추적
  const checkLoginStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/user-info`, {
        credentials: 'include', //  쿠키 포함 필수
      });

      if (res.ok) {
        const data = await res.json();
        setUserName(data.userName);
        setUserId(data.userId);
      }
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('code') && (window.location.href.includes('naver') || window.location.href.includes('kakao'))) {
      fetchUserInfo(setUserId, setUserName, setEmail, setPhones, setAddresses);
      onClose?.();
    }
  }, [location.search]);

  useEffect(() => {
    checkLoginStatus();
  }, [location.search]);

  // 로그인 요청
  const handleLogin = async () => {
    const userInfo = { email, password }
    const data = await loginRequest(userInfo)
    console.log(data)
    if (data.userName !== null) {
      alert("로그인 성공")

      setUserName(result.userName);

      await fetchUserInfo(setUserId, setUserName, undefined, undefined, undefined, setRole);

      const token = getToken();
      const currentUserId = result.userId;

      if (!currentUserId) throw new Error('userId가 null입니다');

      const recommendRes = await fetch(
        BASE_URL + `/vector/recommend?userId=${currentUserId}&n=20&m=3`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const recommendData = await recommendRes.json();
      setRecommendedProducts(recommendData);

      onLoginSuccess(); // Top.jsx에 로그인 성공 알림
      onClose();
    }
  }

  return (
    <div aria-label='로그인 모달' aria-hidden={isModalOpen ? 'false' : 'true'} className={`${isModalOpen ? 'visible opacity-100' : 'invisible opacity-0'} fixed inset-0 flex items-center justify-center bg-transparent z-50`}>
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-blue-500 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">로그인</h2>
        <div>
          <label className="text-gray-500">이메일</label>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-1.5">
          <label className="text-gray-500">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-[#4294F2] hover:bg-[#5d8ee4] cursor-pointer text-white py-2 rounded font-semibold transition"
        >
          로그인
        </button>

        <div className="flex justify-between mt-3">
          <button
            onClick={() => {
              navigate('/signup');
              onClose();
            }}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            회원가입
          </button>
          <button
            onClick={() => {
              navigate('/auth/account-recovery');
              onClose();
            }}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="flex flex-col relative">
          <div className="absolute w-full h-[0.15px] bg-gray-200 top-[50%] translate-y-[-50%]"></div>
          <span className="text-2sm font-medium text-center text-gray-400 my-5 bg-white z-10 w-[60px] mx-auto">
            또는
          </span>
        </div>

        <div className="flex justify-center gap-4 mt-3">
          <img
            src={kakao}
            alt="Kakao 로그인"
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-200"
            onClick={() => (window.location.href = `${BASE_URL}/auth/kakao`)}
          />
          <img
            src={naver}
            alt="Naver 로그인"
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-200"
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/naver`)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
