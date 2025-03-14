import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchUserInfo from '../utils/api';

import './styles/signin.css'; // ✅ signin.css 추가!

function SignIn({ onClose }) {
  // ✅ 모달 닫기 함수 추가
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        navigate('/');
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

        onClose(); // ✅ 로그인 성공 시 모달 닫기
      } else {
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `http://localhost:5000/auth/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = 'http://localhost:5000/auth/naver';
  };

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5000/auth/google`;
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className='signin-modal-overlay'>
      <div className='signin-modal-content'>
        <button className='signin-modal-close-btn' onClick={onClose}>
          X
        </button>{' '}
        {/* ✅ 닫기 버튼 */}
        <h2>로그인</h2>
        <input
          type='email'
          placeholder='이메일 입력'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='비밀번호 입력'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className='login-btn'>
          로그인
        </button>
        <button onClick={handleSignUpRedirect} className='signup-redirect-btn'>
          회원가입
        </button>
        <h1>
          또는<br></br>소셜 로그인
        </h1>
        <img
          src='src/assets/kakao_login_logo.png'
          alt='Kakao 로그인'
          className='login-btn'
          onClick={handleKakaoLogin}
          style={{ cursor: 'pointer', width: '100px', height: 'auto' }}
        />
        <img
          src='src/assets/naver_login_logo.png'
          alt='Naver 로그인'
          className='login-btn'
          onClick={handleNaverLogin}
          style={{ cursor: 'pointer', width: '100px', height: 'auto', marginLeft: '50px' }}
        />
      </div>
    </div>
  );
}

export default SignIn;
