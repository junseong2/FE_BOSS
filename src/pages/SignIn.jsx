import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchUserInfo from '../utils/api';
import { getUserInfo, loginRequest } from '../services/auth.service';
import { getToken } from '../utils/storage';
import { useUser } from '../context/UserContext'; // ✅ 전역 context import

function SignIn({ onClose }) {

  const { setUserId, setUserName , setRecommendedProducts} = useUser(); // ✅ Context의 setter 사용


  const location = useLocation();
  const navigate = useNavigate();
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' ;

  // 로그인 상태 추적
  const checkLoginStatus = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const data = getUserInfo();
      setUserName(data.userName);
      navigate('/home');
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };

  // 소셜 로그인 인증 경로 리디렉트
  const getRedirectUrl = async () => {
    try {
      const data = getRedirectUrl();
      setRedirectUrl(data.redirectUrl);
    } catch (error) {
      console.error('리디렉션 URL 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    getRedirectUrl();
  }, [location.search]);


  // 로그인 폼 요청
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/locallogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('로그인 성공!');
        setUserName(result.userName);
        await fetchUserInfo(setUserId, setUserName);
  
        //--여기서 부터 수정 250403 서상훈-------------------
        //로그인 성공로직은 여기에 달면된다.
  
        //여기에 백엔드 get요청 요청대로 정보가 오면 메인 화면에 띄워줌
        // userId는 이 시점에 context에 들어가 있음
  
        const token = getToken();
        console.log('✅ 토큰:', token);
  
        const currentUserId = result.userId; // 🔥 아까처럼 result에서 직접 꺼냄
        console.log('✅ 로그인 응답에서 받은 userId:', currentUserId);
  
        if (!currentUserId) {
          throw new Error('userId가 null입니다. 추천 API 요청 중단');
        }
  
        const recommendRes = await fetch(
          `http://localhost:5000/vector/recommend?userId=${currentUserId}&n=20&m=3`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
  
        const recommendData = await recommendRes.json();
        console.log('✅ 추천 상품 응답:', recommendData);
  
        // ✅ 전역 상태에 추천상품 저장
        setRecommendedProducts(recommendData);
        //--여기까지 수정-------------------------------------
  
        onClose(); // ✅ 로그인 성공 시 모달 닫기
        navigate("/")
      } else {
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('❌ 로그인 요청 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-transparent z-50'>
      <div className='bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative'>
        <button
          className='absolute top-4 right-4 text-gray-600 hover:text-blue-500 text-xl font-bold'
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>로그인</h2>
        <div>
          <label htmlFor='email' className='text-gray-500'>
            이메일
          </label>
          <input
            type='email'
            placeholder='이메일 입력'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='mt-1.5'>
          <label htmlFor='password' className='text-gray-500'>
            비밀번호
          </label>
          <input
            type='password'
            placeholder='비밀번호 입력'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button
          onClick={handleLogin}
          className='w-full bg-[#4294F2] hover:bg-[#5d8ee4] cursor-pointer text-white py-2 rounded font-semibold transition'
        >
          로그인
        </button>







        <div className='flex justify-between mt-3'>
          <button
            onClick={() => {
           
              navigate('/signup');
              onClose();
            }}
            className='text-blue-500 hover:text-blue-700 text-sm'
          >
            회원가입
          </button>
          <button
            onClick={() => navigate('/auth/account-recovery')}
            className='text-blue-500 hover:text-blue-700 text-sm'
          >
            아이디/비밀번호 찾기
          </button>
        </div>

        <div className='flex flex-col relative'>
          <div className=' absolute w-full h-[0.15px] bg-gray-200 top-[50%] translate-y-[-50%]'></div>
          <span className='text-2sm font-medium text-center text-gray-400 my-5 bg-white z-10 w-[60px] mx-auto '>
            또는
          </span>
        </div>
        <div className='flex justify-center gap-4 mt-3'>
          <img
            src={`${BASE_URL}/uploads/kakao_login_logo.png`}
            width={15}
            height={15}
            alt='Kakao 로그인'
            className='cursor-pointer w-12 h-12 rounded-full bg-gray-200'
            onClick={() => (window.location.href = `${BASE_URL}/auth/kakao`)}
          />
          <img
            src={`${BASE_URL}/uploads/naver_login_logo.png`}
            alt='Naver 로그인'
            className='cursor-pointer  w-12 h-12 rounded-full bg-gray-200'
            onClick={() => (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/naver`)}
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;